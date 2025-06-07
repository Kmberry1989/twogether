import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './AuthContext';
import { useGlobal } from './GlobalContext';
import { scheduleDailyReminder } from './NotificationService';

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const { signup, isLoading } = useAuth();
  const { setCouple } = useGlobal();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [partnerAName, setPartnerAName] = useState('');
  const [partnerBName, setPartnerBName] = useState('');
  const [avatarA, setAvatarA] = useState(null);
  const [avatarB, setAvatarB] = useState(null);
  const [error, setError] = useState('');

  async function pickImage(setAvatar) {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.cancelled) setAvatar(result.uri);
  }

  const canContinue = email && password && partnerAName && partnerBName;

  const handleSignup = async () => {
    if (!canContinue) return;
    setError('');
    try {
      await signup(email, password, { name: partnerAName, avatarUrl: avatarA }, { name: partnerBName, avatarUrl: avatarB });
      const { coupleId } = await import('./AuthContext').then(mod => mod.useAuth());
      setCouple({ partnerA: { name: partnerAName, avatarUri: avatarA }, partnerB: { name: partnerBName, avatarUri: avatarB }, coupleId });
      // schedule a daily reminder at 9am local time
      scheduleDailyReminder(9, 0);
      navigation.replace('Home');
    } catch (e) {
      setError('Signup failed');
    }
  };

  if (isLoading) {
    return <SafeAreaView style={{ flex:1, alignItems:'center', justifyContent:'center' }}><ActivityIndicator size="large"/></SafeAreaView>;
  }

  return (
    <SafeAreaView style={{ flex:1, padding:16, justifyContent:'center' }}>
      <Text style={{ fontSize:28, textAlign:'center', marginBottom:24 }}>Welcome to Twogether™</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth:1, borderRadius:8, padding:8, marginBottom:12 }} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth:1, borderRadius:8, padding:8, marginBottom:24 }} />
      <View style={{ marginBottom:16 }}>
        <Text>Partner A Name</Text>
        <TextInput value={partnerAName} onChangeText={setPartnerAName} style={{ borderWidth:1, borderRadius:8, padding:8, marginTop:8 }} />
        <TouchableOpacity onPress={() => pickImage(setAvatarA)} style={{ marginTop:8, alignItems:'center' }}>
          {avatarA ? <Image source={{ uri:avatarA }} style={{ width:80, height:80, borderRadius:40 }} /> : <View style={{ width:80, height:80, borderRadius:40, backgroundColor:'#ddd', alignItems:'center', justifyContent:'center' }}><Text>Add Avatar</Text></View>}
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom:24 }}>
        <Text>Partner B Name</Text>
        <TextInput value={partnerBName} onChangeText={setPartnerBName} style={{ borderWidth:1, borderRadius:8, padding:8, marginTop:8 }} />
        <TouchableOpacity onPress={() => pickImage(setAvatarB)} style={{ marginTop:8, alignItems:'center' }}>
          {avatarB ? <Image source={{ uri:avatarB }} style={{ width:80, height:80, borderRadius:40 }} /> : <View style={{ width:80, height:80, borderRadius:40, backgroundColor:'#ddd', alignItems:'center', justifyContent:'center' }}><Text>Add Avatar</Text></View>}
        </TouchableOpacity>
      </View>
      {error ? <Text style={{ color:'red', marginBottom:12 }}>{error}</Text> : null}
      <Button title="Create Account" onPress={handleSignup} disabled={!canContinue} />
    </SafeAreaView>
  );
}
