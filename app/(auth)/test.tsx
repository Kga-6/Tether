import MyButton from "@/components/Button";
import MyBottomSheet from "@/components/MyBottomSheet";
import MyDatePicker from "@/components/MyDateInput";
import MyTextInput from "@/components/MyTextInput";
import ScreenWrapper from "@/components/ScreenWrapper";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';

const test = () => {

    const [dateSelect, setDateSelect] =  useState<Date | null>(null);

    const dismissKeyboard = () => {
        Keyboard.dismiss(); // This tells the keyboard to go away, unfocusing the input
    };

    // Questions Fun
    const [optionSelected, setOptionselected] = useState<string | null>(null);

    const onSelected = (value: string) => {
        setOptionselected(value);
    };

    // Date Selector
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        console.log("sad")
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

    // Gender Selector
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [isGenderPickerVisible, setGenderPickerrVisibility] = useState(false);

    const handleGenderChange = (value: string) => {
        console.log("User gender: ",value)
        setSelectedGender(value)
    }

    const showGenderSheet = () => {
        setGenderPickerrVisibility(true)
    }

    const hideGenderSheet = () => {
        setGenderPickerrVisibility(false)
    }

  return (
    <ScreenWrapper style="flex-1 bg-accent-300">
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0} // Adjust if you have a fixed header
            style={{ flex: 1 }}
        >
            <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
                <View className="flex-1 px-4 mt-4">
                
                    <MyTextInput
                        placeholder="Enter Here"
                        headingText = "Your first name"
                        onChangeText={() => {}}
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
                        text="DD/MM/YY"
                        headingText = "Your birthday"
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

                    <MyBottomSheet
                        text="Select"
                        headingText = "Gender"
                        optionText="Choose your gender"
                        options={[
                            "Male",
                            "Female",
                        ]}
                        currentStatus={selectedGender}
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

                    {/* <MyQuestion
                        question={"Do any of you have kids?"}
                        options={[
                            "In a relationship",
                            "Engaged",
                            "Married"
                        ]}
                        onSelected={onSelected}
                        optionSelected={optionSelected}
                    /> */}
                    
                    <View className="flex-1 justify-end items-center" >
                        <MyButton
                            text="Next"
                            onPress={() => console.log("Selected:", optionSelected)}
                            disabled={!optionSelected}
                            buttonClassName="w-full h-[55px] justify-center items-center rounded-full bg-secondary"
                            textClassName="text-white text-lg font-light"
                            disabledClassName="bg-accent-400"
                        />
                    </View>
                    


                </View>
            </Pressable>
            
        </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

export default test

const styles = StyleSheet.create({})