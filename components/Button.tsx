import React, { useState } from 'react';
import type { TouchableOpacityProps } from 'react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Loading from './Loading';

interface ButtonProps extends TouchableOpacityProps {
  text: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  buttonClassName?: string;
  textClassName?: string;
  disabledClassName?: string;
  pressedClassName?: string; // Add prop for pressed state class
}

const Button = ({
  text,
  onPress,
  loading = false,
  disabled = false,
  buttonClassName,
  textClassName = "text-white text-lg",
  disabledClassName = "opacity-50",
  pressedClassName = "bg-accent-700", // Default pressed state class
  ...rest
}: ButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  buttonClassName = buttonClassName + " w-[100%] h-[50px] justify-center items-center rounded-full";

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handleOnPress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handleOnPress}
      disabled={disabled || loading}
      className={`${disabled ? disabledClassName : isPressed ? pressedClassName : "bg-secondary"} ${buttonClassName}`}
      {...rest}
    >
      {!loading ? <Text className={textClassName}>{text}</Text> : <View><Loading /></View>}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({});