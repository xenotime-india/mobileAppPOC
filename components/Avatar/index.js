// @flow
import React from 'react';
import { Platform, View } from 'react-native';

import { Image } from 'react-native-expo-image-cache';
import theme from '../../theme';
const preview = {
  uri:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCS…DuO4T7Ddxl/Q9D7N9d7Gf4O7gc/Ul2Ol/JzjjfNtqxQv4LONO92C8+/WMAAAAASUVORK5CYII='
};
export default function Avatar({ size = 44, source, style, ...props }) {
  const styles = {
    wrapper: {
      backgroundColor: theme.color.sceneBg,
      borderRadius: size,
      overflow: 'hidden',
      height: size,
      width: size
    },
    image: {
      borderRadius: Platform.OS === 'android' ? size : 0,
      height: size,
      width: size
    }
  };
  const imageUri = source || preview;
  return (
    <View style={[styles.wrapper, style]} {...props}>
      <Image style={styles.image} {...imageUri} preview={preview} />
    </View>
  );
}
