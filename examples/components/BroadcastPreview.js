import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import Badge from './Badge';
import CardWithImage from './CardWithImage';

type Props = {
  broadcast: object,
  onPress?: () => mixed,
  style: StyleObj,
};

export default class BroadcastPreview extends Component<Props> {
  static propTypes = {
    broadcast: PropTypes.object.isRequired,
    onPress: PropTypes.func,
    style: PropTypes.any,
  };

  static defaultProps = {
    onPress: function(){},
    style: {},
  };

  render() {
    const { broadcast, onPress, style } = this.props;

    var imageUrl = broadcast.preview;
    if (!imageUrl) {
      imageUrl = 'https://dashboard.boxcast.com/img/boxcast_logo_dark.png';
    } else if (imageUrl.indexOf('http') != 0) {
      console.warn('Invalid image url: ', broadcast);
    }

    return (
        <View style={styles.container}>
          <CardWithImage
            uri={imageUrl}
            title={broadcast.name}
            showTitle={true}
            onPress={onPress}
            style={style}
            titleStyle={{
              color: '#ffffff',
              fontWeight: 'bold',
            }}
          />
          {broadcast.timeframe == 'current' && this.renderLiveBadge()}
        </View>
    );
  }

  renderLiveBadge() {
    return (
      <View style={{position:'absolute',top:5,left:5}}>
        <Badge type="red" text="LIVE" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection:'column',
    height: 200,
  },
  name: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
