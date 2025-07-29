import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        // @ts-ignore (ignore deprecated warning for now)
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const handleGetStarted = () => {
    router.push({
      pathname: "/tabs/home",
      params: { username: username || "Guest", avatar: avatar || "" },
    });
  };

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
  },
  buttonText: { color: Colors.text, textAlign: "center", fontWeight: "bold" },
});
