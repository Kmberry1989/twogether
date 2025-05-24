import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, Button, ActivityIndicator } from 'react-native';
import { useGlobal } from './GlobalContext';

// Mock fetch - replace with real API call
const fetchDailyActivity = async (coupleId: string) => {
  // return { activityId: 'trivia1', question: 'What is 2+2?', options: ['3', '4', '5'], turn: 'A' };
  return new Promise(resolve => setTimeout(() => resolve({ activityId: 'trivia1', question: 'What is 2+2?', options: ['3', '4', '5'], turn: 'A' }), 500));
};

export default function HomeScreen({ navigation }) {
  const { couple, session, setSession } = useGlobal();
  const [loading, setLoading] = React.useState(true);
  const [activity, setActivity] = React.useState(null);

  useEffect(() => {
    if (!couple) return;
    fetchDailyActivity(couple.coupleId).then((act: any) => {
      setActivity(act);
      setSession({ sessionId: Date.now().toString(), activityId: act.activityId, turn: act.turn, data: {} });
      setLoading(false);
    });
  }, [couple]);

  if (!couple) {
    return (
      <SafeAreaView style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <Text>No couple data. Please restart onboarding.</Text>
        <Button title="Restart" onPress={() => navigation.replace('Onboarding')} />
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex:1, padding:16 }}>
      <Text style={{ fontSize:24, marginBottom:12 }}>Today’s Activity</Text>
      <View style={{ padding:16, borderWidth:1, borderRadius:8, marginBottom:16 }}>
        <Text style={{ fontSize:18, marginBottom:8 }}>{(activity as any).question}</Text>
        {(activity as any).options.map((opt: string) => (
          <Button key={opt} title={opt} onPress={() => navigation.navigate('Activity', { answer: opt })} />
        ))}
      </View>
      <Button title="View Journey" onPress={() => navigation.navigate('Journey')} />
    </SafeAreaView>
  );
}
