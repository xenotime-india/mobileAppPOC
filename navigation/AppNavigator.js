import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { NetworkConsumer } from 'react-native-offline';
import MainTabNavigator from './MainTabNavigator';
import Authenticate from './../screens/Authenticate';
import defaultConnector from '../redux/connectors/defaultConnector';
import { from } from 'rxjs/observable/from';

const AppNavigator = createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Authenticate: Authenticate,
    Main: MainTabNavigator
  },
  {
    initialRouteName: 'Authenticate'
  }
);
class NavWrapper extends Component {
  static router = AppNavigator.router;
  render() {
    const { navigation } = this.props;
    return (
      <NetworkConsumer>
        {({ isConnected }) =>
          isConnected ? (
            <AppNavigator
              navigation={navigation}
              screenProps={{
                ...this.props
              }}
            />
          ) : (
            <View
              style={{
                flex: 1,
                backgroundColor: '#4b5487',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text style={{ color: '#ffffff' }}>No Internet Connection</Text>
            </View>
          )
        }
      </NetworkConsumer>
    );
  }
}
const AppNavWrapper = createAppContainer(NavWrapper);

export default defaultConnector(AppNavWrapper);
