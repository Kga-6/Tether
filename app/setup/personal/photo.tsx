const defaultprofile = require("../../../assets/images/defaultprofile.jpg");
import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/contexts/authContext";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Photo = () => {
  const router = useRouter();

  const {user, uploadProfilePhoto, nextRoute, saveUserData } = useAuth();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false)

  const handlePhotoAdd = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

   const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!pickerResult.canceled) {
      setPhoto(pickerResult.assets[0].uri);
    }
  };

  const handleNext = async () => {
    console.log(user?.uid && photo)
    if (user?.uid && photo) {
      setIsLoading(true)
      await uploadProfilePhoto(user.uid, photo);
      setIsLoading(false)
      
      nextRoute(user.uid, true, true)
    }
  };

  const handleProfilePictureSkip = async () => {
    if (user?.uid) {
      setIsLoading(true)
      await saveUserData(user.uid, { image_set_skipped: true });
      setIsLoading(false)
      
      nextRoute(user.uid, true, true)
    }
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
            <TouchableOpacity onPress={handleProfilePictureSkip} >
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
              source={photo ? { uri: photo } : defaultprofile}
              resizeMode="cover"
              className="rounded-full bg-black border-[12px] border-primary border=primary w-[50%] h-[50%]"
            />
          </View>

          

          <View className="flex-1 justify-end">
           
            {!photo ? 
               <Button
                text="Add photo" 
                onPress={handlePhotoAdd} 
                disabled={false} 
                disabledClassName="bg-accent-400"
              /> :
               <Button
                text="Next" 
                loading={isLoading}
                onPress={handleNext} 
                disabled={false} 
                disabledClassName="bg-accent-400"
              />
            }
          </View>

        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
} 

export default Photo

const styles = StyleSheet.create({})