import React from 'react';
import {View, StyleSheet} from 'react-native';

import CardWithImage from './CardWithImage';

export default function BroadcastPreview(props) {
  const { broadcast } = props;

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
          onPress={props.onPress}
          style={props.style}
          titleStyle={{
            color: '#ffffff',
            fontWeight: 'bold',
          }}
          />
      </View>
  );
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
