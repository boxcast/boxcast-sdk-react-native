/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Switch, YellowBox} from 'react-native';

//import { ChannelList } from 'boxcast-react-native';
import ChannelList from './components/ChannelList';
import BroadcastModalView from './components/BroadcastModalView';


// TODO: look up your own channel IDs
const MY_BOXCAST_CHANNEL_ID = 'lbkvcqkzmxyhzwzsbj6w';

YellowBox.ignoreWarnings([
  'Accessing view manager configs',
  'Invalid image url',
  'source.uri should not be',
  'Task orphaned',
  'Remote debugger is in a background tab',
]);

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
            <ChannelList channelId={MY_BOXCAST_CHANNEL_ID}
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
            <ChannelList channelId={MY_BOXCAST_CHANNEL_ID}
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
              onDismiss={() => this.closeBroadcast()} />
        }
      </View>
    );
  }

  showBroadcast(broadcast) {
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
