import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useAuth } from '@/contexts/authContext';
import { journeys } from '@/data/journeys';
import { Journey, Step } from '@/types/journey';

import {
  useSafeAreaInsets
} from 'react-native-safe-area-context';

const HEADER_HEIGHT = 50  // tweak to match your MainHeader height

/** -------- configuration -------- */
const NODE_SIZE    = 78;     // diameter of a node in px
const V_SPACING    = 18;     // vertical distance between nodes
const CURVE_OFFSET = 100;    // how far left / right the “swerve” goes
const MAX_FRACTION = 0.2;
const SHOW_BACKTOP_AFTER = 120; // px scrolled

export default function JourneyMap() {
  const { journeyId } = useLocalSearchParams<{ journeyId: string }>();
  const [headerTitle, setHeaderTitle] = useState<string | undefined>();
  const { myJourneys } = useAuth();
  const [showBackTop, setShowBackTop] = useState(false);

  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const backTopAnim = useRef(new Animated.Value(0)).current; // opacity 0–1

  /** Check if it's a vaild journey */
  const journey: Journey | undefined = useMemo(
    () => journeys.find(j => j.id === journeyId),
    [journeyId]
  );

  if (!journey) {
    return (
      <ScreenWrapper style="flex-1 items-center justify-center bg-white">
        <Text style={{ color: 'crimson' }}>Journey not found.</Text>
      </ScreenWrapper>
    );
  }

  //console.log(myJourneys[journeyId])
  const progress = myJourneys[journeyId]?.completedSteps || {};

  /** Count total steps and completed steps */
  const totalSteps = journey.sections.reduce(
    (sum, section) => sum + section.steps.length,
    0
  );
  const completedCount = Object.keys(progress).length;
  const percentComplete = totalSteps > 0 ? completedCount / totalSteps : 0;

  /** helper: icon by step type */
  const iconFor = (step: Step, isLocked: boolean) => {
    switch (step.type) {
      case 'meditation':
        return <FontAwesome name="microphone" size={24} color={isLocked ? '#9A8BC4' : '#FFFFFF'} /> 
      case 'question':
        return <MaterialIcons name="quiz" size={22} color={isLocked ? '#9A8BC4' : '#FFFFFF'} />
      default:
        return <Fontisto name="question" size={22} color="red" />;
    }
  };
  
  const buildOffsets = (sections: Journey['sections']) => {
    const offsets: number[] = [];

    sections
      .sort((a, b) => a.order - b.order)
      .forEach(section => {
        const steps = section.steps.sort((a, b) => a.order - b.order);
        const n     = steps.length;

        steps.forEach((_, i) => {
          // keep ends centred
          if (i === 0 || i === n - 1) {
            offsets.push(0);
            return;
          }

          // 0 → 1 → 0 smooth envelope (sinusoid)
          const envelope = Math.sin((Math.PI * i) / (n - 1));

          // final magnitude in px
          const magnitude = envelope * MAX_FRACTION * CURVE_OFFSET;

          // flip side every step:  +  -  +  -  …
          const side = i % 2 === 1 ? 1 : -1;

          offsets.push(side * magnitude);
        });
      });

    return offsets;
  };

  /** flatten the order so we can just map() */
  const offsets = buildOffsets(journey.sections);

  const STEP_HEIGHT = NODE_SIZE + V_SPACING ;
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.floor((y + HEADER_HEIGHT) / STEP_HEIGHT);
    const title = orderedSteps[idx]?.sectionTitle ?? journey.title;
    if (title !== headerTitle) setHeaderTitle(title);

    /* back-to-top visibility */
     setShowBackTop(prev => {
      const shouldShow = y > SHOW_BACKTOP_AFTER;
      return prev === shouldShow ? prev : shouldShow;
    });
  };

  const orderedSteps = journey.sections
  .sort((a, b) => a.order - b.order)
  .flatMap(section =>
    section.steps
      .sort((a, b) => a.order - b.order)
      .map(step => ({ ...step, sectionTitle: section.title }))
  )
  .map((step, i) => ({ ...step, offset: offsets[i] }));   // << here

  const activeStepIndex = useMemo(() => {
    const idx = orderedSteps.findIndex(step => !progress[step.id]);
    return idx === -1 ? orderedSteps.length - 1 : idx;
  }, [orderedSteps, progress]);

  /* animate button opacity when showBackTop toggles */
  useEffect(() => {
    Animated.timing(backTopAnim, {
      toValue: showBackTop ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [showBackTop]);

  /** Animated.Value for pulsing the active step’s overlay */
  const scaleRef = useRef<Animated.Value>(new Animated.Value(1));

  /** Whenever activeStepIndex changes, restart the 1 → 1.15 → 1 loop */

  useEffect(() => {
    scaleRef.current.setValue(1);
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleRef.current, {
          toValue: 1.15,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleRef.current, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    // If activeStepIndex changes, we want to stop the old loop.
    return () => pulse.stop();
  }, [activeStepIndex]);

  return (
    <View className='flex-1'>
      <SafeAreaView className="absolute top-0 left-0 right-0 bg-white z-10 border-b border-[#F9F4FB]">
        <View style={{ height: HEADER_HEIGHT }} className="flex-row items-center relative">
          <View className="flex-row flex-1 px-4 justify-start">
            <Pressable onPress={() => router.back()} className="bg-white border border-[#E7E0EE] h-[33px] w-[33px] rounded-full flex-row items-center justify-center">
              <MaterialIcons name="keyboard-arrow-left" size={24} color="#322566" />
            </Pressable>
            
          </View>

          <Text className="absolute left-0 right-0 text-center text-[#322566] font-bold">
            {headerTitle ?? journey.title}
          </Text>

          {/* <View className="flex-row flex-1 px-4 justify-end">
            <Pressable className="bg-white border border-[#E7E0EE] h-[33px] w-[33px] rounded-full flex-row items-center justify-center">
              <Fontisto name="heart" color="#322566" size={12} />
            </Pressable>
          </View> */}
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + HEADER_HEIGHT + V_SPACING * 2, 
          flexGrow: 1, 
          alignItems: 'center',
          paddingBottom: insets.bottom + V_SPACING,
        }}
        
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        ref={scrollRef}
        className='bg-white'
      >

       {orderedSteps.map((step, i) => {
          const isCompleted = !!progress[step.id]; // true if this stepId is in completedSteps
          const isLocked = (step.prerequisites || []).some(prId => !progress[prId]);
          
          return (
            <React.Fragment key={step.id}>
              {/* node */}
              <View style={{ alignItems: 'center' }}>
                <Link
                  href={`/journeys/${journey.id}/${step.type}/${step.id}`} // ← string only
                  asChild
                >
                  <Pressable
                    disabled={isLocked}
                    className="rounded-full justify-center items-center z-1"
                    style={{
                      width: NODE_SIZE,
                      height: NODE_SIZE,
                      transform: [{ translateX: step.offset }],
                      backgroundColor: isLocked
                        ? '#D9D1E9' // locked color
                        : isCompleted
                        ? '#8C50FB' // completed color
                        : '#8C50FB' // unlocked color
                    }}
                  >

                     {/* Animated overlay circle (base = 100% of NODE_SIZE, then we animate scale 1→1.15) */}
                    {/* Only render + animate overlay if this is the active step */}
                    {i === activeStepIndex && percentComplete != 1 && (
                      <Animated.View
                        className="bg-transparent border-2 border-[#E7E0EE] rounded-full h-[100%] w-[100%] absolute z-0"
                        style={{
                          transform: [{ scale: scaleRef.current }],
                        }}
                      />
                    )}

                    {iconFor(step,isLocked)}

                    {/* {isCompleted && !isLocked && (
                      <MaterialIcons
                        name="check"
                        size={12}
                        color="#FFFFFF"
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                        }}
                      />
                    )} */}
                    
                  </Pressable>
                </Link>
              </View>

              {/* connector except after last item */}
              {i < orderedSteps.length - 1 && (
                <View
                  style={{
                    width: 2,
                    height: V_SPACING,
                    
                  }}
                />
              )}

              {/* section label halfway between groups */}
              {i < orderedSteps.length - 1 &&
                orderedSteps[i + 1].sectionTitle !== step.sectionTitle && (
                  <View
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      marginBottom: V_SPACING * 2,
                      marginTop: V_SPACING,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#D9D1E9',
                      }}
                    >
                      {orderedSteps[i + 1].sectionTitle}
                    </Text>
                  </View>
                )}
            </React.Fragment>
          );
        })}

        
      </ScrollView>

      {/* back-to-top FAB */}
        <Animated.View
          pointerEvents={showBackTop ? 'auto' : 'none'}
          style={{
            position: 'absolute',
            right: 24,
            bottom: insets.bottom + 24,
            opacity: backTopAnim,
            transform: [
              {
                scale: backTopAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
              },
            ],
          }}>
          <Pressable
            onPress={() =>
              scrollRef.current?.scrollTo({ y: 0, animated: true })
            }
            className="bg-[#8C50FB] rounded-full h-[50px] w-[50px] items-center justify-center shadow-lg">
            <MaterialIcons name="keyboard-arrow-up" size={28} color="#FFFFFF" />
          </Pressable>
        </Animated.View>
    </View>
  );
}
