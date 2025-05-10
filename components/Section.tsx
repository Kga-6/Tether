import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface SectionProps {
  header: string;
  subheading: string;
  image?: any; // image can be a number if using `require()`
}

const Section: React.FC<SectionProps> = ({ header, subheading, image }) => {
  
  return (
    <View className='flex-1 w-full'>
      <View className="flex-1 justify-center items-center">
        <Image
          source={image}
          resizeMode="contain"
          style={{ width: '100%', height: '60%' }}
        />
        <View className="w-full px-4 justify-center items-center">
          <Text className="text-accent text-center text-2xl font-bold">{header}</Text>
          <Text className="text-accent text-center mt-4">{subheading}</Text>
        </View>
      </View>

    </View>
  )
}

export default Section

const styles = StyleSheet.create({})