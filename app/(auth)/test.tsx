import Button from "@/components/Button";
import MyQuestion from "@/components/MyQuestion";
import ScreenWrapper from "@/components/ScreenWrapper";
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';


import MyDatePicker from '@/components/MyDateInput';
import MyTextInput from "@/components/MyTextInput";

const test = () => {

    const [dob, setDob] = useState(null)
    const [optionSelected, setOptionselected] = useState<string | null>(null);

    const onSelected = (value: string) => {
    setOptionselected(value);
    };
  return (
    <ScreenWrapper style="flex-1 bg-accent-300">
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0} // Adjust if you have a fixed header
            style={{ flex: 1 }}
        >
            <View className="flex-1 justify-start px-4 mt-4">
                
                <MyTextInput
                    placeholder="Enter Here"
                    headingText = "Partners name"
                    onChangeText={() => {}}
                    onBlur={() => {}} // Validate on blur
                    keyboardType="email-address"
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
                    headingText = "Your Birthday"
                    date={dob}
                    onDateChange={setDob}
                    autoCapitalize="none"
                    // Pass your themed classes for the input wrapper
                    // The Input component now has defaults, but you can override parts like border color
                    inputWrapperClassName="justify-center items-center h-[55px] w-full bg-white border-2 border-accent-200 rounded-2xl"
                    focusBorderClassName="border-secondary"
                    
                    // Classes for the text typed into the input
                    textInputClassName="flex w-full py-0 px-4 text-base text-accent-400" // py-0 because h-[55px] on wrapper

                    //icon={<Feather name="mail" size={20} color="#9CA3AF" className="mr-2"/>}
                    //iconContainerClassName="absolute right-0 top-0 h-full flex justify-center items-center px-3"
                />

                <MyQuestion
                    question={"Do any of you have kids?"}
                    options={[
                        "In a relationship",
                        "Engaged",
                        "Married"
                    ]}
                    onSelected={onSelected}
                    optionSelected={optionSelected}
                />

                <Button
                    text="Next"
                    onPress={() => console.log("Selected:", optionSelected)}
                    disabled={!optionSelected}
                    buttonClassName="w-full h-[55px] justify-center items-center rounded-full bg-secondary"
                    textClassName="text-white text-lg font-light"
                    disabledClassName="bg-accent-400"
                />


            </View>
        </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

export default test

const styles = StyleSheet.create({})