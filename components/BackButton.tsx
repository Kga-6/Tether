import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

interface Props {
    onPress: () => void;
}

const BackButton = ({onPress}: Props) => {
  return (
    <View className="flex justify-start items-start p-4" >
        <TouchableOpacity onPress={onPress} className="bg-white border-2 border-accent2 rounded-full w-[48px] h-[48px] justify-center items-center">
            <Image
                source={require('../assets/images/backicon.png')}
                className='h-[44%] w-[44%] justify-center items-center mr-1'
                style={{ tintColor: '#322566' }}
                resizeMode="contain" // Or your preferred resizeMode
            />
        </TouchableOpacity>
        
    </View>
  )
}

export default BackButton

