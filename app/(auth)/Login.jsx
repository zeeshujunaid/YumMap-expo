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
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Utils/Firebase'; // Make sure you initialize Firebase correctly in this file
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import Forgetpassword from '../../components/Forgotpassword';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields.',
      });
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
      });
      router.push('/(tabs)/Home');
    } catch (error) {
      console.error('Login Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message,
      });
    } finally {
      setLoading(false);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              paddingHorizontal: 20,
              justifyContent: 'center',
              paddingVertical: 40,
            }}
          >
            {/* Logo Section */}
            <View style={{ alignItems: 'center', marginBottom: 30 }}>
              <Image
                source={require('../../assets/images/YumMap.png')}
                style={{ height: 90, width: 80 }}
              />
            </View>

            {/* Welcome Section */}
            <View style={{ marginBottom: 30 }}>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '600',
                  color: '#000',
                  textAlign: 'center',
                }}
              >
                Welcome Back
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#666',
                  textAlign: 'center',
                  marginTop: 5,
                }}
              >
                Login to your account as a restaurant or user
              </Text>
            </View>

            {/* Input Fields */}
            <View style={{ gap: 15 }}>
              <Text style={{ fontSize: 16, color: '#000' }}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 16,
                }}
              />

              <Text style={{ fontSize: 16, color: '#000', marginTop: 15 }}>
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                autoCapitalize="none"
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 16,
                }}
              />
            </View>

            {/* Forgot & Signup Links */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 20,
                gap: 90,
                width: '100%',
              }}
            >
              <TouchableOpacity onPress={() => router.push('/Signup')}>
                <Text style={{ color: '#FF4D4D', fontSize: 12 }}>
                  Don’t have an account?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowForgotModal(true)}>
                <Text style={{ color: '#4c9efa', fontSize: 12 }}>
                  Forgot Password
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={{
                backgroundColor: '#FF4D4D',
                paddingVertical: 14,
                borderRadius: 10,
                marginTop: 30,
                alignItems: 'center',
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                >
                  Login
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Forgot Password Modal */}
      <Forgetpassword
        visible={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </KeyboardAvoidingView>
  );
}
