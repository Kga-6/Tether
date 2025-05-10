const cover = require("../../../assets/images/coverimage1.png"); // Adjust the path as needed
import MyButton from "@/components/Button";
import MyQuestion from "@/components/MyQuestion";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

interface Question {
  id: string;
  title: string;
  options: string[];
}

const RELATIONSHIP_QUESTIONS: Question[] = [
  {
    id: '1',
    title: 'How do you define your relationship with Monica?',
    options: ["In a relationship", "Engaged", "Married", "In a civil partnership"]
  },
  {
    id: '2',
    title: 'Do you live together?',
    options: ["We live together", "We live separately, nearby", "We live separately, long distance"]
  },
  {
    id: '3',
    title: 'Do any of you have kids?',
    options: ["Yes", "No"]
  },
  {
    id: '4',
    title: 'How important is religion in your relationship?',
    options: ["Very important", "Important", "Somewhat important", "Not important at all"]
  },
  {
    id: '5',
    title: 'Which religion do you identify with?',
    options: ["Christianity", "Jewish", "Catholic", "Muslim", "Other", "Prefer Not to Say"]
  },
];

const questions = () => {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [optionSelected, setOptionSelected] = useState<string | null>(null);

  
  const onSelected = (value: string) => {
    console.log(currentQuestion.title + ": " + value)
    setOptionSelected(value);
  };

  const onNext = () => {
    const currentQuestion = RELATIONSHIP_QUESTIONS[currentIndex];
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionSelected! }));

    if (currentIndex < RELATIONSHIP_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setOptionSelected(null); // reset for next question
      
    } else {
      console.log('All answers:', { ...answers, [currentQuestion.id]: optionSelected! });
      // Navigate or handle submission here
      router.replace("/setup/attachment/startup")
      
    }
  };

  const currentQuestion = RELATIONSHIP_QUESTIONS[currentIndex];

  return (
    <ScreenWrapper style="flex-1 bg-accent-300">
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0} // Adjust if you have a fixed header
            style={{ flex: 1 }}
        >
            <View className="flex-1 px-4 mt-20">
              
              <MyQuestion
                question={currentQuestion.title}
                options={currentQuestion.options}
                onSelected={onSelected}
                optionSelected={optionSelected}
              />

              {optionSelected &&
                <View className="flex-1 justify-end items-center" >
                  <MyButton
                      text="Next"
                      onPress={onNext}
                      disabled={!optionSelected}
                      buttonClassName="w-full h-[55px] justify-center items-center rounded-full bg-secondary"
                      textClassName="text-white text-lg font-light"
                      disabledClassName="bg-accent-400"
                  />
                </View>
              }

            </View>
        </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

export default questions

const styles = StyleSheet.create({})