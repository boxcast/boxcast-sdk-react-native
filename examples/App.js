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


        <Modal animationType="slide" transparent={false} visible={this.state.broadcast !== null}>
          <View style={{marginTop: 0, borderWidth: 1, borderColor: '#ff0000', flex: 1}}>
            {this.state.broadcast && <Broadcast broadcast={this.state.broadcast} onDismiss={() => this.setState({broadcast: null})} />}
          </View>
        </Modal>
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
