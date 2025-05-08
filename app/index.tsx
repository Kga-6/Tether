import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, View } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.navigate('/welcome')
    }, 2000)
  }, [])

  return (
    <View className="flex-1 justify-center items-center">
      <Image
        resizeMode="contain"
        source={require("../assets/images/react-logo.png")}
      />
    </View>
  );
}