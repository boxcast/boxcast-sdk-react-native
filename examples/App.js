/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Modal, Switch} from 'react-native';

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
    dockable: true,
  };

  render() {
    return (
      <View style={styles.container}>

        <View style={{marginBottom: 15, width: '100%', alignItems: 'center'}}>
          <Text>ChannelList Horizontal Mode</Text>
          <View style={{height: 150, width: '100%', borderWidth: 1, borderColor: '#ff0000'}}>
            <ChannelList channelId={MY_BOXCAST_CHANNEL_1_ID}
                        query={'timeframe:relevant timeframe:next'}
                        sort={'-starts_at'}
                        pageSize={10}
                        onSelectBroadcast={(broadcast) => this.showBroadcast(broadcast)}
                        horizontal={true} />
          </View>
        </View>

        <View style={{marginBottom: 15, width: '100%', alignItems: 'center'}}>
          <Text>ChannelList Vertical Mode</Text>
          <View style={{height: 300, width: '75%', borderWidth: 1, borderColor: '#ff0000'}}>
            <ChannelList channelId={MY_BOXCAST_CHANNEL_2_ID}
                        query={'timeframe:relevant timeframe:next'}
                        sort={'-starts_at'}
                        pageSize={10}
                        onSelectBroadcast={(broadcast) => this.showBroadcast(broadcast)}
                        horizontal={false} />
          </View>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Switch onValueChange={(dockable) => this.setState({dockable})} value={this.state.dockable} />
          <Text style={{marginLeft: 5}}>Allow video docking?</Text>
        </View>

        {this.state.broadcast &&
          <BroadcastModalView
              broadcast={this.state.broadcast}
              dockable={this.state.dockable}
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
});
