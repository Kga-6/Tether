import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import SignupForm from "@/components/SignupForm";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View, } from 'react-native';

const Login = () => {
  const router = useRouter();
   
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false)

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const {login: loginUser} = useAuth()

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

  const validatePassword = (text: string, isSubmitting = false) => {
    if (!text && isSubmitting) {
      setPasswordError("Password is required.");
      return false;
    }

    if (!text || text.length < 6 || !/\d/.test(text) || !/[A-Z]/.test(text)) {
      setPasswordError(
        "Your password must be at least 6 characters long and include at least one uppercase letter and one number."
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  // --- Effect to check form validity whenever inputs or errors change ---
  useEffect(() => {
    // Form is valid if both email and password are not empty,
    // and there are no current validation errors for them.
    const isEmailFilledAndValid = email.length > 0 && validateEmail(email); // Check current email validity silently
    const isPasswordFilledAndValid = password.length > 0 && validatePassword(password); // Check current password validity silently

    setIsFormValid(isEmailFilledAndValid && isPasswordFilledAndValid);

  }, [email, password, emailError, passwordError]); // Dependencies

  const handleSignup = async () => {
    // Re-validate with isSubmitting = true to show "required" messages if fields are empty
    const isEmailActuallyValid = validateEmail(email, true);
    const isPasswordActuallyValid = validatePassword(password, true);

    if (isEmailActuallyValid && isPasswordActuallyValid && isFormValid) { // Double check with isFormValid
      // console.log("Email:", email);
      // console.log("Password:", password);
      // Alert.alert("Signup Successful", "Account created (simulated).");
      // router.push("/welcome");
      setIsLoading(true)
      const res = await loginUser(email,password)
      setIsLoading(false)
      if(!res.success){
        Alert.alert("Login", res.msg)
      }
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
                Login in to Tether
              </Text>
              <Text className="text-accent-100 font-light text-lg ">
                Enter your existing account details below
              </Text>
            </View>

            <SignupForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              validateEmail={validateEmail}
              validatePassword={validatePassword}
              emailError={emailError}
              passwordError={passwordError}
            />
            
            <View className="w-full h-[55px] justify-center items-center ">
              <Text className="w-full text-secondary text-center underline text-lg">Forgot password?</Text>
            </View>
  
            
            <Button
              text="Log in" 
              onPress={handleSignup} 
              loading={isLoading}
              disabled={!isFormValid} 
              buttonClassName="w-[100%] h-[55px] justify-center items-center rounded-full" 
              textClassName="text-white text-lg font-light"
              disabledClassName="bg-accent-400"
            />

            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-accent-200 " />
                <Text className="mx-4 text-sm text-black ">
                  or
                </Text>
              <View className="flex-1 h-px bg-accent-200" /> 
            </View>

            <View className="w-full h-[55px] justify-center items-center ">
              <Pressable onPress={()=> router.navigate("/(auth)/signup")}>
                <Text className="w-full text-accent-100 text-center text-lg">
                  Want to join Tether? <Text className="underline text-secondary font-medium">Sign up</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

export default Login

const styles = StyleSheet.create({})