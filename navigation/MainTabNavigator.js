import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import Meetup from '../screens/Meetup';
import Workshop from '../screens/Workshop';
import NewMeetup from '../screens/Meetup/Detail/NewMeetup';
import MeetupDetails from '../screens/Meetup/Detail';
import WorkshopDetails from '../screens/Workshop/WorkshopDetail';
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

const WorkshopStack = createStackNavigator(
  {
    Workshops: { screen: Workshop },
    WorkshopDetail: { screen: WorkshopDetails }
  },
  {
    initialRouteName: 'Workshops',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#c15b5b'
      },
      headerTintColor: '#fff'
    }
  }
);

WorkshopStack.navigationOptions = {
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
    WorkshopStack
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
