import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, AsyncStorage} from 'react-native';

import Video from 'react-native-video';
import { api, analytics } from 'boxcast-sdk-js';

import {YellowBox} from 'react-native';
YellowBox.ignoreWarnings(['Accessing view manager configs']);

analytics.configure({
  browser_name: 'React Native',
  browser_version: '1.0',
  player_version: 'boxcast-test-react-native-app v1.0'
});

export default class Broadcast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: {},
      error: null,
    };
    this.playerRef = React.createRef();
    this.broadcast = this.props.navigation.getParam('broadcast', {});
    this.analytics = analytics.mode('react-native-video').attach({
      broadcast: this.broadcast,
      channel_id: this.broadcast.channel_id,
      AsyncStorage: AsyncStorage
    });
  }

  componentDidMount() {
    api.views.get(this.broadcast.id).then((view) => {
      this.setState({view, error: null});
    }).catch((err) => {
      var error = err.response.data;
      if (error.error_description) {
        error = `${error.error_description}`;
      } else {
        error = `Error: ${JSON.stringify(error)}`;
      }
      this.setState({view: {}, error});
    });
  }

  componentDidUpdate() {
    // console.log('Updated. Video player player: ', this.playerRef.current);
  }

  componentWillUnmount() {
    // console.log('Unmounting video player');
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Never fire an update on this sub-tree unless playlist is changing
    if (!this.state.view.playlist || this.state.view.playlist !== nextState.view.playlist) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { view, error } = this.state;

    return (
      <View style={styles.fullScreen}>
        {view.playlist ?
          <Video source={{uri: view.playlist}}
                ref={this.playerRef}
                style={styles.fullScreen}
                controls={true}
                {...this.analytics.generateVideoEventProps()}
          /> : this.renderPlaceholder()}

        <Text style={styles.title}>
          {this.broadcast.name}
        </Text>
      </View>
    );
  }

  renderPlaceholder() {
    const { view, error } = this.state;
    
    if (this.broadcast.timeframe == 'future') {
      // TODO: countdown?  placeholder image if broadcast.preview not available?
      return (
        <Image style={{width:80, height:50, marginRight:10}} source={{uri: this.broadcast.preview}} />
      )
    } else if (error && error.toLowerCase().indexOf('payment') >= 0) {
      return this.renderError('Ticketed broadcasts cannot be viewed in the app.');
    } else {
      return this.renderError(error || 'This video is not available.');
    }
  }

  renderError(msg) {
    return (
      <Text style={styles.error}>{msg}</Text>
    );
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    backgroundColor: '#000000',
    color: '#ffffff',
  },
  error: {
    fontSize: 20,
    backgroundColor: 'orange',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

