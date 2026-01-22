import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function HomePage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleContinue = async () => {
    if (!name.trim()) return;
     Keyboard.dismiss(); 
    await AsyncStorage.setItem("playerName", name);
    router.push("/MarioSelePage");
  };

  return (
    <ImageBackground 
    source={require('../assets/images/maroi2.jpg')}
    style={styles.container}>
      {/* <Image
        source={require("../assets/images/Super-Mario.png")}
        style={styles.mario}
      /> */}

      <Text style={styles.title}>Mario World 🍄</Text>
      <Text style={styles.subtitle}>Enter your player name</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Player Name"
        placeholderTextColor="#aaa"
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.button, !name && { opacity: 0.5 }]}
        onPress={handleContinue}
        disabled={!name}
      >
        <Text style={styles.buttonText}>Continue ▶</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a0def1",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  mario: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
  },

  title: {
  fontSize: 34,
  fontWeight: "900",
  color: "#ffffff",
  marginBottom: 10,
  textAlign: "center",

  // Shadow effect
  textShadowColor: "rgba(0,0,0,0.8)",
  textShadowOffset: { width: 3, height: 3 },
  textShadowRadius: 5,

  // Small outline illusion
  letterSpacing: 1,
},

  subtitle: {
  fontSize: 18,
  color: "#ffffff",
  marginBottom: 20,

  textShadowColor: "rgba(0,0,0,0.6)",
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 4,
},

  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#c51624",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    elevation: 5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

