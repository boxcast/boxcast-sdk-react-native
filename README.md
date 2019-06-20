# BoxCast SDK for React Native

All you need to build your own awesome video app to showcase your BoxCast channels and broadcasts.

## Preview

<img src="">

## Features

* Infinite scrolling display of all broadcasts in a channel via `<ChannelList />`
* Channel scroller can go horizontal or vertical 
* Full screen video playback via `<BroadcastModalView />`
* Drag and dock the video player to continue browsing app while video plays
* Simple inline video playback with `<Broadcast />`

## Install

```
npm install --save boxcast-react-native
npm install --save react-native-video
react-native link react-native-video
```

## Usage

* Import

```JavaScript
import { ChannelList, BroadcastModalView } from 'boxcast-sdk-react-native';
```

* Render horizontal channel scroller with dockable video player on tap

```JavaScript
...

render() {
  return (
    <View style={{flex:1}}>
      <View style={{height:150, width:'100%'}}>
        <ChannelList channelId={MY_BOXCAST_CHANNEL_ID}
                    query={'timeframe:relevant timeframe:next'}
                    sort={'-starts_at'}
                    pageSize={10}
                    onSelectBroadcast={(broadcast) => this.setState({broadcast})}
                    horizontal={true} />
      </View>
      {this.state.broadcast &&
        <BroadcastModalView
            broadcast={this.state.broadcast}
            dockable={true}
            onDismiss={() => this.setState({broadcast: null})} />
      }
    </View>
  );
}
```

* Render vertical channel scroller with fixed (non-dockable) video player on tap

```JavaScript
...

render() {
  return (
    <View style={{flex:1}}>
      <ChannelList channelId={MY_BOXCAST_CHANNEL_ID}
                   query={'timeframe:relevant timeframe:next'}
                   sort={'-starts_at'}
                   pageSize={10}
                   onSelectBroadcast={(broadcast) => this.setState({broadcast})}
                   horizontal={false} />
      {this.state.broadcast &&
        <BroadcastModalView
            broadcast={this.state.broadcast}
            dockable={false}
            onDismiss={() => this.setState({broadcast: null})} />
      }
    </View>
  );
}
```
