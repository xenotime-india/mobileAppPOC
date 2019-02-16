import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableHighlight
} from 'react-native';
import { Icon } from 'native-base';

class CheckBox extends Component {
  state = {
    isChecked: this.props.isChecked
  };

  static defaultProps = {
    isChecked: false,
    isIndeterminate: false,
    leftTextStyle: {},
    rightTextStyle: {}
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.isChecked !== nextProps.isChecked) {
      return {
        isChecked: nextProps.isChecked
      };
    }
    return null;
  }
  onClick = () => {
    const { focusedElement } = this.props;
    if (focusedElement) focusedElement.blur();

    this.setState(({ isChecked }) => ({ isChecked: !isChecked }));
    this.props.onClick(!this.state.isChecked);
  };
  _renderLeft = () => {
    const { boldFont } = this.props;
    if (this.props.leftTextView) return this.props.leftTextView;
    if (!this.props.leftText) return null;
    return (
      <Text
        style={[
          styles.leftText,
          this.props.leftTextStyle,
          boldFont && { fontWeight: 'bold', fontSize: 14 }
        ]}
      >
        {this.props.leftText}
      </Text>
    );
  };
  _renderRight = () => {
    if (this.props.rightTextView) return this.props.rightTextView;
    if (!this.props.rightText) return null;
    return (
      <Text style={[styles.rightText, this.props.rightTextStyle]}>
        {this.props.rightText}
      </Text>
    );
  };

  _renderImage = () => {
    if (this.props.isIndeterminate) {
      return this.props.indeterminateImage
        ? this.props.indeterminateImage
        : this.genCheckedImage();
    }
    if (this.state.isChecked) {
      return this.props.checkedImage
        ? this.props.checkedImage
        : this.genCheckedImage();
    } else {
      return this.props.unCheckedImage
        ? this.props.unCheckedImage
        : this.genCheckedImage();
    }
  };

  genCheckedImage = () => {
    const { singleSelection } = this.props;
    let source;
    if (this.props.isIndeterminate) {
      source = 'remove-circle-outline';
    } else {
      if (singleSelection)
        source = this.state.isChecked
          ? 'checkmark-circle-outline'
          : 'radio-button-off';
      else
        source = this.state.isChecked ? 'checkbox-outline' : 'square-outline';
    }

    return (
      <Icon
        name={source}
        style={{
          width: this.props.size || 34,
          height: this.props.size || 34,
          opacity: this.state.isChecked ? 1 : singleSelection ? 0.2 : 1
        }}
      />
    );
  };

  render() {
    const { hideCheckBox } = this.props;
    return (
      <TouchableHighlight
        style={this.props.style}
        onPress={() => this.onClick()}
        underlayColor="transparent"
        disabled={this.props.disabled}
      >
        <View style={styles.container}>
          {this._renderLeft()}
          {!hideCheckBox && this._renderImage()}
          {!hideCheckBox && this._renderRight()}
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  leftText: {
    color: '#4b5487',
    flex: 1
  },
  rightText: {
    color: '#4b5487',
    flex: 1,
    marginLeft: 10
  }
});

export default CheckBox;
