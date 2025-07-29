import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/colors";

export default function HomeScreen() {
  const { username, avatar } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.header}>
        <Image
          source={
            avatar
              ? { uri: avatar as string }
              : require("../../assets/images/default-avatar.png")
          }
          style={styles.avatar}
        />
        <Text style={styles.greeting}>Hello, {username || "Guest"}!</Text>
      </View>

      {/* Main Content */}
      <View style={styles.body}>
        <Text style={styles.welcomeText}>Welcome to your dashboard 👋</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1", // Light background for body
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background, // Header uses palette background
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: Colors.text,
  },
});
