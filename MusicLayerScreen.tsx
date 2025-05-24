import React from 'react';
import { AuthProvider } from './AuthContext';
import { GlobalProvider } from './GlobalContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from './OnboardingScreen';
import HomeScreen from './HomeScreen';
import ActivityScreen from './ActivityScreen';
import PictionaryScreen from './PictionaryScreen';
import MusicLayerScreen from './MusicLayerScreen';
import JourneyScreen from './JourneyScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Onboarding">
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Activity" component={ActivityScreen} />
            <Stack.Screen name="Pictionary" component={PictionaryScreen} />
            <Stack.Screen name="MusicLayer" component={MusicLayerScreen} />
            <Stack.Screen name="Journey" component={JourneyScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GlobalProvider>
    </AuthProvider>
  );
}, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useGlobal } from './GlobalContext';

export default function MusicLayerScreen() {
  const navigation = useNavigation();
  const { session, setSession } = useGlobal();
  const [step, setStep] = useState<'recordBase' | 'recordLayer' | 'submit'>('recordBase');
  const [baseRecording, setBaseRecording] = useState<Audio.Recording | null>(null);
  const [layerRecording, setLayerRecording] = useState<Audio.Recording | null>(null);
  const [baseUri, setBaseUri] = useState<string | null>(null);
  const [layerUri, setLayerUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);

  const startBaseRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      setBaseRecording(recording);
    } catch {
      Alert.alert('Error', 'Could not start recording.');
    }
  };

  const stopBaseRecording = async () => {
    if (!baseRecording) return;
    await baseRecording.stopAndUnloadAsync();
    const uri = baseRecording.getURI()!;
    setBaseUri(uri);
    setBaseRecording(null);
    setStep('recordLayer');
  };

  const startLayerRecording = async () => {
    if (!baseUri) return;
    try {
      const { sound: s } = await Audio.Sound.createAsync({ uri: baseUri });
      setSound(s);
      await s.playAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      setLayerRecording(recording);
    } catch {
      Alert.alert('Error', 'Could not start layer recording.');
    }
  };

  const stopLayerRecording = async () => {
    if (!layerRecording || !sound) return;
    await layerRecording.stopAndUnloadAsync();
    await sound.stopAsync();
    const uri = layerRecording.getURI()!;
    setLayerUri(uri);
    setLayerRecording(null);
    setStep('submit');
  };

  const handleSubmit = async () => {
    if (!session || !baseUri || !layerUri) return;
    setLoading(true);
    try {
      const mediaUrls: string[] = [];
      // upload both files sequentially
      for (const uri of [baseUri, layerUri]) {
        const form = new FormData();
        form.append('file', { uri, name: uri.split('/').pop(), type: 'audio/m4a' } as any);
        const resp = await axios.post('/media/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
        mediaUrls.push(resp.data.url);
      }
      const respSession = await axios.post('/sessions', {
        activityId: session.activityId,
        turn: session.turn,
        response: {},
        mediaUrls
      });
      const { sessionId, timestamp } = respSession.data;
      setSession({ sessionId, activityId: session.activityId, turn: session.turn, data: {}, timestamp });
      navigation.navigate('Journey');
    } catch {
      Alert.alert('Error', 'Failed to submit your music layers.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SafeAreaView style={styles.center}><ActivityIndicator size="large"/></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {step === 'recordBase' && (
        <View style={styles.stepContainer}>
          <Text style={styles.label}>Step 1: Record your melody</Text>
          <Button title={baseRecording ? 'Stop Recording' : 'Start Recording'} onPress={baseRecording ? stopBaseRecording : startBaseRecording} />
        </View>
      )}
      {step === 'recordLayer' && (
        <View style={styles.stepContainer}>
          <Text style={styles.label}>Step 2: Record your harmony</Text>
          <Button title={layerRecording ? 'Stop Harmony Recording' : 'Start Harmony Recording'} onPress={layerRecording ? stopLayerRecording : startLayerRecording} />
        </View>
      )}
      {step === 'submit' && (
        <View style={styles.stepContainer}>
          <Text style={styles.label}>Step 3: Submit your duet</Text>
          <Button title="Submit and View Journey" onPress={handleSubmit} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  stepContainer: { alignItems: 'center', marginBottom: 24 },
  label: { fontSize: 18, marginBottom: 12 },
});
