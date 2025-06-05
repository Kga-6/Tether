import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  Text,
  View
} from 'react-native';


interface Props {
  HeaderTitle: string;
  HeaderHight: number;
}

const PlainHeader = ({ HeaderTitle, HeaderHight}: Props) => {
  return (
    <SafeAreaView className='absolute top-0 left-0 right-0 bg-white z-10 border-b border-[#F9F4FB]'>
      <View style={{ height: HeaderHight }} className='flex-row items-center justify-start relative'>
        {/* Your buttons */}
        <View className="flex-row px-4">
          <Pressable onPress={()=>{router.back()}} className='bg-white border border-[#E7E0EE] h-[33px] w-[33px] rounded-full flex-row items-center justify-center px-3'>
            <Ionicons name="chevron-back" size={12} color="#322566" />
          </Pressable>
        </View>

        {/* Centered title */}
        <Text className="absolute left-0 right-0 text-center text-[#322566] font-medium text-xl">
          {HeaderTitle}
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default PlainHeader