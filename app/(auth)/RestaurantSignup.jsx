import React, { useState } from "react";
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
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../../Utils/Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import RestaurantTimingModal from '../../components/Timeselector';

export default function RestaurantSignup({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [restaurantTimings, setRestaurantTimings] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission denied",
        "Permission to access gallery is required!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadToCloudinary = async (imageUri) => {
    const data = new FormData();
    data.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "restaurant.jpg",
    });
    data.append("upload_preset", "YumMapPics");
    data.append("cloud_name", "dudx3of1n");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dudx3of1n/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const file = await response.json();
    return file.secure_url;
  };

  const handleSignup = async () => {
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !restaurantTimings ||
      !selectedImage
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadToCloudinary(selectedImage);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "Restaurantdata", uid), {
        name,
        email,
        phone,
        timings: restaurantTimings,
        imageUrl,
      });

      Alert.alert("Success", "Restaurant registered successfully!");
      navigation.navigate("MainApp");
    } catch (err) {
      console.error(err);
      Alert.alert("Signup Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
    <StatusBar hidden/>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
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

            <TouchableOpacity
              style={{
                position: "absolute",
                top: 170,
                right: 2,
                backgroundColor: "#fff",
                borderRadius: 8,
              }}
              onPress={pickImage}
            >
              <Image
                source={require("../../assets/images/cameraicon.png")}
                style={{ width: 50, height: 50 }}
              />
            </TouchableOpacity>

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
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#FF4D4D",
                  textAlign: "center",
                }}
              >
                Restaurant Signup
              </Text>
              <Text
                style={{ textAlign: "center", color: "#999", marginTop: 5 }}
              >
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

              <Text>Select Opening Time</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setModalVisible(true)}
              >
                <Text>⏱ Set Timings</Text>
              </TouchableOpacity>

              <RestaurantTimingModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={timings => {
                  setRestaurantTimings(timings);
                  setModalVisible(false);
                }}
              />

              <TouchableOpacity
                onPress={handleSignup}
                disabled={loading}
                style={[styles.button, loading && { opacity: 0.7 }]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Next</Text>
                )}
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
