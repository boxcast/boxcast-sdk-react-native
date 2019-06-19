import React, {Component} from 'react';
import {StyleSheet, FlatList, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';

import { api } from 'boxcast-sdk-js';

import BroadcastPreview from './BroadcastPreview';

const PAGE_SIZE = 20;

export default class Channel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      broadcasts: [],
      error: null,
      page: 1,
      loading: true,
      refreshing: false,
      loadingMore: false,
    };
  }

  componentDidMount() {
    this._fetch();
  }

  render() {
    const { loading, broadcasts, error, refreshing } = this.state;
    console.log('flatlist refreshing', refreshing);
    return (
      <View style={styles.container}>
        <FlatList style={{width: '100%'}}
                  contentContainerStyle={{
                    flex: 1,
                    flexDirection: 'column',
                    height: '100%',
                    width: '100%'
                  }}
                  data={broadcasts}
                  renderItem={({item}) => this.renderBroadcast(item)}
                  keyExtractor={(item, index) => item.id}
                  onEndReached={() => this._handleLoadMore()}
                  onEndReachedThreshold={0.5}
                  initialNumToRender={PAGE_SIZE}
                  ListFooterComponent={() => this._renderFooter()}
                  refreshing={refreshing}
                  onRefresh={() => this._handleRefresh()}
            />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }

  renderBroadcast(broadcast) {
    return ( 
      <View style={{marginTop:15, width: '50%'}}>
        <TouchableOpacity onPress={() => this.props.onSelectBroadcast(broadcast)}>
          <BroadcastPreview broadcast={broadcast} />
        </TouchableOpacity>
      </View>
    );
  }

  _renderFooter() {
    if (!this.state.loadingMore) return null;

    return (
      <View
        style={{
          position: 'relative',
          width: '100%',
          height: 50,
          paddingVertical: 20,
          borderTopWidth: 1,
          marginTop: 10,
          marginBottom: 10,
          borderColor: '#f2f2f2'
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  _handleRefresh() {
    console.log('_handleRefresh');
    this.setState(
      {broadcasts: [], page: 1, refreshing: true},
      () => this._fetch()
    );
  }

  _fetch() {
    const { channelId } = this.props;
    const args = {
      q: 'timeframe:relevant',
      s: '-starts_at',
      l: PAGE_SIZE,
      p: this.state.page
    };
    api.broadcasts.list(channelId, args).then((r) => {
      console.log('loaded ', r.data.length, 'broadcasts');
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
    console.log('_handleLoadMore');
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
});

