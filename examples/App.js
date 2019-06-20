/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Modal, TouchableHighlight} from 'react-native';

//import { ChannelList } from 'boxcast-react-native';
import ChannelList from './components/ChannelList';
import Broadcast from './components/Broadcast';
import DraggableBroadcast from './components/DraggableBroadcast';
import GestureRecognizer from './components/GestureRecognizer';

type Props = {};
export default class App extends Component<Props> {
  state = {
    broadcast: null,
  };

  render() {
    return (
      <View style={styles.container}>


        <Text style={styles.welcome}>Horizontal Channel:</Text>
        <View style={{height: 150, width: '100%', borderWidth: 1, borderColor: '#ff0000'}}>
          <ChannelList channelId={'0xQfGiFHjz3YBfO3o1jd'}
                       onSelectBroadcast={(broadcast) => {
                         console.log('Selected', broadcast);
                         this.setState({broadcast});
                       }}
                       horizontal={true} />
        </View>


        <Text style={styles.welcome}>Veritical Channel:</Text>
        <View style={{height: 300, width: '75%', borderWidth: 1, borderColor: '#ff0000'}}>
          <ChannelList channelId={'0xQfGiFHjz3YBfO3o1jd'}
                       onSelectBroadcast={(broadcast) => {
                         console.log('Selected', broadcast);
                         this.setState({broadcast});
                       }}
                       horizontal={false} />
        </View>


        <Modal animationType="slide"
               transparent={true}
               visible={false && this.state.broadcast !== null}>
          <View style={{flex: 1, backgroundColor: '#000000'}}>
          </View>
        </Modal>

        {this.state.broadcast &&
          <DraggableBroadcast
              broadcast={this.state.broadcast}
              onDismiss={() => this.setState({broadcast: null})} />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
