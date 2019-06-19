import React from 'react';
import {View, Text} from 'react-native';

import ContainedImage from './ContainedImage';

export default function BroadcastPreview(props) {
  const { broadcast } = props;
  var imageUrl = broadcast.preview;
  if (!imageUrl) {
    imageUrl = 'https://dashboard.boxcast.com/img/boxcast_logo_dark.png';
  } else if (imageUrl.indexOf('http') != 0) {
    console.warn('invalid image url: ', broadcast);
  }
  return (
      <View style={{flex:1, flexDirection:'column'}}>
        <ContainedImage source={{uri: imageUrl}} />
        <Text>{broadcast.name}</Text>
      </View>
  );
}
