import React, { Component } from 'react';
import WorkshopDetails from './WorkshopDetails';
import Attendees from './../../Meetup/Detail/Attendees';

import { createMaterialTopTabNavigator } from 'react-navigation';

const TabNavigator = createMaterialTopTabNavigator(
  {
    detail: WorkshopDetails,
    Attendees: Attendees
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: '#ffffff',
        color: '#c15b5b'
      },
      activeTintColor: '#c15b5b',
      inactiveTintColor: '#696969',
      indicatorStyle: {
        backgroundColor: '#c15b5b'
      }
    }
  }
);

class NavWrapper extends Component {
  static router = TabNavigator.router;
  render() {
    const { navigation } = this.props;

    return (
      <TabNavigator
        navigation={navigation}
        screenProps={{
          ...this.props.screenProps
        }}
      />
    );
  }
}

export default NavWrapper;
