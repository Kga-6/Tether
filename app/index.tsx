import { useRouter } from "expo-router";
import { Image, View } from "react-native";

export default function Index() {
  const router = useRouter();
  
  return (
    <View className="flex-1 justify-center items-center bg-primary">
      <Image
        resizeMode="contain"
        source={require("../assets/images/react-logo.png")}
      />
    </View>
  );
}