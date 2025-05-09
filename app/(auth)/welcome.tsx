import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import SlideShow from "@/components/SlideShow";
import { useRouter } from "expo-router";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const Welcome = () => {
  const router = useRouter();


  return (
    <ScreenWrapper style="flex-1 bg-primary">
        <View className="flex-1 bg-primary">
        
          {/* <View className="flex justify-end items-end p-4" >
            <TouchableOpacity className="bg-[#F9F4FB] border-2 border-[#E7E0EE] rounded-full px-8 py-2">
              <Text className="text-secondary text-lg">Log in</Text>
            </TouchableOpacity>
          </View> */}
          <View className="flex justify-end items-end p-4" >
            <TouchableOpacity onPress={()=> router.push("/(auth)/login")} className="bg-[#F9F4FB] border-2 border-[#E7E0EE] rounded-full h-[48px] px-8 justify-center items-center">
                <Text className="text-secondary text-lg">Log in</Text>
            </TouchableOpacity>
          </View>

          <SlideShow/>

          <View className="flex justify-start items-center px-4" >
            <Button
              text="Sign up with email"
              onPress={()=> router.push("/(auth)/signup")}
              buttonClassName="w-[100%] h-[55px] justify-center items-center rounded-full bg-secondary" 
              textClassName="text-white text-lg font-light"
              disabledClassName="bg-accent-400"
            />

            <Text className="text-black text-center px-4 mt-4 text-sm font-light">
              By continuing, you agree to our <Text className="underline">Term of Service</Text> and <Text className="underline">Privacy Policy</Text>.
            </Text>
          </View>

        </View>
      </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({})