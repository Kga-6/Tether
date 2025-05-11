const cover = require("../../../assets/images/coverimage1.png"); // Adjust the path as needed
import Button from "@/components/Button";
import MyDatePicker from "@/components/MyDateInput";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

const today = new Date();
const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const minDate = new Date(maxDate.getFullYear() - 100, maxDate.getMonth(), maxDate.getDate());

const anniversary = () => {
  const router = useRouter();
  const { user, saveUserData, nextRoute } = useAuth();

  const [anniversary_date, setDateSelect] =  useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  
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

  const handleNext = async () => {

    if (!user?.uid) return;

    setIsLoading(true);
    const existing = user.partner_base ?? {};
    const updated = { 
      ...existing, 
      anniversary_date    // overwrite just this one field 
    };
    
    await saveUserData(user.uid, { partner_base: updated });
    setIsLoading(false);
    
    nextRoute(user.uid, true)
  }

  useEffect(()=>{

    const isDateValid = anniversary_date != null

    setIsFormValid(isDateValid)

  }, [anniversary_date])

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
              dateStatus={anniversary_date}
              maxDate={maxDate}
              minDate={minDate}
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

export default anniversary

const styles = StyleSheet.create({})