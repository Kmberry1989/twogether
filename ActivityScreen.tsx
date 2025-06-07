// ActivityScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useGlobal } from './GlobalContext';

interface ActivityPayload {
  question: string;
  options: string[];
}

interface Activity {
  activityId: string;
  type: string;
  payload: ActivityPayload;
  startingTurn: 'A' | 'B';
}

// Set your API base URL for local dev or production
const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:4000'
  : '';

export default function ActivityScreen({ navigation }: any) {
  const { token } = useAuth();
  const { addSession } = useGlobal();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const resp = await axios.get<Activity>(
          API_BASE_URL + '/activity/today',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setActivity(resp.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch activity.');
        console.error('Failed to fetch activity:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
        <Button title="Retry" onPress={() => {
          setLoading(true);
          setError(null);
          setActivity(null);
          // re-run effect
          (async () => {
            try {
              const resp = await axios.get<Activity>(
                API_BASE_URL + '/activity/today',
                { headers: { Authorization: `Bearer ${token}` } }
              );
              setActivity(resp.data);
              setError(null);
            } catch (err) {
              setError('Failed to fetch activity.');
            } finally {
              setLoading(false);
            }
          })();
        }} />
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={styles.center}>
        <Text>No activity available.</Text>
      </View>
    );
  }

  const handleOptionPress = async (option: string) => {
    try {
      const resp = await axios.post(
        API_BASE_URL + '/sessions',
        {
          activityId: activity.activityId,
          turn: activity.startingTurn,
          response: option,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addSession({
        sessionId: resp.data.sessionId,
        activityId: activity.activityId,
        turn: activity.startingTurn,
        response: option,
        mediaUrls: [],
        timestamp: resp.data.timestamp,
      });
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Error', 'Failed to submit session.');
      console.error('Failed to submit session:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{activity.payload.question}</Text>
      {activity.payload.options.map(opt => (
        <View key={opt} style={styles.buttonWrapper}>
          <Button title={opt} onPress={() => handleOptionPress(opt)} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonWrapper: {
    marginVertical: 8,
  },
});
