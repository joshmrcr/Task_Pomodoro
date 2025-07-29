import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../constants/colors";

export default function WelcomeScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user data already exists
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem("username");
        const savedAvatar = await AsyncStorage.getItem("avatar");
        if (savedUsername) {
          // Skip welcome if data exists
          router.replace({
            pathname: "/tabs/home",
            params: { username: savedUsername, avatar: savedAvatar || "" },
          });
        }
      } catch (e) {
        console.error("Error loading user data", e);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setAvatar(`data:image/jpeg;base64,${result.assets[0].base64}`);
      } else if (result.canceled) {
        Alert.alert("No Image Selected", "You did not select any image.");
      }
    } catch (err) {
      console.error("Image Picker Error: ", err);
      Alert.alert("Error", "Something went wrong while picking the image.");
    }
  };

  const handleGetStarted = async () => {
    if (!username.trim())
      return Alert.alert("Error", "Please enter a username");
    try {
      await AsyncStorage.setItem("username", username);
      if (avatar) await AsyncStorage.setItem("avatar", avatar);
      router.push({
        pathname: "/tabs/home",
        params: { username, avatar: avatar || "" },
      });
    } catch (e) {
      console.error("Error saving user data", e);
    }
  };

  const resetData = async () => {
    await AsyncStorage.clear();
    Alert.alert("Data Reset", "All data has been cleared.");
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>

      <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
        <Image
          source={
            avatar
              ? { uri: avatar }
              : require("../assets/images/default-avatar.png")
          }
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.iconOverlay}>
          <Ionicons name="camera" size={24} color="#fff" />
        </View>
      </TouchableOpacity>
      <Text style={styles.changePhoto}>Change Avatar</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
      />

      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      {/* Reset data button for testing */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "red" }]}
        onPress={resetData}
      >
        <Text style={styles.buttonText}>Reset Data</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.white,
  },
  avatarWrapper: {
    position: "relative",
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.accent,
  },
  iconOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  changePhoto: {
    color: Colors.primary,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.white,
    width: "100%",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { color: Colors.text, textAlign: "center", fontWeight: "bold" },
});
