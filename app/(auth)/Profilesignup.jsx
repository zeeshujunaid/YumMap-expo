import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../Utils/Firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function Profilesignup({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
    const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Camera roll access is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadToCloudinary = async (imageUri) => {
    const base64 = await fetch(imageUri).then(res => res.blob());

    const data = new FormData();
    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });
    data.append('upload_preset', 'YumMapPics');
    data.append('cloud_name', 'dudx3of1n');

    const res = await fetch('https://api.cloudinary.com/v1_1/dudx3of1n/image/upload', {
      method: 'POST',
      body: data,
    });

    const file = await res.json();
    return file.secure_url;
  };

  const Setprofile = async () => {
    if (!name || !phone) {
     Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields.',
      });
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Toast.show({
          type: 'error',    
            text1: 'Error',
            text2: 'User not authenticated.',
        });
        setLoading(false);
        return;
      }

      const uid = currentUser.uid;

      let imageUrl = '';
      if (selectedImage) {
        imageUrl = await uploadToCloudinary(selectedImage);
      }

      await updateDoc(doc(db, 'users', uid), {
        name,
        phone,
        ProfileImage: imageUrl,
      });

        Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been updated successfully.',
      });
      router.push('/(tabs)/Homescreen') // Navigate to main screen
    } catch (error) {
      console.error('Profile Error:', error);
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to update profile. Please try again.',
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ overflow: 'hidden' }}>
              <Image
                source={require('../../assets/images/resbg.png')}
                resizeMode="cover"
                style={{ height: 200, width: '100%' }}
              />
            </View>

            <View
              style={{
                backgroundColor: '#fff',
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                marginTop: -40,
                alignItems: 'center',
              }}
            >
              <View style={{ marginTop: -55 }}>
                <Image
                  source={
                    selectedImage
                      ? { uri: selectedImage }
                      : require('../../assets/images/profileicon.png')
                  }
                  style={{
                    height: 150,
                    width: 150,
                    borderRadius: 75,
                  }}
                />
              </View>

              <Text style={{ fontSize: 12, color: '#666', marginTop: 40 }}>
                Please fill in your details
              </Text>

              <TouchableOpacity
                onPress={handleImagePick}
                style={{
                  backgroundColor: '#fff',
                  height: 40,
                  width: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                  position: 'absolute',
                  top: 55,
                  right: 120,
                }}
              >
                <Image
                  source={require('../../assets/images/cameraicon.png')}
                  style={{ height: 40, width: 40 }}
                />
              </TouchableOpacity>

              <View style={{ paddingVertical: 20, paddingHorizontal: 20, width: '100%' }}>
                <Text style={{ fontSize: 16, color: '#000', marginTop: 20 }}>Full Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="John"
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 10,
                    padding: 12,
                    fontSize: 16,
                    width: '100%',
                    marginTop: 10,
                  }}
                />

                <Text style={{ fontSize: 16, color: '#000', marginTop: 20 }}>
                  Enter Your Phone Number
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+1234567890"
                  keyboardType="phone-pad"
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 10,
                    padding: 12,
                    fontSize: 16,
                    width: '100%',
                    marginTop: 10,
                  }}
                />
              </View>

              <View style={{ width: '100%', paddingHorizontal: 20, marginTop: 20 }}>
                <TouchableOpacity
                  onPress={Setprofile}
                  disabled={loading}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: '#FF4D4D',
                    borderRadius: 12,
                    paddingVertical: 15,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 4,
                  }}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                      Done
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
