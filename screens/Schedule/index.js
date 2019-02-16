// @flow
import React, { Component } from 'react';
import {
  Animated,
  AppState,
  Dimensions,
  LayoutAnimation,
  ListView,
  SectionList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import moment from 'moment-timezone';
import { groupBy, orderBy } from 'lodash';

import { TIME_FORMAT } from '../../constants';
import Navbar from '../../components/Navbar';
import ListTitle from '../../components/ListTitle';
import Scene from '../../components/Scene';

import theme from '../../theme';

import MeetupItem from './components/MeetupItem';
import WorkshopItem from './components/WorkshopItem';
import SplashScreen from './components/SplashScreen';
import UseInfoModal from './components/UserInfoModal';
import { API } from '../../constants';
import { secure_fetch } from '../../services/api';

const defaultPic =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAhbQAAIW0B3hkBNQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAArySURBVHja7Z1rbBTXFcedECLHSJAmEWkLJW0+9EOl0mcikRKUiKpt+qUSEhgCCbUdCgQhhIJTikXwrhdDqW2MAAMpr7AuCJtHIBDAxeyun4vBjt+v+Jn12nhth0LdBLw27jnVXWnqrO19zMw9d/Z++EkI27vnzv+3szP33rk3anR0NMpoLP5j8kxgHrACSAasQCFQCTQCnUAvcB8YAh4APUA9UAxcYn+TCawFXgW+ZcRjZYSwpwELWdA3WKijGtEFXAXSgEXADCmA/oE/DrzGQrgJeDUMfDLwvYuArcDLWJsUQLvgXwIyADfHwCdjADgMvCIFUCf0OUAK0EI49PFoABKB56UAwQc/l12EeQUM3t/XxHlgvhRg8uBfB64YIPTxuE5NBCrB4y2b08DBkxWBd/CzgGzgUQSFrwTPdi9GnADQ6GggCRiM0OCVfMUuFp+ICAGgoQuANhn8N/gM+KVhBYDGTQHMwIgMe1yGWQfXk4YSABr0AusxkyEHBvZwzjGEANCQxcBdGWrQ9AO/E1oA1osnwwwd/Lo0aTnGoFXwU4ETMkDVuAzECCEAFDqddXTI4NQF5zNMJy0AFDgbqJZhacZt4DmSAkBh3wVaZUiaU4fHmpQAaCUrjOpB+8/SBHPHynd3Vq1LzCzZYjlsT8/KsVtz8ooQ/Df+H/4Mfwd/F/+GcHvwgzabhADsO/82pQMEAXZa0q220vK6xvaunvs9/QOjoYB/i6+Br4WvSUyCajWuCcINP4ZdnHA/IEviTJ7N5g8dDmdVbaiBTwa+Nr4HvhehUcWpXARgc/Muc/+0x5tdF64Wl7k9/cNaBT8WfC98T3xvAhKc4CWAiXfj8Tu7zdV9T6/gx4LvjTUQkCBFVwGwi5LzoM7gkZOfFvIKfixYC4Gh7cW6CMAmavZz/K4fKK9paqUSvg+sCWvjKACOt7ygqQA4TMlGqng18tEneSW3qIXvA2vjPLsJR1ynaClAGs/T3La/HrdTDd8H1sj5q8CsiQA4W4VNWODSsLfX7qh2e/q81AXAGrFWziOIC1QVAOersSlL3My2l1TWUA/fB9bK+SyAU+6i1RQgkWeD3lxl+VyU8H1gzZwlSFJFAJy2zGaucmvMviPnHaIJgDVzFgBvS2epIQDvJ3VGWr9w3xVNAKyZwATY7LAEwKdXePdyLXsnpU208H1g7ZyPH96SzgtHAO4ze97dlFkiqgBYO4FuYmdIAlD49COpu7NtogqQuvsfNiKjhq+HIgCJeX3pWTnCCpC2/7SDiABXghKAyqcf2X0wN19UAUDeQirHEddcCEaA81QKzzx05rrAAlB6GsoakAC4pAmllTlEFiCDlgBef4+bkev1kwLoO3HEnwANUgDDCtAyoQC4vBm1KdBSANV5aSIBDksBDC9Ahl8B2CzfASmA4QVwK582VgrwMsWnYKQAmvCaPwG2SgEiRoA0fwIUSQEiRoCb/ycALntOdVlWKYBmnULTlAIsovokrBRAMxYqBUijWuieQ2fFFeBALmUBkpUCXKVY5JK45Lu1TW2dogpQ1dDqhjbcIyrADaUAXRSLzP3ELuxsIB+5F+1UF8G+/z8BcDMkigUu/9P2RtHD94FtISrBzCi2Ixa54t5PPuQwigDYFqICzIti26KRK+6j09eKjCIAtoWoACui2N545Io7e6ngplEEwLZQvROIYnvzSAEiUwBrFNslUwoQmQIURrGtUqUAkSlAJQpQLwWIWAEaUYAeKUDECtCJAjwgKcDlAqcUQHN6UYCH8gwQsQLcRwG+pFjc0ZNXCo0igDX3n1Q7goZQABfF4jb8Za9hegLNfzthIyrAAxSgiWJxsfGmHqMIgEvQExXAjQJUUJ20cPFacZno4V++7rxN9fjikvNRVJZ7H2+jhxvFFdWihl9Z39IZG292Ez6+NrKzgRSzgu5RXBt4MvDsFRtnukN8+5kzKMAp6vvkJFkO20UJvqu3z/vWmtRaQfYfOoQCJFMvFE6jXaIIkHPB5hQkfCQVBVgqQrGFZdX1IggQv35XhUACrEMBfipCsSKsFA4XfS7Oy8UHy3wU4CkRisat3MgvFb/zWIFA4WPm033TwjtEKNpZUd9E9+LP410SZ+oXSIBW8g+GjOXPJrozhU+dyy8TKHzknBCPho3hYV1zu5vgJhEjy1dZWgQT4AOlAL8XpfDEbQfJnQX2HTlfJFj4yB+UAkyjOi/A3xBmTVMbmX6BpnbXAOHn/ya6AJw5doGIG6I04L2tWQVUBNiYtL9YwE+/098KIZsFaoC3pLyugfveQKWVtYLd9/vY4k+An4vUiDdXWZpdvZ4HvMLv7usfWbF6e72A4SM/9ifAY0CfSA0x7TrObSXx9Kwcu6Dht0+0UORxwRoz7HBWVeodfp7jFm6hNyyoAHsnEmC+aA1alpDSAqGM6LYZlKv7X0viTB5Bw0d+Pdli0XWiNQqC0e1aoBzuQQUOv125Suh4AmyQAhhWgMRAlot/BvhaCmA4AXDzz2cC3TLGKgUwnABHhNw0SgqgGj8Ldtu4AimAYQQoCmXfwFekAIYR4I1Qt479WIRxAQjGq5cAFbXN7YKFnxfO3sE/ot7jFRuv71zBju47gwKFj7uXzw13+/ijlBuZsH6X7gtJ4IOrIl/5ByvA9yj3C5w6l6/7DKEtKX8XYSAIz1TfCVsAytvJLE1IaXV7+h7qP///8w4BBoO2BZJtoAJMAagtczJYVtnQzGs4OOvoBQfh8HGiSrRqAjAJfoiPa5P45MebXfbSyhreM4J27jlpYxdapGZOAz8JNNeABWASrON9y4crb7e5uu9RmROYX1RRteydFEp9A5uCyTRYAXDW0DUeDVvzXkYp3oNTfCjE7ekftubmFRMQIR8z0kwAJsEsPVcWW7l2R7W9hP/pXgARMJPZweYZtABMgoU4P1/TmT5wEM9ecgi5WCQHEXBm8qJQsgxJACZBgjZLwpg8Bz+66IDbO6+I4XMS4f1QcwxZACbBDjVv67ZnZNs63HcGjbI8nE4iZIWTYbgC4EVhTrgzezd9cKCgse2LXqMFr4MIF7GPhpsATIJooDSUBqzemO4UcQUwIiLg4+gx4eYXtgBMgueA8kCLf2tNag3eP0da8CqK0Ox7uJOEAIoNqIsmW+bl9AVbaaQHH6YIn6kVvqoCMAli/HUUwZX9wP6jHzu6evuGZOABiTDepBNc1XWGmpmpKgCT4ElcfsRXNC6b1tDS2SsDDhxXr+ehJd2K4wxeRfif4oJeauelugC+0cPYePOxPR+eLejuG3gkQw2N4lu1DctXWZrYaq5TtchKEwEQaMBjwEY9J2wakKHO7jubxz7OJYQAChHmAjUyzKDBBTB+oXU+mgvAJIgGMgH5dRAY+4Cn9MhGFwEUIvwG6JYBjwsem9/qmYmuAjAJngXOybC/wRk8NnrnobsAChESgH/L4AdwdtNKXjlwE4BJ8CJwDK92IzB4HO7OBr7PMwOuAihEmAPsBb6KgOC/BrKAH1A49iQEUIgwE9jBTotGPNXvBJ6ndMxJCaAQYQaQBHgMEDy2YQvwNMVjTVIAhQgxwAbAJWDwncB6ve7nDSmAQoQngIXsu5NqP8IwgEPdZuBVrFmEYyuEAGNkeBz4FZAB1HHuXcQ1Cg8Ai6ie4g0ngB8hngbeAFKAfI37Fr5kHTarqVzFR7wA44xCzgIWAHGABTgF4Hb0FQDuO4T7Ddxl/Q9D7N9d7Gf4O7gc/Ul2Ol/JzjjfNtqxQv4LONO92C8+/WMAAAAASUVORK5CYII=';

class Schedule extends Component {
  state = {
    modalIsOpen: false,
    data: [],
    loading: false,
    refreshing: false
  };

  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0),
      now: new Date(),
      appState: AppState.currentState,
      data: [],
      loading: false,
      refreshing: false
    };

    if (Platform.OS === 'ios') {
      // This isn't relevant on Android.
      this.scrollYListener = this.state.scrollY.addListener(({ value }) => {
        if (value > 120) {
          StatusBar.setBarStyle('default', true);
          StatusBar.setHidden(false, true);
        } else if (value < 80) {
          StatusBar.setBarStyle('light-content', true);
          StatusBar.setHidden(false, true);
        } else {
          StatusBar.setHidden(true, true);
        }
      });
    }
  }

  async componentDidMount() {
    this._navigatorWillFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      this.handleNavigatorWillFocus
    );
    AppState.addEventListener('change', this.handleAppStateChange);

    //await this.makeRemoteRequest();
    // Update the schedule once a second.
    this.interval = setInterval(
      () => {
        this.setState({ now: new Date() });
      },
      60000 // Once a minute
    );
  }
  componentWillUnmount() {
    if (this.scrollYListener)
      this.state.scrollY.removeListener(this.scrollYListener);
    this._navigatorWillFocusSubscription.remove();
    AppState.removeEventListener('change', this.handleAppStateChange);

    if (this.interval) {
      clearInterval(this.interval);
      delete this.interval;
    }
  }

  handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // update the current time when the app comes into the foreground
      this.setState({ now: new Date() });
    }
  };
  handleNavigatorWillFocus = payload => {
    const scene = payload.state.routeName;

    if (scene === 'Schedule' && this.state.scrollY._value < 120) {
      StatusBar.setBarStyle('light-content', true);
    }

    this.setState({ now: new Date() });
  };
  gotoEventInfo = () => {
    StatusBar.setBarStyle('default', true);
    this.props.navigator.push({
      enableSwipeToPop: true,
      scene: 'Info'
    });
  };
  toggleModal = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
  };

  renderHeader = () => {
    return <View key="spacer" style={{ height: 190 }} />;
  };
  render() {
    const { scrollY, modalIsOpen } = this.state;
    const { event, user } = this.props.screenProps;

    const isAndroid = Platform.OS === 'android';

    const navbarTop = scrollY.interpolate({
      inputRange: [80, 120],
      outputRange: [-64, 0],
      extrapolate: 'clamp'
    });

    const splashTop = scrollY.interpolate({
      inputRange: [-200, 400],
      outputRange: [200, -400],
      extrapolate: 'clamp'
    });

    let data = orderBy(event.data, ({ eventstartdate }) => eventstartdate, [
      'asc'
    ]);
    const dataMap = groupBy(data, ({ eventstartdate }) =>
      moment.utc(eventstartdate).format(TIME_FORMAT)
    );

    data = Object.keys(dataMap).map(d => ({
      title: d,
      data: dataMap[d]
    }));

    return (
      <Scene>
        <SplashScreen
          user={user}
          onLogoPress={this.toggleModal}
          style={{ top: splashTop }}
        />

        <Animated.View style={[styles.navbar, { top: navbarTop }]}>
          <Navbar
            title="Schedule"
            rightButtonIconName={isAndroid ? 'md-information-circle' : null}
            rightButtonText={!isAndroid ? 'Logout' : null}
            rightButtonOnPress={this.gotoEventInfo}
          />
        </Animated.View>
        {modalIsOpen && (
          <UseInfoModal
            onClose={this.toggleModal}
            {...this.props}
            {...this.props.screenProps}
          />
        )}

        {/* Spacer for the headings to stick correctly */}
        <View style={styles.spacer} />
        <SectionList
          sections={data}
          renderItem={({ item }) => {
            const {
              primaryTeacherPic,
              primaryTeacherName,
              organizerPic,
              organizerName,
              coTeacher1Pic,
              coTeacher1Name,
              coTeacher2Pic,
              coTeacher2Name,
              eventType
            } = item || {};
            const speakers = [];
            if (organizerName) {
              speakers.push({
                avatar: organizerPic || defaultPic,
                name: organizerName
              });
            }
            if (primaryTeacherName) {
              speakers.push({
                avatar: primaryTeacherPic || defaultPic,
                name: primaryTeacherName
              });
            }
            if (coTeacher1Name) {
              speakers.push({
                avatar: coTeacher1Pic || defaultPic,
                name: coTeacher1Name
              });
            }
            if (coTeacher2Name) {
              speakers.push({
                avatar: coTeacher2Pic || defaultPic,
                name: coTeacher2Name
              });
            }

            if (eventType === 'Meetup') {
              return <MeetupItem {...item} speakers={speakers} />;
            } else {
              return <WorkshopItem {...item} speakers={speakers} />;
            }
          }}
          renderSectionHeader={({ section: { title } }) => (
            <ListTitle bordered={true} text={title} />
          )}
          keyExtractor={(item, index) => item.sfid + index}
          ListHeaderComponent={this.renderHeader}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={50}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
          ])}
        />
      </Scene>
    );
  }
}

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 2
  },
  spacer: {
    backgroundColor: 'transparent',
    height: theme.navbar.height,
    zIndex: 1
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

function getTalkStatus(startTime, endTime) {
  const now = moment.tz('America/Los_Angeles');

  if (now.isBetween(startTime, endTime)) {
    return 'present';
  } else if (now.isBefore(startTime)) {
    return 'future';
  }

  return 'past';
}

export default Schedule;
