import { AuthProvider } from "@/contexts/authContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "./globals.css";


const StackLayout = () => {
  return <Stack screenOptions={{headerShown:false}}> </Stack>;
}

export default function RootLayout(){
  return(
    <GestureHandlerRootView >
      <AuthProvider>
        <StackLayout/>
      </AuthProvider>
    </GestureHandlerRootView>
  )
}