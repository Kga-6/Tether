const cover = require("../../../assets/images/coverimage1.png"); // Adjust the path as needed
import Button from "@/components/Button";
import MyBottomSheet from "@/components/MyBottomSheet";
import MyDatePicker from "@/components/MyDateInput";
import MyTextInput from "@/components/MyTextInput";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/contexts/authContext";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';

const today = new Date();
const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
const minDate = new Date(maxDate.getFullYear() - 100, maxDate.getMonth(), maxDate.getDate());

const About = () => {
  const router = useRouter();
  const { user, saveUserData, nextRoute } = useAuth();

  console.log(user)

  const [name, setName] = useState(String) // user?.name?user.name:String
  const [dob, setDob] =  useState<Date | null>(null); // user?.dob?(user.dob.toDate()):null
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [gender, setSelectedGender] = useState<string | null>(null);
  const [isGenderPickerVisible, setGenderPickerrVisibility] = useState(false);

  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  
  const showDatePicker = () => {
    Keyboard.dismiss()
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    Keyboard.dismiss()
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
      const formatted = date ? date.toLocaleDateString() : 'Select date'

      console.warn("A date has been picked: ", formatted);
      setDob(date)
      hideDatePicker();
  };

  const handleNext = async () => {
    if (user?.uid && isFormValid) {
      setIsLoading(true)
      await saveUserData(user.uid, { name, dob, gender });
      setIsLoading(false)

      nextRoute(user.uid, true)
    }
  };

  const handleGenderChange = (value: string) => {
      console.log("User gender: ",value)
      setSelectedGender(value)
  }

  const showGenderSheet = () => {
    Keyboard.dismiss()
    setGenderPickerrVisibility(true)
  }

  const hideGenderSheet = () => {
    Keyboard.dismiss()
    setGenderPickerrVisibility(false)
  }

  const handleNameChange = (value:string) => {
    setName(value)
  }

  useEffect(()=>{

    const isNameValid = name.length > 2 
    const isDateValid = dob != null
    const isGenderValid = gender != null

    setIsFormValid(isDateValid && isNameValid && isGenderValid)

  }, [name, dob, gender])

  return (
    <ScreenWrapper style="flex-1 bg-accent-300">
      <View className="flex-1 px-4 mt-20">

        <Text className="text-start w-full text-3xl mb-8 text-accent font-medium text-accent-100">
          Tell us a little about yourself
        </Text>

        <MyTextInput
          placeholder={"Enter here"}
          headingText = "Your first name"
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

        <MyDatePicker
            text={user?.dob?user.dob: "DD MM YY"}
            headingText = "Your birthday"
            dateStatus={dob}
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

        <MyBottomSheet
            text="Select"
            headingText = "Gender"
            optionText="Choose your gender"
            options={[
                "Male",
                "Female",
            ]}
            currentStatus={gender}
            onChange={handleGenderChange}
            visible={isGenderPickerVisible}
            onShow={showGenderSheet}
            onHide={hideGenderSheet}
            inputWrapperClassName="flex-row justify-between items-center h-[55px] w-full bg-white border-2 border-accent-200 rounded-2xl"
            focusBorderClassName="border-secondary"
            textInputClassName="flex py-0 px-4 text-base text-accent-100" // py-0 because h-[55px] on wrapper

            icon={<MaterialIcons name="navigate-next" size={25} color="#E7E0EE" className="mr-2"/>}
            iconContainerClassName="bg-black"
        />

        <View className="flex-1 justify-end">
          <Button
            text="Next" 
            onPress={handleNext} 
            disabled={!isFormValid} 
            loading={isLoading}
            buttonClassName = "z-[-1]"
            disabledClassName="bg-accent-400 "
          />
        </View>
      </View>
    </ScreenWrapper>
  )
} 

export default About

const styles = StyleSheet.create({})