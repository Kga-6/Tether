import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import SignupForm from "@/components/SignupForm";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

const Signup = () => {
  const router = useRouter();
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

   const [isLoading, setIsLoading] = useState(false)

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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
      setIsLoading(true)
      const res = await register(email, password)
      setIsLoading(false)
      console.log("Register result: ", res)
      if(!res.success){
        Alert.alert("Sign up",res.msg);
      }
      // console.log("Email:", email);
      // console.log("Password:", password);
      // Alert.alert("Signup Successful", "Account created (simulated).");
      // router.push("/welcome");
    } else {
      console.log("Validation failed on submit or form not fully valid.");
      // Errors will be displayed by the Input components
    }
  };

  return (
    <ScreenWrapper style="flex-1 bg-accent-300">
      <View className="flex-1">

        <BackButton
          onPress={() => router.canGoBack() ? router.back() : router.push("/(auth)/welcome")}
        />

        <View className="flex-1 justify-start px-4 mt-4">

          <Text className="text-start w-full text-3xl mb-8 text-accent font-medium">
            Create your Tether account
          </Text>

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
        </View>

        {/* <View className="w-full h-[55px] justify-center items-center ">
          <Pressable onPress={()=> router.navigate("/(auth)/login")}>
            <Text className="w-full text-accent-100 text-center text-lg">
              Already have an account? <Text className="underline text-secondary font-medium">Login</Text>
            </Text>
          </Pressable>
        </View> */}

        <View className="flex-1 justify-end items-center px-4" >

          <Button
            text="Next" 
            onPress={handleSignup} 
            loading={isLoading}
            disabled={!isFormValid} 
            disabledClassName="bg-accent-400"
          />

          <Text className="text-black text-center px-4 mt-4 text-sm font-light">
            By continuing, you agree to our <Text className="underline">Term of Service</Text> and <Text className="underline">Privacy Policy</Text>.
          </Text>
        </View>

      </View>
    </ScreenWrapper>
  )
}

export default Signup

const styles = StyleSheet.create({})