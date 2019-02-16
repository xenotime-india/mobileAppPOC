import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import Meetup from '../screens/Meetup';
import NewMeetup from '../screens/Meetup/Detail/NewMeetup';
import MeetupDetails from '../screens/Meetup/Detail';
import SettingsScreen from '../screens/SettingsScreen';
import Schedule from '../screens/Schedule';

const HomeStack = createStackNavigator(
  {
    Home: Schedule
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  )
};

const MeetupStack = createStackNavigator(
  {
    Meetups: { screen: Meetup },
    MeetupDetail: { screen: MeetupDetails },
    NewMeetup: { screen: NewMeetup }
  },
  {
    initialRouteName: 'Meetups',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#4b5487'
      },
      headerTintColor: '#fff'
    }
  }
);

MeetupStack.navigationOptions = {
  tabBarLabel: 'Meetups',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  )
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Workshops',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  )
};

export default createBottomTabNavigator(
  {
    HomeStack,
    MeetupStack,
    SettingsStack
  },
  {
    tabBarOptions: {
      tabStyle: {
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
