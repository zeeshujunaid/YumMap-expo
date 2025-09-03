import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "expo-router";

const UserProfile = ({ data, favoriteRestaurants = [], onLogout }) => {
  const router = useRouter();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        if (onLogout) onLogout();
        router.push('Login')
      })
      .catch((error) => {
        console.error("Logout Error:", error);
      });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Background Banner */}
      <View style={{ overflow: "hidden" }}>
        <Image
          source={require("../assets/images/resbg.png")}
          resizeMode="cover"
          style={{ height: 200, width: "100%" }}
        />
      </View>

      {/* Profile Card */}
      <View
        style={{
          backgroundColor: "#fff",
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          marginTop: -40,
          alignItems: "center",
          paddingBottom: 20,
        }}
      >
        {/* Profile Image */}
        <View style={{ marginTop: -55 }}>
          <Image
            source={
              data?.ProfileImage
                ? { uri: data.ProfileImage }
                : require("../assets/images/profileicon.png")
            }
            style={{
              height: 150,
              width: 150,
              borderRadius: 75,
              borderWidth: 3,
              borderColor: "#fff",
            }}
          />
        </View>

        {/* User Info */}
        <View
          style={{
            padding: 20,
            width: "90%",
            backgroundColor: "#f9f9f9",
            borderRadius: 15,
            marginTop: 15,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 14, color: "#888" }}>Full Name</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>
            {data?.name || "User Name Not Found"}
          </Text>

          <View style={{ height: 10 }} />

          <Text style={{ fontSize: 14, color: "#888" }}>Phone Number</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>
            {data?.phone || "Phone Number Not Found"}
          </Text>
        </View>

        {/* Favorite Restaurants Section */}
        <View style={{ marginTop: 25, width: "90%" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#000" }}>
            ⭐ Favorite Restaurants
          </Text>

          {favoriteRestaurants.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 15 }}
            >
              {favoriteRestaurants.map((restaurant, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 15,
                    marginRight: 15,
                    elevation: 3,
                    width: 150,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={{ uri: restaurant.image }}
                    style={{ width: "100%", height: 100 }}
                    resizeMode="cover"
                  />
                  <View style={{ padding: 10 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "#000",
                      }}
                      numberOfLines={1}
                    >
                      {restaurant.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#666" }}>
                      {restaurant.location}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={{ color: "#888", marginTop: 10 }}>
              No favorite restaurants added yet.
            </Text>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: "#ff4d4d",
            paddingVertical: 12,
            paddingHorizontal: 30,
            borderRadius: 25,
            marginTop: 30,
            elevation: 2,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            🚪 Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UserProfile;
