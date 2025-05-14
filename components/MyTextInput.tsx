import React, { useState } from 'react';
import type { TextInputProps } from "react-native";
import {
  Text,
  TextInput,
  View
} from 'react-native';

export interface InputProps extends Omit<TextInputProps, 'secureTextEntry' | 'placeholderTextColor'> {
  containerClassName?: string;
  label?: string;
  text?: string;
  headingText?: string;
  labelClassName?: string;
  inputWrapperClassName?: string; 
  textInputClassName?: string; 
  icon?: React.ReactNode;
  iconContainerClassName?: string;
  customPlaceholderTextColor?: string;
  focusBorderClassName?: string;
}

const MyTextInput = (props: InputProps) => {

  const {
    containerClassName = "w-full mb-3", // Default container styling
    label,
    text,
    headingText,
    labelClassName = "mb-1 text-sm text-gray-700",
    inputWrapperClassName = "flex-row items-center border-2 border-gray-300 rounded-xl bg-white", // Base wrapper style
    textInputClassName = "flex-1 py-3 px-4 text-base text-gray-900", // Base text input style
    icon,
    iconContainerClassName = "pl-3", // Padding for the icon container
    customPlaceholderTextColor,
    value,
    onFocus: propOnFocus, // Renaming to avoid conflict with internal handler
    onBlur: propOnBlur,   // Renaming to avoid conflict with internal handler
    focusBorderClassName = "border-blue-600",
    ...restProps
  } = props;

  const [isFocused, setIsFocused] = useState(false); // <--- New state for focus tracking

  const handleFocus: TextInputProps['onFocus'] = (e) => {
    setIsFocused(true);
    propOnFocus?.(e); // Call the original onFocus from props if it exists
  };

  const handleBlur: TextInputProps['onBlur'] = (e) => {
    setIsFocused(false);
    propOnBlur?.(e); // Call the original onBlur from props if it exists
  };


  let finalWrapperClasses = inputWrapperClassName;

  if(isFocused){
    finalWrapperClasses = `${inputWrapperClassName} ${focusBorderClassName}`;
  }else{
    finalWrapperClasses = inputWrapperClassName;
  }

  return (
    <View className={containerClassName}> 

        <Text className='text-lg mb-2 mx-3 text-accent-100'>{headingText}</Text>

        <View className={finalWrapperClasses}>

          <TextInput
            className={textInputClassName}
            placeholderTextColor={customPlaceholderTextColor || "#A0A0A0"} // Default or custom
            onFocus={handleFocus} // <--- Added onFocus handler
            onBlur={handleBlur}   // <--- Added onBlur handler
            {...restProps} // Pass down other TextInput props (onChangeText, placeholder, etc.)
          />

        </View>
        
      </View>
  )
}

export default MyTextInput
