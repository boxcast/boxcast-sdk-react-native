import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Dimensions,
  PanResponder,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import BroadcastVideo from './BroadcastVideo';
import BroadcastDetails from './BroadcastDetails';

type Props = {
  broadcast: object,
  dockable?: boolean,
  dismissText?: string,
  dismissStyle?: StyleObj,
  onDismiss?: () => mixed,
  dragAcceleration: number,
};

export default class BroadcastModalView extends Component<Props> {
  static propTypes = {
    broadcast: PropTypes.object.isRequired,
    dockable: PropTypes.bool,
    dismissText: PropTypes.string,
    dismissStyle: PropTypes.any,
    onDismiss: PropTypes.func,
    dragAcceleration: PropTypes.number,
  };

  static defaultProps = {
    dockable: false,
    dismissText: 'Close',
    dismissStyle: {},
    onDismiss: function(){},
    dragAcceleration: 1.5,
  };

  constructor(props) {
    super(props);

    this.state = {
      docked: false,
    };

    this._initPanResponder();
  }

  _initPanResponder() {
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
        if (!this.props.dockable) {
          return;
        } else if (this.state.docked) {
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
    if (prevBroadcastId != newBroadcastId) {
      this._springBackToTop();
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

  renderDefaultView() {
    return (
      <View style={this.props.styles.fullScreen} pointerEvents="box-none">
        <Animated.View style={this.props.videoStyles} {...this.props.animationProps}>
          {<BroadcastVideo {...this.props} />}
        </Animated.View>
        <Animated.ScrollView style={[styles.detailsBox, this.props.transforms.details]}>
          <BroadcastDetails {...this.props} />
          <TouchableOpacity
            style={[styles.dismissButton, this.props.dismissStyle]}
            onPress={() => this.props.onDismiss()}><Text>{this.props.dismissText}</Text></TouchableOpacity>
        </Animated.ScrollView>
      </View>
    );
  }

  render() {
    const animationProps = this._panResponder.panHandlers;
    const transforms = this._computeDraggedTransforms();
    const videoStyles = [
      { width: transforms.width, height: transforms.videoHeight },
      transforms.video,
      { backgroundColor: '#000000' },
    ];

    const videoProps = {...this.props, ...animationProps, transforms, videoStyles, styles};

    return (
      this.props.renderView
        ? this.props.renderView(videoProps)
        : this.renderDefaultView()
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

    if (!this.props.dockable) {
      videoStyles = {
        transform: [
          {translateY: 0},
          {translateX: 0},
          {scale: 1},
        ],
      };
      detailStyles = {
        opacity: 1,
        transform: [{translateY: 0}],
      };
    } else if (this.state.docked) {
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
    backgroundColor: "#ffffff",
  },
  dismissButton: {
    alignItems: 'center',
    backgroundColor: '#dddddd',
    color: '#333333',
    borderRadius: 4,
    borderWidth: 0,
    padding: 10,
    margin: 15,
  },
});
