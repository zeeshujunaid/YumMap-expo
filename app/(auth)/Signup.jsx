import {
  Image,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import React, { useState } from 'react';
import { auth, db } from '../../Utils/Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        email,
      });

      Alert.alert('Success', 'Account created successfully!');
      router.push('/(auth)/Profilesignup'); // Redirect to Login page after successful signup
      setEmail('');
      setPassword('');
    } catch (error) {
      console.log('Signup Error:', error);
      Toast.show({
        type: 'error',  
        text1: 'Signup Failed',
        text2: error.message,
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <StatusBar hidden />
          <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, justifyContent: 'center', paddingVertical: 40 }}>
            {/* Logo Section */}
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <Image source={require('../../assets/images/YumMap.png')} style={{ height: 90, width: 80 }} />
            </View>

            {/* Welcome Section */}
            <View style={{ marginBottom: 30 }}>
              <Text style={{ fontSize: 28, fontWeight: '600', color: '#000', textAlign: 'center' }}>Welcome</Text>
              <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginTop: 5 }}>
                Please signup to enjoy the app
              </Text>
            </View>

            {/* Input Fields */}
            <View style={{ gap: 15 }}>
              <Text style={{ fontSize: 16, color: '#000' }}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                placeholder="Enter your email"
                keyboardType="email-address"
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 16,
                }}
              />

              <Text style={{ fontSize: 16, color: '#000', marginTop: 15 }}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                placeholder="Enter your password"
                secureTextEntry
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 16,
                }}
              />
            </View>

            {/* Already Have Account & Restaurant Signup */}
            <View style={{ flexDirection: 'row', marginTop: 20, width: '100%', justifyContent: 'space-around', gap:70, }}>
              <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.push('/(auth)/RestaurantSignup')}>
                <Text style={{ color: '#FF4D4D', textAlign: 'center', fontSize: 12 }}>Signup as a Restaurant?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.push('/(auth)/Login')}>
                <Text style={{ color: '#4c9efa', textAlign: 'center', fontSize: 12 }}>Already Have an Account?</Text>
              </TouchableOpacity>
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              onPress={handleSignup}
              disabled={loading}
              style={{
                backgroundColor: '#FF4D4D',
                paddingVertical: 14,
                borderRadius: 10,
                marginTop: 30,
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={{ color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
                  Sign Up
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
