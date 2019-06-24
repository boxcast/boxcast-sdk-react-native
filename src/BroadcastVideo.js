import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  AsyncStorage,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Video from 'react-native-video';
import { api, analytics } from 'boxcast-sdk-js';
import Badge from './Badge';

analytics.configure({
  browser_name: 'React Native',
  browser_version: '1.0',
  player_version: 'boxcast-sdk-react-native v1.0'
});

type Props = {
  broadcast: object,
  onDismiss?: () => mixed,
  debug: boolean,
};

export default class BroadcastVideo extends Component<Props> {
  static configureAnalytics(props) {
    analytics.configure(props);
  }

  static propTypes = {
    broadcast: PropTypes.object.isRequired,
    onDismiss: PropTypes.func,
    debug: PropTypes.bool,
  };

  static defaultProps = {
    onDismiss: function(){},
    debug: false,
  };

  state = {
    view: {},
    error: null,
    loading: true,
  };

  constructor(props) {
    super(props);
    this.playerRef = React.createRef();
  }

  async componentDidMount() {
    await this._initAnalytics();
    this._fetchBroadcastAndView();
  }

  async _initAnalytics() {
    this.analytics = await analytics.mode('react-native-video').attach({
      broadcast: this.props.broadcast,
      channel_id: this.props.broadcast.channel_id,
      AsyncStorage: AsyncStorage,
      debug: this.props.debug,
    });
  }

  _fetchBroadcastAndView() {
    this.setState({view: {}, error: null, loading: true});
    api.views.get(this.props.broadcast.id).then((view) => {
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

  componentDidUpdate(prevProps) {
    // console.log('Updated. Video player player: ', this.playerRef.current);
    if (this.props.broadcast.id != prevProps.broadcast.id) {
      this._initAnalytics();
      this._fetchBroadcastAndView();
    }
  }

  componentWillUnmount() {
    // console.log('Unmounting video player');
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.broadcast.id !== nextProps.broadcast.id) {
      return true;
    } else if (!this.state.view.playlist || !nextState.view.playlist) {
      return true; // we don't/won't have a video so updating is trivial
    } else if (this.state.view.playlist !== nextState.view.playlist) {
      return true; // playlist changed
    } else {
      return false; // otherwise, avoid sub-tree updates
    }
  }

  render() {
    const { view, error } = this.state;

    return (
      <View style={styles.fullScreen}>
        {view.playlist ? this.renderVideo(view.playlist) : this.renderPlaceholder()}
      </View>
    );
  }

  renderVideo(playlist) {
    return (
      <Video
        source={{uri: playlist}}
        ref={this.playerRef}
        style={styles.fullScreen}
        controls={true}
        poster={this.props.broadcast.poster || this.props.broadcast.preview}
        {...this.analytics.generateVideoEventProps()}
      />
    );
  }

  renderPlaceholder() {
    const { view, error, loading } = this.state;
    const { timeframe, starts_at } = this.props.broadcast;
    
    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    } else if (timeframe == 'future') {
      return this.renderError('default', `Broadcast starts ${starts_at}`);
    } else if (error && error.toLowerCase().indexOf('payment') >= 0) {
      return this.renderError('warning', 'Ticketed broadcasts cannot be viewed in the app.');
    } else {
      return this.renderError('warning', error || 'This video is not available.');
    }
  }

  renderError(type, msg) {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: this.props.broadcast.preview}}
          style={styles.fullScreen}
          resizeMode={'cover'}
          pointerEvents={'none'}
        />
        <Badge type={type} text={msg} />
      </View>
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
