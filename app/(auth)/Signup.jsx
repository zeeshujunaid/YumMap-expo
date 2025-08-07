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
  StatusBar,
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
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill in all fields',
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Weak Password',
        text2: 'Password must be at least 6 characters long',
      });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        email,
        createdAt: new Date().toISOString(),
        uid,
        role: 'user', 
      });

      Toast.show({
        type: 'success',
        text1: 'Account created successfully!',
      });

      setEmail('');
      setPassword('');
      router.push('/(auth)/Profilesignup'); // Navigate after success
    } catch (error) {
      console.error('Signup Error:', error);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <StatusBar hidden />
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              paddingHorizontal: 20,
              justifyContent: 'center',
              paddingVertical: 40,
            }}
          >
            {/* Logo */}
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <Image
                source={require('../../assets/images/YumMap.png')}
                style={{ height: 90, width: 80 }}
              />
            </View>

            {/* Welcome */}
            <View style={{ marginBottom: 30 }}>
              <Text style={{ fontSize: 28, fontWeight: '600', color: '#000', textAlign: 'center' }}>
                Welcome
              </Text>
              <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginTop: 5 }}>
                Please signup to enjoy the app
              </Text>
            </View>

            {/* Inputs */}
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

            {/* Navigation Links */}
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                justifyContent: 'space-around',
                width: '100%',
                gap: 60,
              }}
            >
              <TouchableOpacity onPress={() => router.push('/(auth)/RestaurantSignup')}>
                <Text style={{ color: '#FF4D4D', fontSize: 12 }}>Signup as a Restaurant?</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/(auth)/Login')}>
                <Text style={{ color: '#4c9efa', fontSize: 12 }}>Already have an account?</Text>
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
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                >
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
