// @flow
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  AsyncStorage
} from 'react-native';
import moment from 'moment';

import theme from '../../../../theme';
import Modal from '../../../../components/Modal';
import Avatar from '../../../../components/Avatar';

export default class UserInfoModal extends Component {
  _pressCall = () => {
    const url = 'tel://(855) 202-4400';
    Linking.openURL(url);
  };
  logout = async () => {
    const { navigation, userActions } = this.props;
    let asyncStorageKeys = await AsyncStorage.getAllKeys();
    let removeKeys = asyncStorageKeys.map(key => {
      return AsyncStorage.removeItem(key);
    });
    await Promise.all(removeKeys);
    userActions.setUser({});

    navigation.navigate('Authenticate');
  };
  render() {
    const { onClose, user } = this.props;
    return (
      <Modal
        onClose={onClose}
        ref="modal"
        align="bottom"
        style={{ margin: 30 }}
        forceDownwardAnimation
      >
        <View style={styles.wrapper}>
          <ScrollView contentContainerStyle={styles.content}>
            <View
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            >
              <Avatar source={user.userProfilePic} />
              <Text style={[styles.heading, styles.heading1]}>{user.name}</Text>
            </View>
            <View>
              <Text style={styles.text}>
                Art of Living {user.subscriptionType} Member since{' '}
                {moment(user.createdDate).format('MMMM DD, YYYY')}.
              </Text>
            </View>
            <View>
              <Text style={[styles.heading, styles.heading2]}>Help</Text>
              <Text style={styles.text}>
                <Text>call </Text>
                <Text
                  style={{ color: '#00A8D8', textDecorationLine: 'underline' }}
                  onPress={this._pressCall}
                >
                  (855) 202-4400
                </Text>
                <Text> for support.</Text>
              </Text>
            </View>
            <TouchableOpacity
              key="footer"
              onPress={this.logout}
              activeOpacity={0.75}
            >
              <Text style={styles.link}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity
            onPress={() => this.refs.modal.onClose()}
            style={styles.close}
            activeOpacity={0.75}
          >
            <Icon
              color={theme.color.gray40}
              name="ios-arrow-down"
              size={24}
              style={{ height: 16, marginTop: -6 }}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const BORDER_RADIUS = 6;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS,
    maxHeight: 300,
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5
  },
  content: {
    padding: theme.fontSize.default
  },

  // text
  text: {
    color: '#4b5487',
    fontSize: 13,
    lineHeight: theme.fontSize.default,
    marginTop: theme.fontSize.small
  },
  heading: {
    paddingLeft: 10,
    color: '#4b5487',
    fontSize: theme.fontSize.small,
    fontWeight: 'bold'
  },
  heading1: {
    fontSize: theme.fontSize.default
  },
  heading2: {
    fontSize: theme.fontSize.small,
    marginTop: theme.fontSize.large
  },

  // close
  close: {
    alignItems: 'center',
    backgroundColor: theme.color.gray05,
    borderBottomLeftRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS,
    height: 40,
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: { height: -1, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 0
  },
  closeText: {
    color: theme.color.gray40,
    fontWeight: '500'
  },
  link: {
    color: theme.color.blue,
    fontSize: theme.fontSize.default,
    fontWeight: '500',
    paddingVertical: theme.fontSize.large,
    marginBottom: 34 * 2,
    textAlign: 'center'
  }
});
