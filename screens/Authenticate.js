import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  AsyncStorage,
  Image
} from 'react-native';
import { AuthSession } from 'expo';
import { API } from './../constants';
import { REACT_APP_AUTH_API } from 'react-native-dotenv';
import defaultConnector from '../redux/connectors/defaultConnector';
import { secure_fetch } from './../services/api';
import { ASYNC_STORAGE } from '../constants';
import appLogo from './../assets/images/logo2x.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4b5487',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export class Authenticate extends React.Component {
  state = {
    loading: true,
    result: {}
  };

  async componentDidMount() {
    await this.authorizeUser();
  }

  getAsyncStorageToken = async () =>
    (await AsyncStorage.getItem(ASYNC_STORAGE.TOKEN)) || '{}';

  storeAsyncStorageToken = async response => {
    const { access_token, refresh_token, expires_in } = response;
    await AsyncStorage.setItem(
      ASYNC_STORAGE.TOKEN,
      JSON.stringify({
        access_token,
        refresh_token,
        expires_in
      })
    );
  };

  authorizeUser = async () => {
    try {
      const { access_token } = JSON.parse(await this.getAsyncStorageToken());
      if (!access_token) {
        await this.signIn();
      } else {
        await this.verifyUser(access_token);
      }
    } catch (error) {
      this.setState({
        loading: false,
        result: {
          type: 'error',
          ...error
        }
      });
    }
  };

  signIn = async () => {
    this.setState({ result: {}, loading: true });
    const redirect_uri = AuthSession.getRedirectUrl();
    const options = {
      authUrl: `${REACT_APP_AUTH_API}?redirect_uri=${redirect_uri}`
    };

    const result = await AuthSession.startAsync(options);
    this.setState({ result });
    if (result.type === 'success') {
      await this.storeAsyncStorageToken(result.params);
      const { access_token } = JSON.parse(await this.getAsyncStorageToken());
      await this.verifyUser(access_token);
    } else {
      this.setState({ loading: false });
    }
  };

  navigateToMain = async current_user => {
    const { navigation, userActions } = this.props;
    this.setState({ loading: false });
    let user = {
      ...current_user
    };
    await userActions.setUser(user);
    navigation.navigate('Main', user);
  };

  verifyUser = async accessToken => {
    let results;
    try {
      results = await secure_fetch(`${API.REST.USER_PROFILE}`, {
        accessToken
      });
      if (!results.ok) {
        throw new Error(results.statusText);
      }
      let user = await results.json();
      user = { ...user, token: accessToken };
      this.navigateToMain(user);
    } catch (error) {
      console.log(error);
      try {
        const { refresh_token } = JSON.parse(await this.getAsyncStorageToken());
        if (!refresh_token) {
          throw new Error(
            `Your refresh token is expired or invalid. Please login again.`
          );
        }
        await this.getRefreshToken(refresh_token);
      } catch (error) {
        this.setState({
          loading: false,
          result: {
            type: 'error',
            ...error
          }
        });
      }
    }
  };

  getRefreshToken = async refreshToken => {
    try {
      const results = await secure_fetch(`${API.REST.REFRESH_TOKEN}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });
      if (!results.ok) {
        throw new Error(results.statusText);
      }
      const refreshJwt = await results.json();
      if (!refreshJwt) {
        await this.reauthorizeUser();
      } else {
        await this.storeAsyncStorageToken(refreshJwt);
        const { access_token } = refreshJwt;
        const userResults = await secure_fetch(`${API.REST.USER_PROFILE}`, {
          accessToken: access_token
        });

        if (!userResults.ok) {
          throw new Error(userResults.statusText);
        }
        this.navigateToMain(userResults.json());
      }
    } catch (error) {
      await this.reauthorizeUser();
    }
  };

  reauthorizeUser = async () => {
    const asyncStorageKeys = await AsyncStorage.getAllKeys();
    const removeKeys = asyncStorageKeys.map(key => {
      return AsyncStorage.removeItem(key);
    });
    await Promise.all(removeKeys);
    await this.authorizeUser();
  };

  flattenScreenPermissions = permissions => {
    return permissions
      .map(permission => permission.metadata.screens)
      .reduce((accumulator, current) => {
        return accumulator.concat(current);
      }, [])
      .reduce((accumulator, current) => {
        accumulator[current] = true;
        return accumulator;
      }, {});
  };

  render() {
    let { result, loading } = this.state;
    return (
      <View style={styles.container}>
        {loading && (
          <View>
            <Image
              source={appLogo}
              style={{ height: 100, width: 300 }}
              resizeMode="contain"
            />
            <ActivityIndicator size="large" animating color="#ffffff" />
          </View>
        )}
        {!loading && result.type === 'error' && (
          <View>
            <TouchableOpacity onPress={this.signIn}>
              <Text>An error occured. Try again?</Text>
            </TouchableOpacity>
          </View>
        )}
        {!loading && result.type === 'cancel' && (
          <View>
            <TouchableOpacity onPress={this.signIn}>
              <Text>You cancelled the sign-in process. Try again?</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

export default defaultConnector(Authenticate);
