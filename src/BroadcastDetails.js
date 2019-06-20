import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Badge from './Badge';

type Props = {
  broadcast: object,
};

export default class BroadcastDetails extends Component<Props> {
  static propTypes = {
    broadcast: PropTypes.object.isRequired,
  };

  static defaultProps = {
  };

  render() {
    const { name, starts_at, timeframe, description } = this.props.broadcast;

    return (
      <View style={styles.padding}>
        <Text style={styles.title}>{name}</Text>
        {timeframe == 'past' && <Text>Broadcasted {starts_at}</Text>}
        <View style={{flexDirection: 'row', marginTop: 5, marginBottom: 5}}>
          {timeframe == 'current' && <Badge type="red" text="LIVE" />}
          {timeframe == 'future' && <Badge type="warning" text="UPCOMING" />}
          {timeframe == 'preroll' && <Badge type="warning" text="STARTING SOON" />}
          {timeframe == 'past' && <Badge text="Recorded" />}
        </View>
        <Text>{description}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  padding: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 28,
  },
});
