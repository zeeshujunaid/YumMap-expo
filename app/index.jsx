import { View, Button } from 'react-native';
import Toast from 'react-native-toast-message';
import { getAuth } from 'firebase/auth';
import { router } from 'expo-router';
import app from '../Utils/Firebase'; // make sure this is correct

export default function Index() {
  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Hello Zeeshan! 👋',
      text2: 'This is a toast message.',
    });
    router.replace('/(tabs)/Homescreen'); // ✅ corrected
  };

  const checkFirebaseAuth = () => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (user) {
      Toast.show({
        type: 'success',
        text1: '✅ Logged In',
        text2: `Welcome back, ${user.email}`,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: '❌ Not Logged In',
        text2: 'No user found in Firebase Auth.',
      });
      router.replace('/(auth)/Login'); // ✅ send to login screen
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Show Toast" onPress={showToast} />
      <View style={{ height: 20 }} />
      <Button title="Check Firebase Auth & Go to Drawer" onPress={checkFirebaseAuth} />
    </View>
  );
}
