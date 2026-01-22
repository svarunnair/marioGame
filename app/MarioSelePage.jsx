import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const marioCharacters = [
  { id: "classic", name: "Classic Mario", image: "blue" },
  { id: "fire", name: "Fire Mario", image: "red" },
  { id: "ice", name: "Ice Mario", image: "yellow" },
  { id: "shadow", name: "Shadow Mario", image: "violet"},
];

export default function MarioSelePage() {
  const [selectedMario, setSelectedMario] = useState(null);
  const router = useRouter();

  const handleContinue = async () => {
    if (!selectedMario) return;
    await AsyncStorage.setItem("marioModal", selectedMario);
    router.push("/game");
  };

  return (
     <ImageBackground 
        source={require('../assets/images/mario3d.jpg')} style={styles.container}>


            <View style={{flex:1,alignItems:'center',paddingTop:40}}>

                    <Text style={styles.title}>Choose Your Mario 🍄</Text>

      <View style={styles.grid}>
        {marioCharacters.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              selectedMario === item.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedMario(item.id)}
          >
            {/* <Image source={item.image} style={styles.marioImg} /> */}
            <View style={{ height: 100,width:100,borderWidth:2 ,backgroundColor:item.image,borderRadius:10}}>

            </View>


            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.continueBtn,
          !selectedMario && { opacity: 0.5 },
        ]}
        disabled={!selectedMario}
        onPress={handleContinue}
      >
        <Text style={styles.continueText}>Continue ▶</Text>
      </TouchableOpacity>

            </View>
  
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4ec0ca",
    alignItems: "center",
    paddingTop: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: 20,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
  },

  card: {
    width: "42%",
    // backgroundColor: "#fff",
    borderRadius: 12,
    // borderWidth: 3,
    borderColor: "#2ecc71",
    alignItems: "center",
    padding: 10,
    marginBottom: 15,
  },

  selectedCard: {
    borderColor: "#e74c3c",
    backgroundColor: "#ffe6e6",
    transform: [{ scale: 1.05 }],
  },

  marioImg: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },

  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffff",
    marginTop: 6,
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,

    letterSpacing: 1,
  },

  continueBtn: {
    marginTop: 20,
    backgroundColor: "#c43221",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#c0392b",
  },

  continueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,

    letterSpacing: 1,
  },
});
