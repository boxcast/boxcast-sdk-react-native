# BoxCast SDK for React Native

All you need to build your own awesome video app to showcase your BoxCast channels and broadcasts.

## Preview

<img src="https://github.com/boxcast/boxcast-sdk-react-native/blob/master/examples/boxcast-sdk-react-native-demo-1.gif?raw=true">

## Features

* Infinite scrolling display of all broadcasts in a channel via `<ChannelList />`
* Channel scroller can go horizontal or vertical 
* Full screen video playback via `<BroadcastModalView />`
* Drag and dock the video player to continue browsing app while video plays
* Simple inline video playback with `<BroadcastVideo />`

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

## Components

### ChannelList

Horizontal or vertical display of all broadcasts in a given channel

*Properties*

 Name | Description | Default | Type
------|-------------|----------|-----------
channelId | BoxCast channel ID. Required. | - | string (required)
horizontal | Scroll horizontally? | false | boolean
titleStyle | Additional styles to apply | null | StyleObject
onSelectBroadcast | Callback when a broadcast is selected | - | function
pageSize | Number of broadcasts to query at a time from API | 20 | int
query | API query for filtering the result set | timeframe:relevant | string
sort | API sort parameter | -starts_at | string

### BroadcastModalView

Full-screen modal view of video and details for a given broadcast.

*Properties*

 Name | Description | Default | Type
------|-------------|----------|-----------
broadcast | BoxCast broadcast object. Required. | - | object (required)
dockable | Enable dragging/docking behavior? | false | boolean
dismissText | Text to use on the dismiss button | Close | string
dismissStyle | Additional styles to apply to the dismiss button| null | StyleObject
onDismiss | Callback when the modal is closed | - | function
dragAcceleration | Value used to control vertical drag acceleration when dragging/docking | 1.0 | float


### BroadcastVideo

Simple inline video playback for a given broadcast.

*Properties*

 Name | Description | Default | Type
------|-------------|----------|-----------
broadcast | BoxCast broadcast object. Required. | - | object (required)
