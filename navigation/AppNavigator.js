import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import Authenticate from './../screens/Authenticate';

export default createAppContainer(
  createSwitchNavigator(
    {
      // You could add another route here for authentication.
      // Read more at https://reactnavigation.org/docs/en/auth-flow.html
      Authenticate: Authenticate,
      Main: MainTabNavigator
    },
    {
      initialRouteName: 'Authenticate'
    }
  )
);
