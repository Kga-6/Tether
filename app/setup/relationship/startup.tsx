const cover = require("../../../assets/images/coverimage2.png"); // Adjust the path as needed
import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import Section from "@/components/Section";
import { useAuth } from "@/contexts/authContext";
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

const Startup = () => {
  const { user, nextRoute } = useAuth();

  const handleNext = () => {
    if (user?.uid) {
      nextRoute(user.uid,true)
    }
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
            header="Get ready to explore your relationship"
            subheading="We’ll ask a few details about your relationship to provide you with relevant couple conversations"
            image={cover}
            
          />

          <Button
            text="Continue" 
            onPress={handleNext} 
            disabled={false} 
            disabledClassName="bg-accent-400"
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
} 

export default Startup

const styles = StyleSheet.create({})