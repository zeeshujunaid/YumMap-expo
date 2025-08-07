import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../../Utils/Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import RestaurantTimingModal from "../../components/Timeselector";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export default function RestaurantSignup({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [restaurantTimings, setRestaurantTimings] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 📸 Select image from device
  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "You need to allow access to your photos to upload an image.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // ☁️ Upload image to Cloudinary
  const uploadToCloudinary = async (imageUri) => {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "restaurant.jpg",
    });
    formData.append("upload_preset", "YumMapPics");
    formData.append("cloud_name", "dudx3of1n");

    const response = await fetch("https://api.cloudinary.com/v1_1/dudx3of1n/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!data.secure_url) throw new Error("Image upload failed");
    return data.secure_url;
  };

  // ✅ Form submission
  const handleSignup = async () => {
    if (!name || !email || !password || !phone || !restaurantTimings ) {
     Toast.show({
        type: "error",  
        text1: "Incomplete Form",
        text2: "Please fill all fields and select an image.",
      });
      return;
    }

    if (!selectedImage) {
      Toast.show({
        type: "error",
        text1: "Image Required",
        text2: "Please select a restaurant image.",
      });
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadToCloudinary(selectedImage);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "Resturantdata", uid), {
        name,
        email,
        phone,
        timings: restaurantTimings,
        imageUrl,
        createdAt: new Date().toISOString(),
        uid,
        role: 'Restaurant',
      });

      Toast.show({
        type: "success",
        text1: "Signup Successful",
        text2: "Your restaurant profile has been created.",
      });


      router.push("/(tabs)/Homescreen"); 


      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRestaurantTimings(null);
      setSelectedImage(null);
      setModalVisible(false); 
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <StatusBar hidden />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* Header Image */}
            <View style={{ height: 250, overflow: "hidden" }}>
              <Image
                source={
                  selectedImage
                    ? { uri: selectedImage }
                    : require("../../assets/images/resturantbg.jpg")
                }
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
              {!selectedImage && (
                <View
                  style={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    right: 20,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    padding: 15,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                    Add Restaurant Image
                  </Text>
                </View>
              )}
            </View>

            {/* Camera Button */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 170,
                right: 10,
                backgroundColor: "#fff",
                borderRadius: 10,
              }}
              onPress={pickImage}
            >
              <Image
                source={require("../../assets/images/cameraicon.png")}
                style={{ width: 50, height: 50 }}
              />
            </TouchableOpacity>

            {/* Form Area */}
            <View
              style={{
                backgroundColor: "#fff",
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                marginTop: -40,
                paddingVertical: 30,
                paddingHorizontal: 20,
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: "bold", color: "#FF4D4D", textAlign: "center" }}>
                Restaurant Signup
              </Text>
              <Text style={{ textAlign: "center", color: "#999", marginTop: 5 }}>
                Complete your restaurant profile
              </Text>

              <TextInput
                placeholder="Restaurant Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <TextInput
                placeholder="Restaurant Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
              <TextInput
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.input}
              />

              <Text style={{ marginBottom: 5 }}>Select Restaurant Timings:</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setModalVisible(true)}
              >
                <Text>{restaurantTimings ? "🕒 Timings Set" : "⏱ Set Timings"}</Text>
              </TouchableOpacity>

              <RestaurantTimingModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={(timings) => {
                  setRestaurantTimings(timings);
                  setModalVisible(false);
                }}
              />

              <TouchableOpacity
                onPress={handleSignup}
                disabled={loading}
                style={[styles.button, loading && { opacity: 0.6 }]}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Next</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#FF4D4D",
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
};
