/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  text: string,
  type: string,
};

export default class Badge extends PureComponent<Props> {

  static propTypes = {
    text: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['default', 'red', 'warning']),
  };

  static defaultProps = {
    type: 'default',
  };

  render() {
    const { text, type} = this.props;

    return (
      <Text style={[styles.padding, styles.text, styles[type]]}>{text}</Text>
    );
  }
}

const styles = StyleSheet.create({
  padding: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Type-specific styles
  default: {
    backgroundColor: '#cccccc',
    color: '#ffffff',
  },
  red: {
    backgroundColor: '#ff0000',
    color: '#ffffff',
  },
  warning: {
    backgroundColor: '#ef820d',
    color: '#ffffff',
  },
});
