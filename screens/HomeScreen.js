import React, { Component } from 'react';
import { Card, Icon } from 'react-native-elements';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import defaultConnector from '../redux/connectors/defaultConnector';
import moment from 'moment';
class HomeScreen extends Component {
  render() {
    const { user } = this.props;
    let { auth0 } = user || {};
    if (auth0) {
      auth0 = Array.isArray(auth0) ? auth0[0] : auth0;
    } else {
      auth0 = {
        picture: null
      };
    }
    const profilePic = auth0.picture;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={{ fontWeight: 'bold', color: '#ffffff', fontSize: 25 }}>
            Art of Living - Teacher App
          </Text>
        </View>
        <Image style={styles.avatar} source={{ uri: profilePic }} />
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.info}>Teacher</Text>
            <Text style={styles.description}>
              Art of Living {user.subscriptionType} Member since{' '}
              {moment(user.createdDate).format('MMMM DD, YYYY')}
            </Text>

            <TouchableOpacity style={styles.buttonContainer}>
              <Text style={{ color: '#ffffff' }}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4b5487',
    minHeight: 200,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130
  },
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600'
  },
  body: {
    marginTop: 40
  },
  bodyContent: {
    alignItems: 'center',
    padding: 30
  },
  name: {
    fontSize: 28,
    color: '#696969',
    fontWeight: '600'
  },
  info: {
    fontSize: 16,
    color: '#4b5487',
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: '#696969',
    marginTop: 10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: '#4b5487',
    color: '#ffffff'
  }
});

export default defaultConnector(HomeScreen);
