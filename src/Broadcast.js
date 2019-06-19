import React, {Component} from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  YellowBox,
} from 'react-native';
import PropTypes from 'prop-types';

import Video from 'react-native-video';
import { api, analytics } from 'boxcast-sdk-js';


// Static initialization
YellowBox.ignoreWarnings([
  'Accessing view manager configs'
]);
analytics.configure({
  browser_name: 'React Native',
  browser_version: '1.0',
  player_version: 'boxcast-test-react-native-app v1.0'
});


type Props = {
  broadcast: object,
  onDismiss?: () => mixed,
};

export default class Broadcast extends Component<Props> {
  static propTypes = {
    broadcast: PropTypes.object.isRequired,
    onDismiss: PropTypes.func,
  };

  static defaultProps = {
    onDismiss: function(){},
  };

  state = {
    view: {},
    error: null,
    loading: true,
  };

  constructor(props) {
    super(props);
    this.playerRef = React.createRef();
    this.broadcast = this.props.broadcast;

    // TODO: re-enable analytics
    /*this.analytics = analytics.mode('react-native-video').attach({
      broadcast: this.broadcast,
      channel_id: this.broadcast.channel_id,
      AsyncStorage: AsyncStorage
    });*/
  }

  componentDidMount() {
    api.views.get(this.broadcast.id).then((view) => {
      this.setState({view: view, error: null, loading: false});
    }).catch((err) => {
      var error = err.response.data;
      if (error.error_description) {
        error = `${error.error_description}`;
      } else {
        error = `Error: ${JSON.stringify(error)}`;
      }
      this.setState({view: {}, error: error, loading: false});
    });
  }

  componentDidUpdate() {
    // console.log('Updated. Video player player: ', this.playerRef.current);
    this.playerRef.current && this.playerRef.current.presentFullscreenPlayer();
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
        {view.playlist ? this.renderVideo(view.playlist) : this.renderPlaceholder()}
      </View>
    );
    /* <Text style={styles.title}>{this.broadcast.name}</Text> */
  }

  renderVideo(playlist) {
    return (
      <View style={{flex: 1}}>
        <Video
          source={{uri: playlist}}
          ref={this.playerRef}
          style={styles.fullScreen}
          fullscreen={true}
          fullscreenAutorotate={false}
          fullscreenOrientation={'landscape'}
          controls={true}
          poster={this.broadcast.poster || this.broadcast.preview}
          onFullscreenPlayerWillPresent={() => {
            console.log('onFullscreenPlayerWillPresent');
          }}
          onFullscreenPlayerDidPresent={() => {
            console.log('onFullscreenPlayerWillPresent');
          }}
          onFullscreenPlayerWillDismiss={() => {
            console.log('onFullscreenPlayerWillDismiss');
            this.props.onDismiss()
          }}
          onFullscreenPlayerDidDismiss={() => {
            console.log('onFullscreenPlayerDidDismiss');
            this.props.onDismiss()
          }}
          /* {...this.analytics.generateVideoEventProps()} */
        />
        <View style={{position:'absolute',top:50,left:'50%'}}>
          {this.renderDismissButton()}
        </View>
      </View>
    );
  }

  renderPlaceholder() {
    const { view, error, loading } = this.state;
    
    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator animating size="large" />
          {this.renderDismissButton()}
        </View>
      );
    } else if (this.broadcast.timeframe == 'future') {
      // TODO: countdown?  placeholder image if broadcast.preview not available?
      return this.renderError(`Broadcast will start at ${broadcast.starts_at}`);
    } else if (error && error.toLowerCase().indexOf('payment') >= 0) {
      return this.renderError('Ticketed broadcasts cannot be viewed in the app.');
    } else {
      return this.renderError(error || 'This video is not available.');
    }
  }

  renderError(msg) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{msg}</Text>
        {this.renderDismissButton()}
      </View>
    );
  }

  renderDismissButton() {
    return (
      <Button onPress={() => this.props.onDismiss()} title="Back" />
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

