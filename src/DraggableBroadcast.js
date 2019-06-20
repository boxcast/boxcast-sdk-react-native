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

import Broadcast from './Broadcast';



type Props = {
  broadcast: object,
  onDismiss?: () => mixed,
};

export default class DraggableBroadcast extends Component<Props> {
  static propTypes = {
    broadcast: PropTypes.object.isRequired,
    onDismiss: PropTypes.func,
    dragAcceleration: PropTypes.number,
  };

  static defaultProps = {
    onDismiss: function(){},
    dragAcceleration: 1.5,
  };

  state = {
    docked: false,
    enableBroadcast: true,
  };

  componentWillMount() {
    const { width, height: screenHeight } = Dimensions.get("window");
    this.animHeight = screenHeight / this.props.dragAcceleration;
    this.animWidth = width / (3 * this.props.dragAcceleration);

    this._yAnimation = new Animated.Value(0);
    this._xAnimation = new Animated.Value(0);

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {
        dy: this._yAnimation,
        dx: this._xAnimation,
      }]),
      onPanResponderRelease: (e, gestureState) => {
        if (this.state.docked) {
          this._handleHorizontalPan(gestureState);
        } else {
          this._handleVerticalPan(gestureState);
        }
      },
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevBroadcastId = (prevProps.broadcast||{}).id;
    const newBroadcastId = (this.props.broadcast||{}).id;
    if (!newBroadcastId) {
      return this.props.onDismiss();
    }
    if (!this.state.enableBroadcast) {
      this.setState({enableBroadcast: true});
    }
    if (prevBroadcastId != newBroadcastId) {
      this._springBackToTop();
      this.setState({enableBroadcast: false});
    }
  }

  _handleVerticalPan(gestureState) {
    const verticalMovementThreshold = 100;
    if (gestureState.dy > verticalMovementThreshold) {
      // Dock it in lower right of screen
      Animated.timing(this._yAnimation, {toValue: this.animHeight, duration: 200}).start();
      this._yAnimation.setOffset(this.animHeight);
      // Reset x animation for dismiss animation
      this._xAnimation.setOffset(0);
      this._xAnimation.setValue(0);
      this.setState({docked: true});
    } else {
      this._springBackToTop();
    }
  }

  _springBackToTop() {
    this._yAnimation.setOffset(0);
    Animated.timing(this._yAnimation, {toValue: 0, duration: 200}).start();
    this.setState({docked: false});
  }

  _handleHorizontalPan(gestureState) {
    if (gestureState.dx > 20) {
      // Kill it
      this.props.onDismiss();
    } else {
      this._springBackToTop();
    }
  }

  render() {
    const { broadcast } = this.props;
    const transforms = this._computeDraggedTransforms();

    const videoStyles = [
      { width: transforms.width, height: transforms.videoHeight },
      transforms.video,
      { backgroundColor: '#000000' },
    ];

    return (
      <View style={styles.fullScreen} pointerEvents="box-none">
        <Animated.View style={videoStyles} {...this._panResponder.panHandlers}>
          {this.state.enableBroadcast && <Broadcast {...this.props} />}
        </Animated.View>
        <Animated.ScrollView style={[styles.detailsBox, transforms.details]}>
          <View style={styles.padding}>
            <Text style={styles.title}>{broadcast.name}</Text>
            <Text>{broadcast.description}</Text>
            <Text>Broadcasted {broadcast.starts_at}</Text>
          </View>
        </Animated.ScrollView>
      </View>
    );
  }

  _computeDraggedTransforms() {
    const { width, height: screenHeight } = Dimensions.get("window");
    const videoHeight = width * 0.5625;

    const padding = 15;
    const statusBarHeight = StatusBar.currentHeight || 0;
    const yOutput = ((screenHeight - videoHeight) + (videoHeight * 0.25)) - padding - statusBarHeight;
    const xOutput = (width * 0.25) - padding;

    var videoStyles = {}, detailStyles = {};

    if (this.state.docked) {
      // When docked, animate the X movement along a horiztonal axis to dismiss
      translateXInterpolate = this._xAnimation.interpolate({
        inputRange: [0, this.animWidth],
        outputRange: [xOutput, width - xOutput - padding],
        extrapolate: "clamp",
      });
      videoStyles = {
        transform: [
          {translateY: yOutput},
          {translateX: translateXInterpolate},
          {scale: 0.5},
        ],
      };
      detailStyles = {
        opacity: 0,
        transform: [{translateY: yOutput}],
      };
    } else {
      // When not docked, animate the top-to-lower-right docking
      var opacityInterpolate = this._yAnimation.interpolate({
        inputRange: [0, this.animHeight],
        outputRange: [1, 0],
      });

      var translateYInterpolate = this._yAnimation.interpolate({
        inputRange: [0, this.animHeight],
        outputRange: [0, yOutput],
        extrapolate: "clamp",
      });

      var translateXInterpolate = this._yAnimation.interpolate({
        inputRange: [0, this.animHeight],
        outputRange: [0, xOutput],
        extrapolate: "clamp",
      });

      var scaleInterpolate = this._yAnimation.interpolate({
        inputRange: [0, this.animHeight],
        outputRange: [1, 0.5],
        extrapolate: "clamp",
      });

      videoStyles = {
        transform: [
          {translateY: translateYInterpolate},
          {translateX: translateXInterpolate},
          {scale: scaleInterpolate},
        ],
      };

      detailStyles = {
        opacity: opacityInterpolate,
        transform: [
          {
            translateY: translateYInterpolate,
          },
        ],
      };
    }

    return {video: videoStyles, details: detailStyles, width, videoHeight};
  }
};


const styles = StyleSheet.create({
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  detailsBox: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  padding: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 28,
  },
});
