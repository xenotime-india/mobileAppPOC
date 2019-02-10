import React from 'react';
import Details from './Details';
import Attendees from './Attendees';

import { createMaterialTopTabNavigator } from 'react-navigation';

const TabNavigator = createMaterialTopTabNavigator(
  {
    detail: Details,
    Attendees: Attendees
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: '#ffffff',
        color: '#4b5487'
      },
      activeTintColor: '#4b5487',
      inactiveTintColor: '#696969',
      indicatorStyle: {
        backgroundColor: '#4b5487'
      }
    }
  }
);

export default TabNavigator;
