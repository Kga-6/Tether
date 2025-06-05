import MyButton from "@/components/Button";
import { useAuth } from '@/contexts/authContext';
import type { Step } from '@/types/journey';
import { AntDesign } from '@expo/vector-icons'; // Using Feather icons as an example
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import BackButton from "./BackButton";

import {
  useSafeAreaInsets
} from 'react-native-safe-area-context';


type Props = {
  step: Step & { type: 'question' };
  journeyId: string;
  onComplete: (answers: Record<string, string | number>) => void;
};

export default function ExploreQuestion({ step, onComplete, journeyId }: Props) {

  const { myJourneys } = useAuth(); 
  const progress = myJourneys[journeyId]?.completedSteps ?? {};
  const savedForStep = progress[step.id]?.answers as | Record<string, string | number> | undefined;

  const prompts = step.payload.questions;

  const [answers, setAnswers] = useState<Record<string, string | number>>(
    () => savedForStep ?? {}
  );

  const [idx, setIdx] = useState(() => {
    if (!savedForStep) return 0;
    const firstBlank = prompts.findIndex(q => savedForStep[q.id] == null || savedForStep[q.id] === '');
    return firstBlank === -1 ? 0 : firstBlank;
  });

  const current  = prompts[idx];
  const finished = Object.keys(answers).length === prompts.length;
  const answered = answers[current.id] !== undefined && answers[current.id] !== '';
  const insets = useSafeAreaInsets();
  const progress_bar = (idx + 1) / prompts.length;
  const [cardH, setCardH] = useState(0);
  const lastPrompt = idx === prompts.length - 1;
  
  const nextPrompt = () => {
     if (!lastPrompt) setIdx(i => i + 1);
  };
  const recordAnswer = (value: string | number) => setAnswers(prev => ({ ...prev, [current.id]: value }));

  const handleRouting = () => {
    if(idx == 0){
      router.back()
    }else{
      setIdx(i => i - 1)
    }
    console.log(idx)
  }

  const renderChoice = () => (
    <FlatList
      data={current.options}
      keyExtractor={(_, i) => i.toString()}
      className="px-4"
      renderItem={({ item, index }) => {
        const selected = answers[current.id] === index;
        return (
          <>
            <Pressable
              key={index}
              onPress={() => {
                recordAnswer(index);
              }}
              className={`flex-row justify-start items-center h-[80px] w-full mb-4 px-3 rounded-2xl border-2 ${
                selected ? 'bg-white text-secondary border-secondary' : 'bg-white  border-accent-200'
              }`}
            >
              
              <View className={`w-[20px] h-[20px] rounded-full justify-center items-center mr-4 ${
                selected ? 'bg-secondary border-2 border-secondary' : 'border-2 border-accent-200'
              }`}>
                {selected && <AntDesign name="check" size={10} color="white" />}
              </View>

              <Text className={`text-base ${selected ? 'text-secondary' : 'text-black'}`}>{item}</Text>

            </Pressable>
          </>

          
        );
      }}
    />
  );

  const renderText = () => (
    <>
      <TextInput
        value={(answers[current.id] as string) ?? ''}
        onChangeText={recordAnswer}
        multiline
        placeholder="Type your answer…"
        className="border border-[#D9D1E9] rounded-lg p-4 m-4 text-base"
      />
    </>
  );

  return (
    <View className="flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View className="flex-1 bg-secondary" style={{ paddingTop: insets.top }}>

            <View className={`mt-14 w-full bg-[#8C50FB] items-center z-[10]` } style={{ height: cardH + 14 }}>
              
              <View className="w-full justify-start items-start">
                <BackButton
                  onPress={handleRouting}
                />
                {/* <Pressable onPress={handleRouting}>
                  <Text className="text-white text-center underline text-lg font-light">Exit</Text>
                </Pressable> */}
              </View>

              <View
                onLayout={e => setCardH(e.nativeEvent.layout.height + 24)}
                className="w-[95%] absolute bg-white border border-[#E7E0EE] p-4"
                style={{
                  bottom: -(cardH / 2), // overlap half of its own height
                  borderRadius: 12,
                  overflow: 'hidden',
                }}>
                <Text className="mb-2 text-[#BAAFCF]">
                  Question {idx + 1} of {prompts.length}
                </Text>

                <Text className="text-2xl text-[#322566] font-medium mb-4">
                  {current.text}
                </Text>

                {/* progress bar */}
                <View
                  className="absolute left-0 right-0 bottom-0 m-2 rounded-full"
                  style={{ height: 12, backgroundColor: '#E7E0EE', overflow: 'hidden' }}>
                  <View
                    style={{
                      height: '100%',
                      width: `${(progress_bar * 100).toFixed(1)}%`,
                      backgroundColor: '#8C50FB',
                    }}
                  />
                </View>
              </View>
              
            </View>

            <View className="flex-1 bg-white" style={{ paddingTop: cardH / 2 + 20 }}>
              {current.type === 'choice' ? renderChoice() : renderText()}
            </View>

            {/* Navigation button */}
            {answered && 
              <View
                className="absolute bottom-0 left-0 right-0 items-center px-4"
                style={{ paddingBottom: insets.bottom }}>
                {!lastPrompt ? (
                  <MyButton
                  
                    text="Next"
                    onPress={nextPrompt}
                    disabled={!answered}
                    disabledClassName="bg-accent-200"
                  />
                ) : (
                  <MyButton
                    text="Submit"
                    onPress={() => onComplete(answers)}
                    disabled={!answered}
                    disabledClassName="bg-accent-200"
                  />
                )}
              </View>
            }
            
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}
