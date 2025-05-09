import { Feather } from '@expo/vector-icons'; // Using Feather icons as an example
import React, { useState } from 'react';
import type { TextInputProps } from "react-native";
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export interface InputProps extends Omit<TextInputProps, 'secureTextEntry' | 'placeholderTextColor'> {
  // Omit secureTextEntry because we handle it internally with showPasswordToggle
  // Omit placeholderTextColor to explicitly type it and provide a default
  containerClassName?: string; // For the outermost View container
  label?: string;
  labelClassName?: string;
  inputWrapperClassName?: string; // For the View that wraps TextInput and icons
  textInputClassName?: string;  // Specific classes for the TextInput element itself
  icon?: React.ReactNode;
  iconContainerClassName?: string;
  error?: string;
  errorClassName?: string;
  hint?: string;
  hintClassName?: string;
  showPasswordToggle?: boolean; // To enable password visibility toggle
  secureTextEntryInitial?: boolean; // To set the initial state of secureTextEntry
  customPlaceholderTextColor?: string; // Explicit prop for placeholder text color
  focusBorderClassName?: string;
}

const Input = (props: InputProps) => {

  const {
    containerClassName = "w-full mb-3", // Default container styling
    label,
    labelClassName = "mb-1 text-sm text-gray-700",
    inputWrapperClassName = "flex-row items-center border-2 border-gray-300 rounded-xl bg-white", // Base wrapper style
    textInputClassName = "flex-1 py-3 px-4 text-base text-gray-900", // Base text input style
    icon,
    iconContainerClassName = "pl-3", // Padding for the icon container
    error,
    errorClassName = "mt-1 text-xs text-error",
    hint,
    hintClassName = "mt-1 text-xs text-gray-500",
    showPasswordToggle,
    secureTextEntryInitial = false,
    customPlaceholderTextColor,
    value,
    onFocus: propOnFocus, // Renaming to avoid conflict with internal handler
    onBlur: propOnBlur,   // Renaming to avoid conflict with internal handler
    // EXAMPLE: Use a primary color for focus, replace 'blue-600' and 'blue-500' with your theme's colors
    focusBorderClassName = "border-blue-600",
    ...restProps
  } = props;

  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntryInitial);
  const [isFocused, setIsFocused] = useState(false); // <--- New state for focus tracking

  const togglePasswordVisibility = () => {
    if (showPasswordToggle) {
      setIsPasswordVisible(!isPasswordVisible);
    }
  };

  const handleFocus: TextInputProps['onFocus'] = (e) => {
    setIsFocused(true);
    propOnFocus?.(e); // Call the original onFocus from props if it exists
  };

  const handleBlur: TextInputProps['onBlur'] = (e) => {
    setIsFocused(false);
    propOnBlur?.(e); // Call the original onBlur from props if it exists
  };

  const isPasswordField = showPasswordToggle || secureTextEntryInitial;
  const currentSecureTextEntry = isPasswordField ? !isPasswordVisible : false;

  let finalWrapperClasses = inputWrapperClassName;

  if (error) {
    if(isFocused){
      finalWrapperClasses = `${inputWrapperClassName} ${focusBorderClassName}`;
    }else{
      finalWrapperClasses = `${inputWrapperClassName} border-error`;
    }

  } else if (isFocused) {
    finalWrapperClasses = `${inputWrapperClassName} ${focusBorderClassName}`;
  }

  return (
    <View className={containerClassName}> 
      <View className={finalWrapperClasses}>
        

        <TextInput
          className={textInputClassName}
          value={value}
          placeholderTextColor={customPlaceholderTextColor || "#A0A0A0"} // Default or custom
          secureTextEntry={currentSecureTextEntry}
          autoCorrect={isPasswordField ? false : undefined}
          autoCapitalize={restProps.keyboardType === 'email-address' || isPasswordField ? 'none' : 'sentences'}
          onFocus={handleFocus} // <--- Added onFocus handler
          onBlur={handleBlur}   // <--- Added onBlur handler
          {...restProps} // Pass down other TextInput props (onChangeText, placeholder, etc.)
        />

        {showPasswordToggle && isPasswordField && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            className="absolute right-0 top-0 h-full flex justify-center items-center px-3" // Position toggle button
          >
            <Feather
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color={
                isFocused
                  ? "#8C50FB" // Focused state color
                  : error
                  ? "#F37468" // Error state color
                  : customPlaceholderTextColor || "#A0A0A0"
              }
            />
          </TouchableOpacity>
        )}
        {icon && (
          <View className={iconContainerClassName}>{icon}</View>
        )}
      </View>

      {error && (
        <Text
          className={isFocused ? "mt-1 text-xs text-[#BAAFCF]" : errorClassName}
        >
          {error}
        </Text>
      )}
      
      {!error && hint && <Text className={hintClassName}>{hint}</Text>}

    </View>
  )
}

export default Input