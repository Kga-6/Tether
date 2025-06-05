import { AuthProvider } from "@/contexts/authContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  SafeAreaProvider
} from 'react-native-safe-area-context';
import "./globals.css";


const StackLayout = () => {
  return <Stack screenOptions={{headerShown:false}}> </Stack>;
}

export default function RootLayout(){
  return(
    <AuthProvider> 
      <SafeAreaProvider className='flex-1'>
        <GestureHandlerRootView >
          <StackLayout/>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </AuthProvider>
  )
}