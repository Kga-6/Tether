const defaultprofile = require("../../../assets/images/defaultprofile.jpg");
import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const Photo = () => {
  const router = useRouter();

  const [photo, setPhoto] = useState()

  const handlePhotoAdd = () => {
   
    console.log("Adding Photo...")
  }

  return (
    <ScreenWrapper style="flex-1 bg-accent-300">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0} // Adjust if you have a fixed header
        style={{ flex: 1 }}
      >
        <View className="flex-1 px-4 mt-14">

          <View className="w-full h-[55px] justify-start items-end">
            <TouchableOpacity onPress={()=>{router.replace("/setup/relationship/startup")}} >
              <Text className="text-secondary text-center underline text-lg font-light">Skip</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-8 ">
            <Text className="text-start w-full text-3xl mb-2 text-accent-100 font-medium">
                Add a profile photo
            </Text>
            <Text className="text-accent-100 font-light text-lg ">
                Your partner will see this as your photo in Tether
            </Text>
          </View>

          <View className="flex justify-center items-center">
            <Image
              source={defaultprofile}
              resizeMode="cover"
              className="rounded-full bg-black border-[12px] border-primary border=primary w-[50%] h-[50%]"
            />
          </View>

          <View className="flex-1 justify-end">
            <Button
              text="Add photo" 
              onPress={handlePhotoAdd} 
              disabled={false} 
              buttonClassName="w-[100%] h-[55px] justify-center items-center rounded-full" 
              textClassName="text-white text-lg font-light"
              disabledClassName="bg-accent-400"
            />
          </View>

        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
} 

export default Photo

const styles = StyleSheet.create({})