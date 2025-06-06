import React from 'react';
import { Image, Pressable, View } from 'react-native';

interface Props {
    onPress: () => void;
}

const BackButton = ({onPress}: Props) => {
  return (
    <View className="flex justify-start items-start p-4" >
      <Pressable onPress={onPress} className="bg-white border-2 border-accent-200 rounded-full w-[48px] h-[48px] justify-center items-center">
        <Image
            source={require('../assets/images/backicon.png')}
            className='h-[44%] w-[44%] justify-center items-center mr-1'
            style={{ tintColor: '#322566' }}
            resizeMode="contain" // Or your preferred resizeMode
        />
      </Pressable>
    </View>
  )
}

export default BackButton

