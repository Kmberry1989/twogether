import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './AuthContext';
import { useGlobal } from './GlobalContext';

const activityRoutes: Record<string, string> = {
  trivia: 'Activity',
  drawing: 'Pictionary',
  // add other types and corresponding routes here
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const { coupleId } = useAuth();
  const { setSession } = useGlobal();
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<any>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!coupleId) return;
      try {
        setLoading(true);
        const resp = await axios.get('/activity/today');
        const data = resp.data;
        setActivity(data);
        setSession({ sessionId: Date.now().toString(), activityId: data.activityId, turn: data.startingTurn, data: {} });
      } catch {
        Alert.alert('Error', "Failed to load today's activity.");
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [coupleId]);

  if (!coupleId) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No couple data. Please login again.</Text>
        <Button title="Restart" onPress={() => navigation.replace('Onboarding')} />
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const routeName = activityRoutes[activity.type] || 'Activity';

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Today's Activity</Text>
      <View style={styles.card}>
        <Text style={styles.question}>{activity.payload.question || activity.payload.prompt}</Text>
        {activity.type === 'trivia' && activity.payload.options.map((opt: string) => (
          <Button
            key={opt}
            title={opt}
            onPress={() => navigation.navigate(routeName, { answer: opt })}
          />
        ))}
        {activity.type === 'drawing' && (
          <Button
            title="Start Drawing"
            onPress={() => navigation.navigate(routeName)}
          />
        )}
        {/* add other activity type UIs here */}
      </View>
      <Button title="View Journey" onPress={() => navigation.navigate('Journey')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 12 },
  card: { padding: 16, borderWidth: 1, borderRadius: 8, marginBottom: 16 },
  question: { fontSize: 18, marginBottom: 8 },
});
