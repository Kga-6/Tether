import { AntDesign } from '@expo/vector-icons'; // Using Feather icons as an example
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const MyQuestion = ({ question, options, onSelected, optionSelected }: any) => {
  
  return (
    <View className="w-full mb-3">
      <Text className=" text-accent-100 text-4xl mb-8 font-medium">{question}</Text>

      {options.map((option: string, index: number) => {
        const isSelected = option === optionSelected;

        return (
          <Pressable
            key={index}
            onPress={() => onSelected(option)}
            className={`flex-row justify-start items-center h-[80px] w-full mb-4 px-3 rounded-2xl border-2 ${
              isSelected ? 'bg-white text-secondary border-secondary' : 'bg-white  border-accent-200'
            }`}
          >
            
            <View className={`w-[20px] h-[20px] rounded-full justify-center items-center mr-4 ${
              isSelected ? 'bg-secondary border-2 border-secondary' : 'border-2 border-accent-200'
            }`}>
              {isSelected && <AntDesign name="check" size={10} color="white" />}
            </View>

            <Text className={`text-base ${isSelected ? 'text-secondary' : 'text-black'}`}>{option}</Text>

          </Pressable>
        );
      })}
    </View>
  );
};


export default MyQuestion

const styles = StyleSheet.create({})