import React, { PureComponent } from 'react';
import {
  Text,
  View,
  FlatList,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  ViewPropTypes,
  I18nManager,
  StyleSheet
} from 'react-native';
import moment from 'moment';
import { TextField } from 'react-native-material-textfield';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Ripple from 'react-native-material-ripple';

export default class DateTimePickerComponent extends PureComponent {
  static defaultProps = {
    hitSlop: { top: 6, right: 4, bottom: 6, left: 4 },

    disabled: false,

    data: [],

    absoluteRTLLayout: false,

    rippleCentered: false,
    rippleSequential: true,

    rippleInsets: {
      top: 16,
      right: 0,
      bottom: -8,
      left: 0
    },

    rippleOpacity: 0.54,
    shadeOpacity: 0.12,

    rippleDuration: 400,
    animationDuration: 225,

    fontSize: 16,

    textColor: 'rgba(0, 0, 0, .87)',
    itemColor: 'rgba(0, 0, 0, .54)',
    baseColor: 'rgba(0, 0, 0, .38)',

    itemCount: 4,
    itemPadding: 8,

    supportedOrientations: [
      'portrait',
      'portrait-upside-down',
      'landscape',
      'landscape-left',
      'landscape-right'
    ],

    useNativeDriver: false
  };
  state = {};
  state = {
    opacity: new Animated.Value(0),
    modal: false,
    isDateTimePickerVisible: false,
    selectedDate: ''
  };

  componentWillReceiveProps({ value }) {
    if (value !== this.props.value) {
      this.setState({ value });
    }
  }

  componentDidMount() {
    this.focus = this._showDateTimePicker;
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = date => {
    this.setState({ selectedDate: date.toString() });
    this.props.onChangeText(date.toString());
    this._hideDateTimePicker();
  };

  renderBase = () => {
    let { selectedDate } = this.state;
    let { renderAccessory = this.renderAccessory, mode, value } = this.props;

    let FORMATE = '';
    switch (mode) {
      case 'date':
        FORMATE = 'dddd, MMMM Do YYYY';
        break;
      case 'time':
        FORMATE = 'h:mm:ss a';
        break;
      default:
        FORMATE = 'dddd, MMMM Do YYYY, h:mm:ss a';
    }

    return (
      <TextField
        label=""
        {...this.props}
        value={value ? moment(value).format(FORMATE) : ''}
        editable={false}
        onChangeText={undefined}
        renderAccessory={renderAccessory}
      />
    );
  };

  rippleInsets = () => {
    let { top = 16, right = 0, bottom = -8, left = 0 } =
      this.props.rippleInsets || {};

    return { top, right, bottom, left };
  };

  renderAccessory = () => {
    let { baseColor: backgroundColor } = this.props;
    let triangleStyle = { backgroundColor };

    return (
      <View style={styles.accessory}>
        <View style={styles.triangleContainer}>
          <View style={[styles.triangle, triangleStyle]} />
        </View>
      </View>
    );
  };

  render() {
    const { isDateTimePickerVisible, selectedDate } = this.state;

    let {
      overlayStyle: overlayStyleOverrides,
      pickerStyle: pickerStyleOverrides,
      hitSlop,
      pressRetentionOffset,
      testID,
      nativeID,
      accessible,
      accessibilityLabel,
      disabled,
      supportedOrientations,
      mode = 'datetime'
    } = this.props;

    let touchableProps = {
      disabled,
      hitSlop,
      pressRetentionOffset,
      onPress: this._showDateTimePicker,
      testID,
      nativeID,
      accessible,
      accessibilityLabel
    };
    return (
      <View>
        <TouchableWithoutFeedback {...touchableProps}>
          <View pointerEvents="box-only">{this.renderBase()}</View>
        </TouchableWithoutFeedback>
        <DateTimePicker
          mode={mode}
          isVisible={isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  accessory: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },

  triangle: {
    width: 8,
    height: 8,
    transform: [
      {
        translateY: -4
      },
      {
        rotate: '45deg'
      }
    ]
  },

  triangleContainer: {
    width: 12,
    height: 6,
    overflow: 'hidden',
    alignItems: 'center',

    backgroundColor: 'transparent' /* XXX: Required */
  },

  overlay: {
    ...StyleSheet.absoluteFillObject
  },

  picker: {
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    borderRadius: 2,

    position: 'absolute',

    ...Platform.select({
      ios: {
        shadowRadius: 2,
        shadowColor: 'rgba(0, 0, 0, 1.0)',
        shadowOpacity: 0.54,
        shadowOffset: { width: 0, height: 2 }
      },

      android: {
        elevation: 2
      }
    })
  },

  item: {
    textAlign: 'left'
  },

  scroll: {
    flex: 1,
    borderRadius: 2
  },

  scrollContainer: {
    paddingVertical: 8
  }
});
