import React, {Component} from 'react';
import {
  ActivityIndicator,
  Animated,
  AsyncStorage,
  Button,
  Dimensions,
  Image,
  PanResponder,
  Platform,
  StatusBar,
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

  componentWillMount() {
    this._y = 0;
    this._animation = new Animated.Value(0);
    this._animation.addListener(({ value }) => {
      this._y = value;
    })

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        {
          dy: this._animation,
        },
      ]),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.timing(this._animation, {
            toValue: 300,
            duration: 200,
          }).start();
          this._animation.setOffset(300);
        } else {
          this._animation.setOffset(0);
          Animated.timing(this._animation, {
            toValue: 0,
            duration: 200,
          }).start();
        }
      },
    });
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
    const { width, height: screenHeight } = Dimensions.get("window");
    const videoHeight = width * 0.5625;

    const padding = 15;
    const statusBarHeight = StatusBar.currentHeight || 0;
    const yOutput = ((screenHeight - videoHeight) + (( videoHeight * .5) / 2)) - padding - statusBarHeight;
    const xOutput = ((width * .5) / 2) - padding;

    const opacityInterpolate = this._animation.interpolate({
      inputRange: [0, 300],
      outputRange: [1, 0],
    });

    const translateYInterpolate = this._animation.interpolate({
      inputRange: [0, 300],
      outputRange: [0, yOutput],
      extrapolate: "clamp",
    });

    const scaleInterpolate = this._animation.interpolate({
      inputRange: [0, 300],
      outputRange: [1, 0.5],
      extrapolate: "clamp",
    });

    const translateXInterpolate = this._animation.interpolate({
      inputRange: [0, 300],
      outputRange: [0, xOutput],
      extrapolate: "clamp",
    });

    const scrollStyles = {
      opacity: opacityInterpolate,
      transform: [
        {
          translateY: translateYInterpolate,
        },
      ],
    };

    const videoStyles = {
      transform: [
        {
          translateY: translateYInterpolate,
        },
        {
          translateX: translateXInterpolate,
        },
        {
          scale: scaleInterpolate,
        },
      ],
    };

    return (
      <View style={styles.fullScreen} pointerEvents="box-none">
        <Animated.View
              style={[{ width, height: videoHeight }, videoStyles]}
              {...this._panResponder.panHandlers}>
          <Video
            source={{uri: playlist}}
            ref={this.playerRef}
            style={styles.fullScreen}
            controls={true}
            poster={this.broadcast.poster || this.broadcast.preview}
            /* {...this.analytics.generateVideoEventProps()} */
          />
        </Animated.View>
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

