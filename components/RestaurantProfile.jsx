import { View, Text, Image, ScrollView } from "react-native";

const RestaurantProfile = ({ data }) => {
  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Format time to 12-hour format
  const formatTime = (time) => {
    if (!time || time.toLowerCase() === "closed") return "Closed";
    let cleanTime = time.replace(":", "").padStart(4, "0");
    let hour = parseInt(cleanTime.slice(0, 2), 10);
    let minute = cleanTime.slice(2, 4);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  // Remove Google Plus Code from address
  const getCleanAddress = (address) => {
    if (!address) return "No address provided";
    return address.replace(/^[A-Z0-9+]+\s/, ""); // Removes plus code at start
  };

  // Sort timings by day order
  const sortedTimings = dayOrder.map((day) => ({
    day,
    from: data?.timings?.[day]?.from || "Closed",
    to: data?.timings?.[day]?.to || "Closed",
  }));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Background Image */}
      <View style={{ overflow: "hidden" }}>
        <Image
          source={
            data?.imageUrl
              ? { uri: data.imageUrl }
              : require("../assets/images/resbg.png")
          }
          resizeMode="cover"
          style={{ height: 250, width: "100%" }}
        />
      </View>

      {/* White Container */}
      <View
        style={{
          backgroundColor: "#fff",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          marginTop: -1,
          alignItems: "center",
        }}
      >
        {/* Name + Rating */}
        <View
          style={{
            paddingVertical: 20,
            paddingHorizontal: 20,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 36,
              color: "#000",
              marginTop: 20,
              fontWeight: "bold",
            }}
          >
            {data?.name}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#000",
              marginTop: 20,
              fontWeight: "bold",
            }}
          >
            ⭐ 4.5
          </Text>
        </View>

        {/* Phone */}
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#eae8e84f",
            width: "100%",
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                color: "#000",
                fontWeight: "bold",
                marginBottom: 5,
              }}
            >
              Phone
            </Text>
            <Text style={{ fontSize: 14, color: "#000", fontWeight: "500" }}>
              {data?.phone || "N/A"}
            </Text>
          </View>
          <Text style={{ fontSize: 18, color: "#000", marginLeft: 10 }}>📞</Text>
        </View>

        {/* Email */}
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#eae8e84f",
            width: "100%",
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                color: "#000",
                fontWeight: "bold",
                marginBottom: 5,
              }}
            >
              Email
            </Text>
            <Text style={{ fontSize: 14, color: "#000", fontWeight: "500" }}>
              {data?.email || "N/A"}
            </Text>
          </View>
          <Text style={{ fontSize: 18, color: "#000", marginLeft: 10 }}>📧</Text>
        </View>

        {/* Address */}
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#eae8e84f",
            width: "100%",
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                color: "#000",
                fontWeight: "bold",
                marginBottom: 5,
              }}
            >
              Address
            </Text>
            <Text style={{ fontSize: 14, color: "#000", fontWeight: "500" }}>
              {getCleanAddress(data?.location?.address)}
            </Text>
          </View>
          <Text style={{ fontSize: 18, color: "#000", marginLeft: 10 }}>📍</Text>
        </View>

        {/* Hours */}
        <View
          style={{
            paddingTop: 20,
            paddingHorizontal: 20,
            backgroundColor: "#eae8e84f",
            width: "100%",
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
          }}
        >
          {sortedTimings.length > 0 ? (
            sortedTimings.map((time, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{time.day}</Text>
                <Text>
                  {time.from === "Closed" && time.to === "Closed"
                    ? "Closed"
                    : `${formatTime(time.from)} - ${formatTime(time.to)}`}
                </Text>
              </View>
            ))
          ) : (
            <Text>No timing available</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default RestaurantProfile;
