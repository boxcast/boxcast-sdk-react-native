import React from 'react';
import {Image} from 'react-native';

export default function ContainedImage(props) {
  return (
    <Image style={{flex:1, height: undefined, width: undefined}}
           resizeMode="contain"
           {...props} />
  );
};
