/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

type Props = {
  style: StyleObj,
  uri: string,
  title: string,
  showTitle:boolean,
  titleStyle?: StyleObj,
  onPress?: () => mixed,
  imageIconView?: () => mixed,
  imageCountStyle?: StyleObj,
  titleTouchable: boolean,
  imageTouchable: boolean,
};

export default class CardWithImage extends Component<Props> {

  static propTypes = {
    style: PropTypes.any,
    uri: PropTypes.string.isRequired,
    title: PropTypes.string,
    showTitle: PropTypes.bool,
    titleStyle: PropTypes.any,
    onPress: PropTypes.func,
    imageIconView: PropTypes.func,
    imageCountStyle: PropTypes.any,
    titleTouchable: PropTypes.bool,
    imageTouchable: PropTypes.bool,
  };

  static defaultProps = {
    style: {},
    uri: '',
    title: '',
    showTitle: true,
    titleTouchable: true,
    imageTouchable: true,
  };

  render() {
    const {
      style,
      title,
      showTitle,
      titleStyle,
      uri,
      onPress,
      imageIconView,
      imageCountStyle,
      titleTouchable,
      imageTouchable,
    } = this.props;

    return (
      <View style={[styles.container, style]}>
        <TouchableWithoutFeedback onPress={onPress} disabled={!imageTouchable}>
          <View style={[styles.imageWrapper, style, { flexDirection: 'row' }]}>
            <Image
              source={{ uri: `${uri}` }}
              style={{ flex: 1 }}
              resizeMode={'cover'}
            />
          </View>
        </TouchableWithoutFeedback>
        {showTitle &&
          <TouchableWithoutFeedback onPress={onPress} disabled={!titleTouchable}>
            <View style={styles.overlay}>
              <Text
                style={titleStyle}
                numberOfLines={1}
                ellipsizeMode={'tail'}
              >
                {title}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  imageWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 24,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: 'rgba(0,0,0,.35)',
  },
});
