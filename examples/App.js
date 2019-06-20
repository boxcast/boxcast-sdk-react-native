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
import BroadcastModalView from './components/BroadcastModalView';
import GestureRecognizer from './components/GestureRecognizer';


// TODO: look up your own channel IDs
const MY_BOXCAST_CHANNEL_1_ID = 'lbkvcqkzmxyhzwzsbj6w';
const MY_BOXCAST_CHANNEL_2_ID = '0xQfGiFHjz3YBfO3o1jd';

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
          <ChannelList channelId={MY_BOXCAST_CHANNEL_1_ID}
                       query={'timeframe:relevant timeframe:next'}
                       sort={'-starts_at'}
                       pageSize={10}
                       onSelectBroadcast={(broadcast) => this.showBroadcast(broadcast)}
                       horizontal={true} />
        </View>

        <Text style={styles.welcome}>Veritical Channel:</Text>
        <View style={{height: 300, width: '75%', borderWidth: 1, borderColor: '#ff0000'}}>
          <ChannelList channelId={MY_BOXCAST_CHANNEL_2_ID}
                       query={'timeframe:relevant timeframe:next'}
                       sort={'-starts_at'}
                       pageSize={10}
                       onSelectBroadcast={(broadcast) => this.showBroadcast(broadcast)}
                       horizontal={false} />
        </View>

        {this.state.broadcast &&
          <BroadcastModalView
              broadcast={this.state.broadcast}
              dockable={true}
              onDismiss={() => { console.log('closing'); this.closeBroadcast(); }} />
        }
      </View>
    );
  }

  showBroadcast(broadcast) {
    console.log('Showing broadcast: ', broadcast);
    this.setState({broadcast});
  }

  closeBroadcast() {
    this.setState({broadcast: null});
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
