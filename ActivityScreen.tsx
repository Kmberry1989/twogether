// ActivityScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
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

export default function ActivityScreen({ navigation }: any) {
  const { token } = useAuth();
  const { addSession } = useGlobal();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        // token & baseURL already configured in AuthContext
        const resp = await axios.get<Activity>('/activity/today');
        setActivity(resp.data);
      } catch (err) {
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

  if (!activity) {
    return (
      <View style={styles.center}>
        <Text>No activity available.</Text>
      </View>
    );
  }

  const handleOptionPress = async (option: string) => {
    try {
      const resp = await axios.post('/sessions', {
        activityId: activity.activityId,
        turn: activity.startingTurn,
        response: option,
      });
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
