import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';

export default function JourneyScreen() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const resp = await axios.get('/sessions');
        setSessions(resp.data);
      } catch (err) {
        console.error('Failed to load session history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Our Journey</Text>
      {sessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No sessions yet. Try an activity!</Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.sessionId}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
              <Text>Activity: {item.activityId}</Text>
              <Text>Turn: {item.turn}</Text>
              <Text>Answer: {item.response?.answer}</Text>
              {item.mediaUrls?.map((url: string, idx: number) => (
                <Image key={idx} source={{ uri: url }} style={styles.media} />
              ))}
            </View>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { fontSize: 24, fontWeight: '600', marginBottom: 12 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { paddingBottom: 16 },
  itemContainer: { padding: 12, borderBottomWidth: 1, borderColor: '#ddd' },
  timestamp: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  media: { width: 100, height: 100, marginTop: 8, borderRadius: 8 },
});
