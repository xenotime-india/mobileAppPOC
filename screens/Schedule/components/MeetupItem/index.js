// @flow
import React, { Component } from 'react';
import {
  Animated,
  Easing,
  PixelRatio,
  StyleSheet,
  TouchableHighlight,
  View
} from 'react-native';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
  Item,
  Input,
  Icon
} from 'native-base';

import Avatar from '../../../../components/Avatar';
import theme from '../../../../theme';

const animationDefault = val => ({
  toValue: val,
  duration: 666,
  easing: Easing.inOut(Easing.quad)
});
export default class MeetupItem extends Component {
  constructor(props) {
    super(props);

    this.animValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.cycleAnimation();
  }
  cycleAnimation() {
    Animated.sequence([
      Animated.timing(this.animValue, animationDefault(1)),
      Animated.timing(this.animValue, animationDefault(0))
    ]).start(() => this.cycleAnimation());
  }
  tConvert = time => {
    if (!time) {
      return '';
    }
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'am' : 'pm'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
      time[3] = ''; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  };
  render() {
    const {
      meetupTitle,
      meetupStartDate,
      city,
      streetAddress1,
      streetAddress2,
      meetupStartTime,
      speakers,
      onPress
    } = this.props;

    const touchableProps = {
      activeOpacity: 1,
      onPress: onPress,
      style: styles.touchable,
      underlayColor: theme.color.gray05
    };

    const animatedStyle = {
      transform: [
        {
          translateX: this.animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 4]
          })
        }
      ]
    };

    const avatar = speakers
      ? speakers.map((speaker, index) => {
          const pull =
            index + 1 !== speaker.length ? { marginRight: -16 } : null;
          return (
            <Avatar
              key={speaker.name}
              source={{ uri: speaker.avatar }}
              style={pull}
            />
          );
        })
      : null;

    const barColor = '#4b5487';

    return (
      <TouchableHighlight {...touchableProps} {...this.props}>
        <View style={[styles.base]}>
          <View
            style={{
              backgroundColor: barColor,
              width: 5
            }}
          >
            <Animated.View style={animatedStyle}>
              <Icon
                name="md-arrow-dropright"
                style={[
                  styles.statusbarIcon,
                  { color: barColor, fontSize: 34 }
                ]}
              />
            </Animated.View>
          </View>

          <View style={[styles.content]}>
            <View style={[styles.text]}>
              <Text style={styles.date}>{this.tConvert(meetupStartTime)}</Text>
              <Text style={styles.title}>
                <Icon
                  name="ios-pin"
                  style={{ color: barColor, fontSize: 12 }}
                />
                {'  '}
                {streetAddress1 || streetAddress2}, {city}
              </Text>
              <Text style={styles.subtitle} note numberOfLines={1}>
                {meetupTitle}
              </Text>
            </View>

            <View style={styles.right}>
              {avatar}
              <Icon
                name="ios-arrow-forward"
                style={[styles.chevron, { color: barColor, fontSize: 20 }]}
              />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#7b84b7'
  },
  textRight: {
    color: '#4b5487',
    fontSize: 14,
    lineHeight: 24
  },
  subtitle: {
    color: '#4b5487',
    fontSize: 14,
    lineHeight: 24
  },
  title: {
    color: '#4b5487',
    fontSize: 12,
    lineHeight: 16
  },
  date: {
    color: '#48a1db',
    fontSize: 12,
    lineHeight: 24
  },
  touchable: {
    backgroundColor: 'white'
  },
  base: {
    alignItems: 'stretch',
    backgroundColor: 'transparent',
    borderBottomColor: theme.color.gray20,
    borderBottomWidth: 1 / PixelRatio.get(),
    flexDirection: 'row'
  },
  // base__present: {
  // 	backgroundColor: fade(theme.color.blue, 3),
  // },

  statusbarIcon: {
    backgroundColor: 'transparent',
    height: 34,
    left: 0,
    position: 'absolute',
    top: 10,
    width: 34
  },

  // content
  content: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 1,
    padding: theme.fontSize.default
  },
  // content__past: {
  //   opacity: 0.5,
  // },
  text: {
    flexGrow: 1,
    flexShrink: 1,
    paddingRight: theme.fontSize.xsmall
  },

  // right (avatar and chevron)
  right: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 0
  },

  // chevron
  chevron: {
    marginLeft: theme.fontSize.default
  }
});
