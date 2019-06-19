import React, {Component} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import { api } from 'boxcast-sdk-js';
import BroadcastPreview from './BroadcastPreview';

type Props = {
  channelId: string,
  horizontal?: boolean,
  titleStyle?: StyleObj,
  onSelectBroadcast?: () => mixed,
  pageSize: int,
};

export default class Channel extends Component<Props> {
  static propTypes = {
    channelId: PropTypes.string.isRequired,
    horizontal: PropTypes.bool,
    onSelectBroadcast: PropTypes.func,
    pageSize: PropTypes.number,
  };

  static defaultProps = {
    horizontal: false,
    onSelectBroadcast: function(){},
    pageSize: 20,
  };

  state = {
    broadcasts: [],
    error: null,
    page: 1,
    loading: true,
    refreshing: false,
    loadingMore: false,
    width: 0,
    height: 0,
  };

  componentDidMount() {
    this._fetch();
  }

  render() {
    const { loading, broadcasts, error, refreshing } = this.state;
    return (
      <View style={styles.container}
            onLayout={(event) => {
              var {width, height} = event.nativeEvent.layout;
              this.setState({width, height})
            }}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <FlatList style={{width: '100%'}}
                  contentContainerStyle={{
                  }}
                  data={broadcasts}
                  horizontal={this.props.horizontal}
                  renderItem={({item}) => this.renderBroadcast(item)}
                  keyExtractor={(item, index) => item.id}
                  onEndReached={() => this._handleLoadMore()}
                  onEndReachedThreshold={0.5}
                  initialNumToRender={this.props.pageSize}
                  ListFooterComponent={() => this._renderFooter()}
                  refreshing={refreshing}
                  onRefresh={() => this._handleRefresh()}
            />
      </View>
    );
  }

  renderBroadcast(broadcast) {
    var style, broadcastStyle;
    if (this.props.horizontal) {
      style = {marginRight: 15};
      broadcastStyle = {height: this.state.height, width: this.state.height * 16/9};
    } else {
      style = {marginBottom: 15};
      broadcastStyle = {width: '100%', height: this.state.height * 9/16};
    }
    return ( 
      <View style={[style, broadcastStyle]}>
        <BroadcastPreview broadcast={broadcast}
                          style={broadcastStyle}
                          onPress={() => this.props.onSelectBroadcast(broadcast)} />
      </View>
    );
  }

  _renderFooter() {
    if (!this.state.loadingMore) return null;
    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  _handleRefresh() {
    this.setState(
      {broadcasts: [], page: 1, refreshing: true},
      () => this._fetch()
    );
  }

  _fetch() {
    const { channelId, pageSize } = this.props;
    const args = {
      q: 'timeframe:relevant',
      s: '-starts_at',
      l: pageSize,
      p: this.state.page
    };
    api.broadcasts.list(channelId, args).then((r) => {
      this.setState({
        broadcasts: [].concat(this.state.broadcasts).concat(r.data),
        error: null,
        loading: false,
        refreshing: false,
        loadingMore: false
      });
    }).catch((err) => {
      var error = err.response.data;
      if (error.error_description) {
        error = `${error.error_description}`;
      } else {
        error = `Error: ${JSON.stringify(error)}`;
      }
      this.setState({
        error: error,
        loading: false,
        refreshing: false,
        loadingMore: false
      });
    });
  }

  _handleLoadMore() {
    this.setState(
      (prevState, nextProps) => ({
        page: prevState.page + 1,
        loadingMore: true
      }),
      () => this._fetch()
    );
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
    width: '100%',
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
  footerLoading: {
    position: 'relative',
    width: '100%',
    height: 50,
    paddingVertical: 20,
    borderTopWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    borderColor: '#f2f2f2'
  }
});

