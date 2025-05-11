import React from 'react';
import type { TouchableOpacityProps } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Loading from './Loading';

interface ButtonProps extends TouchableOpacityProps { // Extend TouchableOpacityProps
  text: string;
  onPress: () => void;
  loading?: boolean; // Add disabled prop
  disabled?: boolean; // Add disabled prop
  // You can add more specific class name props if needed
  buttonClassName?: string;
  textClassName?: string;
  disabledClassName?: string; // Specific class for disabled state
}

const Button = ({
  text,
  onPress,
  loading = false,
  disabled = false, // Default to false
  buttonClassName, // Your default class
  textClassName="text-white text-lg", // Your default class
  disabledClassName = "opacity-50", // Tailwind class for disabled state (e.g., reduced opacity)
  ...rest // Pass other TouchableOpacityProps
}: ButtonProps) => {

  buttonClassName = buttonClassName + " w-[100%] h-[50px] justify-center items-center rounded-full"

  console.log(buttonClassName)

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled} // Use the disabled prop
      // Apply base classes and conditionally add disabled class || w-[100%] h-[55px] justify-center items-center rounded-full z-[-1]
      className={`${disabled ? disabledClassName : "bg-secondary"} ${buttonClassName}`}

      {...rest} // Spread other props like style, activeOpacity etc.
    >

      {!loading ? <Text className={textClassName}>{text}</Text>: <View><Loading/></View>}
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({})