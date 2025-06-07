import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useGlobal } from './GlobalContext';

const BADGES = [
  { threshold: 1, label: '🎉 First Activity Completed' },
  { threshold: 7, label: '🏆 7-Day Streak' },
  { threshold: 30, label: '🥇 30 Sessions Milestone' },
];

export default function RewardsScreen() {
  const { history } = useGlobal();
  const total = history.length;
  const points = total * 10;

  const earned = BADGES.filter((b) => total >= b.threshold);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rewards</Text>
      <View style={styles.row}>
        <Text>Total Sessions:</Text>
        <Text>{total}</Text>
      </View>
      <View style={styles.row}>
        <Text>Total Points:</Text>
        <Text>{points}</Text>
      </View>
      <FlatList
        data={earned}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => <Text style={styles.badge}>{item.label}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  badge: { fontSize: 16, marginBottom: 4 },
});
