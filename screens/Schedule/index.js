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

  openDetail = item => () => {
    const { navigation } = this.props;
    navigation.navigate('MeetupDetail', { meetup: item });
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
          <Navbar title="Schedule" />
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
                avatar: organizerPic,
                name: organizerName
              });
            }
            if (primaryTeacherName) {
              speakers.push({
                avatar: primaryTeacherPic,
                name: primaryTeacherName
              });
            }
            if (coTeacher1Name) {
              speakers.push({
                avatar: coTeacher1Pic,
                name: coTeacher1Name
              });
            }
            if (coTeacher2Name) {
              speakers.push({
                avatar: coTeacher2Pic,
                name: coTeacher2Name
              });
            }

            if (eventType === 'Meetup') {
              return (
                <MeetupItem
                  {...item}
                  speakers={speakers}
                  onPress={this.openDetail(item)}
                />
              );
            } else {
              return (
                <WorkshopItem
                  {...item}
                  speakers={speakers}
                  onPress={this.openDetail(item)}
                />
              );
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
