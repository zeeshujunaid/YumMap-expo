import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import { auth, db } from "../../Utils/Firebase"; // Make sure this points to your Firebase config
import { doc, getDoc } from "firebase/firestore";
import RestaurantProfile from "../../components/RestaurantProfile"; 

export default function Profilescreen() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // fetching user or restaurant profile based on role
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setRole(data.role); // Save role
            setUserData(data);
            console.log("User data fetched:", data);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, []);


  if (loading) return <ActivityIndicator size="large" color="red" />;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      {role === "user" && <UserProfile data={userData} />}
      {role === "Restaurant" && <RestaurantProfile data={userData} />}
    </View>
  );
}

const UserProfile = () => (
  <View style={{ flex: 1, backgroundColor: "#fff" }}>
    <View style={{ overflow: "hidden" }}>
      <Image
        source={require("../../assets/images/resbg.png")}
        resizeMode="cover"
        style={{ height: 200, width: "100%" }}
      />
    </View>

    <View
      style={{
        backgroundColor: "#fff",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        marginTop: -40,
        alignItems: "center",
      }}
    >
      <View style={{ marginTop: -55 }}>
        <Image
          source={require("../../assets/images/profileicon.png")}
          style={{
            height: 150,
            width: 150,
            borderRadius: 75,
          }}
        />
      </View>

      <TouchableOpacity
        // onPress={handleImagePick}
        style={{
          backgroundColor: "#fff",
          height: 40,
          width: 40,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 20,
          position: "absolute",
          top: 55,
          right: 120,
        }}
      >
        <Image
          source={require("../../assets/images/cameraicon.png")}
          style={{ height: 40, width: 40 }}
        />
      </TouchableOpacity>

      <View
        style={{ paddingVertical: 20, paddingHorizontal: 20, width: "100%" }}
      >
        <Text style={{ fontSize: 16, color: "#000", marginTop: 20 }}>
          Full Name
        </Text>
        <TextInput
          placeholder="John"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 12,
            fontSize: 16,
            width: "100%",
            marginTop: 10,
          }}
        />

        <Text style={{ fontSize: 16, color: "#000", marginTop: 20 }}>
          Enter Your Phone Number
        </Text>
        <TextInput
          placeholder="+1234567890"
          keyboardType="phone-pad"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 12,
            fontSize: 16,
            width: "100%",
            marginTop: 10,
          }}
        />
      </View>

      <View style={{ width: "100%", paddingHorizontal: 20, marginTop: 20 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            backgroundColor: "#FF4D4D",
            borderRadius: 12,
            paddingVertical: 15,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
          }}
        ></TouchableOpacity>
      </View>
    </View>
  </View>
);



