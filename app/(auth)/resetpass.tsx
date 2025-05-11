import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import { auth } from "@/config/firebase"; // Adjust the path as needed
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

const Resetpass = () => {
  const router = useRouter();
 
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const {register} = useAuth();

  // --- Validation Functions ---
  const validateEmail = (text: string, isSubmitting = false) => {
    if (!text && isSubmitting) { // Only show "required" error if trying to submit or field was touched and left empty
      setEmailError("Email is required");
      return false;
    }
    if (text && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      setEmailError("Enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  useEffect(() => {
    const isEmailFilledAndValid = email.length > 0 && validateEmail(email); // Check current email validity silently
    setIsFormValid(isEmailFilledAndValid);
  }, [email, emailError]); // Dependencies

  const handleSignup = async () => {
    const isEmailActuallyValid = validateEmail(email, true);

    if (isEmailActuallyValid && isFormValid) { // Double check with isFormValid
      
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Password Reset", "A password reset email has been sent.");
      router.push("/(auth)/login");

    } else {
      console.log("Validation failed on submit or form not fully valid.");
      // Errors will be displayed by the Input components
    }
  };

  return (
    <ScreenWrapper style="flex-1 bg-accent-300">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0} // Adjust if you have a fixed header
        style={{ flex: 1 }}
      >
      <View className="flex-1">

          <BackButton
            onPress={() => router.canGoBack() ? router.back() : router.push("/(auth)/welcome")}
          />

          <View className="flex-1 justify-start px-4 mt-4">

            <View className="mb-8 ">
              <Text className="text-start w-full text-3xl mb-2 text-accent-100 font-medium">
                Reset password
              </Text>
              <Text className="text-accent-100 font-light text-lg ">
                We’ll send you an email with instructions to reset your password
              </Text>
            </View>

            <View>
              <Input
                // label="Email Address"
                placeholder="Your email"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) validateEmail(text); // Re-validate on change if error was shown
                }}
                onBlur={() => validateEmail(email)} // Validate on blur
                keyboardType="email-address"
                autoCapitalize="none"
                // Pass your themed classes for the input wrapper
                // The Input component now has defaults, but you can override parts like border color
                inputWrapperClassName="h-[55px] w-full bg-white border-2 border-accent-200 rounded-2xl"
                focusBorderClassName="border-secondary"
                
                // Classes for the text typed into the input
                textInputClassName="flex-1 py-0 px-4 text-base text-accent-100" // py-0 because h-[55px] on wrapper
                customPlaceholderTextColor={"#BAAFCF"}
                error={emailError}

                //icon={<Feather name="mail" size={20} color="#9CA3AF" className="mr-2"/>}
                //iconContainerClassName="absolute right-0 top-0 h-full flex justify-center items-center px-3"
              />
            </View>

          </View>

          <View className="flex-1 justify-end items-center px-4" >

            <Button
              text="Next" 
              onPress={handleSignup} 
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

export default Resetpass

const styles = StyleSheet.create({})