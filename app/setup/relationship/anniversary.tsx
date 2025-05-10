const cover = require("../../../assets/images/coverimage1.png"); // Adjust the path as needed
import Button from "@/components/Button";
import MyDatePicker from "@/components/MyDateInput";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';


const anniversary = () => {
  const router = useRouter();

  const [dateSelect, setDateSelect] =  useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  
  const showDatePicker = () => {
      setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
      setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
      const formatted = date ? date.toLocaleDateString() : 'Select date'

      console.warn("A date has been picked: ", formatted);
      setDateSelect(date)
      hideDatePicker();
  };

  const handleNext = () => {
    router.replace("/setup/relationship/questions")
    console.log("Continue...")
  }

  useEffect(()=>{

    const isDateValid = dateSelect != null

    setIsFormValid(isDateValid)

  }, [dateSelect])

  return (
    <ScreenWrapper style="flex-1 bg-accent-300">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0} // Adjust if you have a fixed header
        style={{ flex: 1 }}
      >
        <View className="flex-1 px-4 mt-20">

          <Text className="text-start w-full text-3xl mb-8 text-accent font-medium text-accent-100">
            How long have you been together?
          </Text>

          <MyDatePicker
              text="DD/MM/YY"
              headingText = "We've been together since"
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
          />

          <View className="flex-1 justify-end">
            <Button
              text="Next" 
              onPress={handleNext} 
              disabled={!isFormValid} 
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

export default anniversary

const styles = StyleSheet.create({})