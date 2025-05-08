import Input from "@/components/Input";
import React from 'react';
import { StyleSheet, View } from 'react-native';

// Define the props for the SignupForm component
interface SignupFormProps {
    email: string;
    setEmail: (text: string) => void;
    password: string;
    setPassword: (text: string) => void;
    validateEmail: (text: string, isSubmitting?: boolean) => boolean;
    validatePassword: (text: string, isSubmitting?: boolean) => boolean;
    emailError: string;
    passwordError: string;
  }

const SignupForm: React.FC<SignupFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  validateEmail,
  validatePassword,
  emailError,
  passwordError,
}) => {
  return (
    <View className="flex justify-center">
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
        <Input
          // label="Password"
          placeholder="Your password"
          value={password}
          onChangeText={(text) => {
              setPassword(text);
              if (passwordError) validatePassword(text);
          }}
          onBlur={() => validatePassword(password)}
          secureTextEntryInitial // This will make it secure by default
          showPasswordToggle
          inputWrapperClassName="h-[55px] w-full bg-white border-2 border-accent-200 rounded-2xl"
          focusBorderClassName="border-secondary"
          textInputClassName="flex-1 py-0 px-4 text-base text-accent-100"
          customPlaceholderTextColor={"#BAAFCF"}
          error={passwordError}
          hint={!passwordError ? "" : undefined}
        />
    </View>
  )
}

export default SignupForm

const styles = StyleSheet.create({})