import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/HomePage");
    }, 2500);
  }, []);

  return (
    <ImageBackground
      source={require("../assets/images/splashh.png")}
      style={styles.container}
      resizeMode="cover"
    >

    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    // Shadow for visibility
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,

    letterSpacing: 1,
  },
});
