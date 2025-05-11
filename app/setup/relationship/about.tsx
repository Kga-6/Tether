const cover = require("../../../assets/images/coverimage1.png"); // Adjust the path as needed
import Button from "@/components/Button";
import MyTextInput from "@/components/MyTextInput";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

const About = () => {
  const router = useRouter();
  const { user, saveUserData, nextRoute } = useAuth();

  const [partner_name, setName] = useState(String)
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false)


  const handleNext = async () => {

    if (!user?.uid) return;

    setIsLoading(true);
    const existing = user.partner_base ?? {};
    const updated = { 
      ...existing, 
      partner_name    // overwrite just this one field 
    };
    
    await saveUserData(user.uid, { partner_base: updated });
    setIsLoading(false);

    nextRoute(user.uid, true)
  }

  const handleNameChange = (value:string) => {
    console.log(value)
    setName(value)
  }

  useEffect(()=>{

    const isNameValid = partner_name.length > 0

    setIsFormValid(isNameValid)

  }, [partner_name])

  return (
    <ScreenWrapper style="flex-1 bg-accent-300">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0} // Adjust if you have a fixed header
        style={{ flex: 1 }}
      >
        <View className="flex-1 px-4 mt-20">

          <Text className="text-start w-full text-3xl mb-8 text-accent font-medium text-accent-100">
            Tell us a little about your partner
          </Text>

          <MyTextInput
            placeholder="Enter Here"
            headingText = "Partners name"
            onChangeText={handleNameChange}
            onBlur={() => {}} // Validate on blur
            autoCapitalize="none"
            // Pass your themed classes for the input wrapper
            // The Input component now has defaults, but you can override parts like border color
            inputWrapperClassName="h-[55px] w-full bg-white border-2 border-accent-200 rounded-2xl"
            focusBorderClassName="border-secondary"
            
            // Classes for the text typed into the input
            textInputClassName="flex-1 py-0 px-4 text-base text-accent-100" // py-0 because h-[55px] on wrapper
            customPlaceholderTextColor={"#BAAFCF"}

            //icon={<Feather name="mail" size={20} color="#9CA3AF" className="mr-2"/>}
            //iconContainerClassName="absolute right-0 top-0 h-full flex justify-center items-center px-3"
          />

          {/* <MyDatePicker
              text="DD/MM/YY"
              headingText = "Been yogether since"
              dateStatus={dateSelect}
              visible={isDatePickerVisible}
              onConfirm={handleConfirm}
              onShow={showDatePicker}
              onHide={hideDatePicker}
              autoCapitalize="none"
              // Pass your themed classes for the input wrapper
              // The Input component now has defaults, but you can override parts like border color
              inputWrapperClassName="justify-center items-center h-[55px] w-full bg-white border-2 border-accent-200 rounded-2xl"
              focusBorderClassName="border-secondary"
              
              // Classes for the text typed into the input
              textInputClassName="flex w-full py-0 px-4 text-base text-accent-100" // py-0 because h-[55px] on wrapper

              //icon={<Feather name="mail" size={20} color="#9CA3AF" className="mr-2"/>}
              //iconContainerClassName="absolute right-0 top-0 h-full flex justify-center items-center px-3"
          /> */}

          <View className="flex-1 justify-end">
            <Button
              text="Next" 
              onPress={handleNext} 
              loading={isLoading}
              disabled={!isFormValid} 
              disabledClassName="bg-accent-400"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
} 

export default About

const styles = StyleSheet.create({})