import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';


interface Props {
    text: string;
    onPress: () => void;
}

const Button = ({text,onPress}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} className='w-[100%] h-[55px] justify-center items-center rounded-full bg-secondary'>
        <Text className='text-white text-lg font-light'>{text}</Text>
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({})