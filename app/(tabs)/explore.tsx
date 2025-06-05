import ExploreFind from '@/components/ExploreFind';
import ExploreMy from '@/components/ExploreMy';
import MainHeader from '@/components/MainHeader';
import Fontisto from '@expo/vector-icons/Fontisto';
import React, { useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';

import {
  useSafeAreaInsets
} from 'react-native-safe-area-context';

const HEADER_TITLE = "Explore"
const HEADER_HEIGHT = 50  // tweak to match your MainHeader height

const explore = () => {
  const [showSticky, setShowSticky] = useState(false)
  const [searching,setSearching] = useState(false)
  const [activeTab, setActiveTab] = useState<'myworkshops' | 'findworkshops'>('myworkshops');

  const insets = useSafeAreaInsets();

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y
    setShowSticky(y > HEADER_HEIGHT)
  }

  const handleSearchButton = () =>{
    setSearching(!searching)
  }

  const renderTabContent = () => {
    if (activeTab === 'myworkshops') return <ExploreMy />;
    return <ExploreFind />;
  };

  return (
    <View className='flex-1'>
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
                <Fontisto name="search" color="#322566" size={12} />
              </Pressable>
              {/* <Pressable className='bg-white border border-[#E7E0EE] h-[33px] rounded-full flex-row items-center justify-center px-3 ml-2'>
                <Fontisto name="favorite" color="#8C50FB" size={12} />
                <Text className="ml-2 text-[#322566]">9</Text>
              </Pressable> */}
            </View>
          </View>
        </SafeAreaView>
      )}

      {searching &&

        <View style={{ paddingTop: insets.top }} className='absolute top-0 bottom-0 w-full h-full z-10 bg-white'>
          {/* Search Bar */}
          <View className='flex-row'>
            <TextInput
              placeholder="Search"
            />
          </View>

          {/* Searching Contents */}
          <View className='flex-1'>

            {/* Filter */}
            <View>

            </View>

            <ScrollView>

            </ScrollView>
          </View>
        </View>

      }


      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{paddingTop: insets.top,}}
        className='bg-white'
      >
        <View className="flex-row p-4">
          <MainHeader title={HEADER_TITLE}/>
          <View className="flex-row flex-1 items-center justify-end">
            {/* search icon button stays fixed */}
            <Pressable onPress={handleSearchButton} className="bg-white border border-[#E7E0EE] h-[44px] w-[44px] rounded-full justify-center items-center mr-2">
              <Fontisto name="search" color="#322566" size={18} />
            </Pressable>

            {/* like button now auto-sizes to its content */}
            {/* <Pressable className="bg-white border border-[#E7E0EE] h-[44px] rounded-full flex-row items-center justify-center px-3">
              <Fontisto name="favorite" color="#8C50FB" size={18} />
              <Text className="ml-2 text-[#322566]">9</Text>
            </Pressable> */}
          </View>
        </View>

        {/* Tab Buttons */}
        <View className="flex-row justify-around mb-4 px-4">
          <Pressable onPress={() => setActiveTab('myworkshops')} className={`p-3 flex-1 ${activeTab === 'myworkshops' ? 'border-b-2 border-[#8C50FB]' : ''}`}>
            <Text className={`text-base text-center ${activeTab === 'myworkshops' ? 'text-[#8C50FB]' : 'text-[#BAAFCF]'}`}>
              My Workshops
            </Text>
          </Pressable>
          <Pressable onPress={() => setActiveTab('findworkshops')} className={`p-3 flex-1 ${activeTab === 'findworkshops' ? 'border-b-2 border-[#8C50FB]' : ''}`}>
            <Text className={`text-base text-center ${activeTab === 'findworkshops' ? 'text-[#8C50FB]' : 'text-[#BAAFCF]'}`}>
              Find Workshops
            </Text>
          </Pressable>
        </View>

        {/* Content */}
        <View>
          {renderTabContent()}
        </View>

      </ScrollView>
    </View>
  )
}

export default explore