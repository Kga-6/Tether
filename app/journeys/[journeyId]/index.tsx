import MyButton from "@/components/Button";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ImageBackground,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  Text,
  UIManager,
  View
} from 'react-native';
import Collapsible from 'react-native-collapsible';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useAuth } from '@/contexts/authContext';
import { journeys } from '@/data/journeys';
import type { Journey, Step } from '@/types/journey';

import {
  useSafeAreaInsets
} from 'react-native-safe-area-context';

const COVER_Y_OFFSET = 80;

const plural = (n: number, singular: string, pluralWord: string) =>
  n === 1 ? `${n} ${singular}` : `${n} ${pluralWord}`;

const sectionSummary = (steps: Step[]) => {
  const counts = steps.reduce<Record<string, number>>((acc, s) => {
    acc[s.type] = (acc[s.type] ?? 0) + 1;
    return acc;
  }, {});

  const parts: string[] = [];
  if (counts.question)   parts.push(plural(counts.question,  'question',  'questions'));
  if (counts.meditation) parts.push(plural(counts.meditation,'audio track','audio tracks'));
  /* add more step types here if needed */

  return parts.join(' | ');
};

export default function JourneyOverview() {
  const { journeyId } = useLocalSearchParams<{ journeyId: string }>();
  const { myJourneys, ensureJourneyProgress } = useAuth();

  const insets = useSafeAreaInsets();
  
  const journey: Journey | undefined = useMemo(
    () => journeys.find(j => j.id === journeyId),
    [journeyId]
  );

  if (!journey) {
    return (
      <ScreenWrapper style="flex-1 items-center justify-center bg-white">
        <Text style={{ fontSize: 16, color: 'crimson' }}>
          Journey “{journeyId}” not found.
        </Text>
      </ScreenWrapper>
    );
  }

  /** Grab completedSteps map for this journey (or empty object) */
  const progress = myJourneys[journeyId]?.completedSteps || {};

  /** Count total steps and completed steps */
  const totalSteps = journey.sections.reduce(
    (sum, section) => sum + section.steps.length,
    0
  );
  const completedCount = Object.keys(progress).length;
  const percentComplete = totalSteps > 0 ? completedCount / totalSteps : 0;

  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenSectionId(prev => (prev === id ? null : id));
  };

  const started     = Boolean(myJourneys[journey.id]);
  const buttonLabel = started ? 'Resume' : 'Start';

  const handleJourney = async () => {
    if (!started) await ensureJourneyProgress(journey.id);
    router.push(`/journeys/${journey.id}/map`);
  };

  return (
    <View className="flex-1" >
      <View
        pointerEvents="none"
        className="absolute inset-0"
      >
        <View className="flex-1 bg-secondary" />
        <View className="flex-1 bg-white" />
      </View>
      <ScrollView className='flex-1' contentContainerStyle={{paddingTop: insets.top , flexGrow: 1}}>

        <View className="h-[175px] mt-14 w-full bg-[#8C50FB] items-center z-[10]">

          <View className="w-full h-[55px] justify-start items-start px-4">
            <Pressable onPress={() => router.back()}>
              <Text className="text-white text-center underline text-lg font-light">Exit</Text>
            </Pressable>
          </View>

          <ImageBackground source={{ uri: journey.coverImage }} resizeMode="cover" className="rounded-full w-[95%] h-[200px] absolute" style={{  bottom: -COVER_Y_OFFSET ,  borderRadius: 4, overflow: 'hidden',}}>
            {/* Progress Bar Container */}
            {percentComplete != 0 &&
              <View
                className=" absolute right-0 left-0 bottom-0"
                style={{
                  height: 12,
                  backgroundColor: '#E7E0EE',
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${(percentComplete * 100).toFixed(1)}%`,
                    backgroundColor: '#8C50FB',
                  }}
                />
              </View>
            }
            
          </ImageBackground>
          
        </View>

        

        <View style={{ paddingTop: COVER_Y_OFFSET + 20 }} className='flex-1 bg-white pb-[60px]'>
          
          {/* title */}
          <View className="mb-5 px-4">
            <Text className="font-bold text-2xl text-[#322566] mb-4">
              {journey.title}
            </Text>

            <View className="flex-row flex-wrap items-center">
              {/* ① steps badge */}
              <View className="bg-[#F9F4FB] h-[40px] w-[80px] rounded-md justify-center border border-[#E7E0EE] mr-2 mb-2">
                <Text className="text-center text-[#685F96]">
                  {journey.sections.length} Steps
                </Text>
              </View>

              {/* ② rating badge */}
              <View className="flex-row bg-[#F9F4FB] h-[40px] w-[70px] rounded-md justify-center items-center border border-[#E7E0EE] mr-2 mb-2">
                <AntDesign name="star" size={19} color="#8C50FB" />
                <Text className="text-center text-[#685F96] ml-1">4.5</Text>
              </View>

              {/* ③ tags – these will wrap automatically */}
              {journey.tags.map(tag => (
                <View
                  key={tag}
                  className="flex-row bg-[#F9F4FB] h-[40px] px-3 rounded-md justify-center items-center border border-[#E7E0EE] mr-2 mb-2"
                >
                  <Text className="text-center text-[#685F96]">{tag}</Text>
                </View>
              ))}
            </View>

            
          </View>
          

          {/* about */}
          <View className="mb-5 px-4">
            <Text className="font-bold text-2xl mb-4 text-[#322566]">
              About
            </Text>
            <Text className="text-[#322566] leading-6">{journey.description}</Text>
          </View>

          {/* journey outline */}
          <View className="flex-1 px-4 mb-20">
            <Text className="font-bold text-2xl mb-4 text-[#322566]">
              What this Journey covers
            </Text>

            {journey.sections
              .sort((a, b) => a.order - b.order)
              .map(section => {
                const isOpen = openSectionId === section.id;
                const summary = sectionSummary(section.steps);

                return (
                  <View key={section.id} className="mb-2">
                    {/* section header */}
                    <Pressable
                      onPress={() => toggle(section.id)}
                      className={`flex-row h-[50px] justify-between items-center rounded-md px-2 py-4  ${isOpen ? 'bg-white border border-b-0 rounded-md rounded-b-none border-[#8C50FB]' : 'bg-white border rounded-md border-[#E7E0EE]'}`}
          
                    >
                      <View className={`h-[28px] w-[64px] border rounded-md mr-2 justify-center ${isOpen? 'border-[#E7E0EE]' : "border-[#E7E0EE]"}`}>
                        <Text className={` ${isOpen? 'text-[#322566]' : "text-[#322566]"} text-center`}>{`Step ${section.order}`}</Text>
                      </View>
                      <View className='flex-row flex-1 justify-between items-center'>
                        <Text className={` ${isOpen? 'text-[#322566] font-bold' : "text-[#322566]"}`}>
                          {section.title}
                        </Text>
                        <Ionicons
                          name={isOpen ? 'chevron-up' : 'chevron-down'}
                          size={18}
                          color={`${isOpen?"black":"black"}`}
                        />
                      </View>
                      
                    </Pressable>

                    {/* collapsed summary OR detailed list */}
                    <Collapsible duration={0} collapsed={!isOpen}>
                      <View className="border border-[#8C50FB] border-t-0 rounded-b-md px-4 pb-4 bg-white">
                        {/* list every step when open */}
                        <Text className="text-[#322566] text-lg mb-4">
                          {section.description}
                        </Text>
                        <Text className="text-secondary text-lg">
                          {summary}
                        </Text>
                      </View>
                    </Collapsible>
                  </View>
                );
              })}
          </View>

    
        </View>
        
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 items-center px-4" style={{ paddingBottom: insets.bottom }}>
        <MyButton
          text={buttonLabel}
          onPress={handleJourney}
          disabled={false}
          disabledClassName="bg-accent-400"
        />
      </View>
    </View>
  );
}
