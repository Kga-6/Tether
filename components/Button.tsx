import React from 'react';
import type { TouchableOpacityProps } from 'react-native';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps extends TouchableOpacityProps { // Extend TouchableOpacityProps
  text: string;
  onPress: () => void;
  disabled?: boolean; // Add disabled prop
  // You can add more specific class name props if needed
  buttonClassName?: string;
  textClassName?: string;
  disabledClassName?: string; // Specific class for disabled state
}

const Button = ({
  text,
  onPress,
  disabled = false, // Default to false
  buttonClassName = "w-[100%] h-[55px] justify-center items-center rounded-full", // Your default class
  textClassName = "text-white text-lg font-light", // Your default text class
  disabledClassName = "opacity-50", // Tailwind class for disabled state (e.g., reduced opacity)
  ...rest // Pass other TouchableOpacityProps
}: ButtonProps) => {
  return (
    // <TouchableOpacity onPress={onPress} className='w-[100%] h-[55px] justify-center items-center rounded-full bg-secondary'>
    //     <Text className='text-white text-lg font-light'>{text}</Text>
    // </TouchableOpacity>

    <TouchableOpacity
      onPress={onPress}
      disabled={disabled} // Use the disabled prop
      // Apply base classes and conditionally add disabled class
      className={`w-[100%] h-[55px] justify-center items-center rounded-full ${disabled ? disabledClassName : "bg-secondary"} ${buttonClassName}`}

      {...rest} // Spread other props like style, activeOpacity etc.
    >
      <Text className={textClassName}>{text}</Text>
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({})