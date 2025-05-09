import { AntDesign } from '@expo/vector-icons'; // Using Feather icons as an example
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MyQuestion = ({ question, options, onSelected, optionSelected }: any) => {
  return (
    <View className="w-full mb-3">
      <Text className=" text-accent-100 text-4xl mb-8 font-medium">{question}</Text>

      {options.map((option: string, index: number) => {
        const isSelected = option === optionSelected;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onSelected(option)}
            className={`flex-row justify-start items-center h-[70px] w-full mb-4 px-3 rounded-2xl border-2 ${
              isSelected ? 'bg-white text-secondary border-secondary' : 'bg-white  border-accent-600'
            }`}
          >
            
            <View className={`w-[30px] h-[30px] rounded-full justify-center items-center mr-4 ${
              isSelected ? 'bg-white border-2 border-secondary' : 'border-2 border-accent-600'
            }`}>
              {isSelected && <AntDesign name="check" size={20} color="#6c47ff" />}
            </View>

            <Text className={`text-base ${isSelected ? 'text-secondary' : 'text-accent-600'}`}>{option}</Text>

          </TouchableOpacity>
        );
      })}
    </View>
  );
};


export default MyQuestion

const styles = StyleSheet.create({})