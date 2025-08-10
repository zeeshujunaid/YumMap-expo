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
import UserProfile from "../../components/UserProfile"; 

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




