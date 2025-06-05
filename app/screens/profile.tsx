import CircleButton from '@/components/CircleButton';
import { useAuth } from "@/contexts/authContext";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View
} from 'react-native';

import {
  useSafeAreaInsets
} from 'react-native-safe-area-context';

const defaultprofile = require("@/assets/images/defaultprofile.jpg");

const HEADER_TITLE = "Profile"
const HEADER_HEIGHT = 50 

const profile: React.FC = () => {
  const {user, fetchPartnerData, unpairPartner, deleteAccount} = useAuth()
  const [showSticky, setShowSticky] = useState(false)

  const insets = useSafeAreaInsets();

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y
    setShowSticky(y > HEADER_HEIGHT)
  }

  return (
    <View className='flex-1'>

      <View
        pointerEvents="none"
        className="absolute inset-0"
      >
        <View className="flex-1 bg-secondary" />
        <View className="flex-1 bg-white" />
      </View>

      {showSticky && (
        <SafeAreaView className='absolute top-0 left-0 right-0 bg-white z-10 border-b border-[#F9F4FB]'>
          <View style={{ height: HEADER_HEIGHT }} className='flex-row items-center justify-end relative'>
            {/* Centered title */}
            <Text className="absolute left-0 right-0 text-center text-[#322566] font-medium text-xl">
              {HEADER_TITLE}
            </Text>
            
            {/* Your buttons */}
            <View className="flex-row px-4">
              <Pressable className='bg-white border border-[#E7E0EE] h-[33px] w-[33px] rounded-full flex-row items-center justify-center px-3'>
                <Ionicons name="settings-outline" size={12} color="#322566" />
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      )}

       <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{paddingTop: insets.top, flexGrow: 1}}
        className='flex-1'
       >

        <View className="flex-col w-full justify-between items-center mt-4">
          
          <View className='flex-row w-full justify-between items-center'>
            <CircleButton onPress={() => router.back()} Icon={<Ionicons name="chevron-back" size={18} color="#322566" />}/>
            <Pressable className="w-[64px] h-[64px]">
              <Image
                source={user?.image? { uri: user.image } : defaultprofile} // user?.image? user.image: defaultprofile
                resizeMode="cover"
                className="rounded-full bg-black border-[2px] border-secondary border=primary w-[100%] h-[100%] z-[2]"
              />
            </Pressable>
            <CircleButton onPress={() => router.push("/screens/settings")} Icon={<Ionicons name="settings-outline" size={18} color="#322566" />}/>
          </View>

          <Text className="text-4xl text-white text-center w-full mt-4 font-bold">{user?.name ? `${user.name}` : "Name not found!"}</Text>
        </View>

        <View className='flex-1 bg-white pb-[60px] rounded-tl-full rounded-tr-full mt-4'>

        </View>


       </ScrollView>
    </View>
  )
}

export default profile
