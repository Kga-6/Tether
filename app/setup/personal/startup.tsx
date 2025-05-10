const cover = require("../../../assets/images/coverimage1.png"); // Adjust the path as needed
import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import Section from "@/components/Section";
import { useRouter } from "expo-router";
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

const Startup = () => {
  const router = useRouter();

  const handleNext = () => {
    router.replace("/setup/personal/about")
    console.log("Continue...")
  }

  return (
    <ScreenWrapper style="flex-1 bg-primary">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0} // Adjust if you have a fixed header
        style={{ flex: 1 }}
      >
        <View className="flex-1 px-4 mt-4">
          <Section
            header="Welcome to Tether"
            subheading="To personalize your experience, we'll ask you a few questions"
            image={cover}
            
          />

          <Button
            text="Continue" 
            onPress={handleNext} 
            disabled={false} 
            buttonClassName="w-[100%] h-[55px] justify-center items-center rounded-full" 
            textClassName="text-white text-lg font-light"
            disabledClassName="bg-accent-400"
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
} 

export default Startup

const styles = StyleSheet.create({})