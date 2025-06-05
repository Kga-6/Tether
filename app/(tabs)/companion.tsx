import MainHeader from '@/components/MainHeader';
import React, { useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  useSafeAreaInsets
} from 'react-native-safe-area-context';

const HEADER_TITLE = "Companion"
const HEADER_HEIGHT = 50  // tweak to match your MainHeader height

const Companion = () => {
  const [showSticky, setShowSticky] = useState(false)

  const insets = useSafeAreaInsets();

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y
    setShowSticky(y > HEADER_HEIGHT)
  }

  return (
    <View className='flex-1'>
      {showSticky && (
        <SafeAreaView className='absolute top-0 left-0 right-0 bg-white z-10 border-b border-[#F9F4FB]'>
          <View style={{ height: HEADER_HEIGHT }} className='flex-row items-center justify-end relative'>
            {/* Centered title */}
            <Text className="absolute left-0 right-0 text-center text-[#322566] font-medium text-xl">
              {HEADER_TITLE}
            </Text>
          </View>
        </SafeAreaView>
      )}

      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{paddingTop: insets.top,}}
        className='bg-white'
      >
        <View className="flex-row p-4">
          <MainHeader title={HEADER_TITLE}/>
        </View>
      </ScrollView>
    </View>
  )
}

export default Companion

const styles = StyleSheet.create({})