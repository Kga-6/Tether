import MyButton from "@/components/Button";
import MyQuestion from "@/components/MyQuestion";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

interface Question {
  id: string;
  title: string;
  options: string[];
  data: string;
}

const PERSONAL_QUESTIONS: Question[] = [
  {
    id: '1',
    title: 'What is your gender?',
    options: ["Male", "Female"],
    data: "gender"
  },
  // {
  //   id: '2',
  //   title: 'How important is religion to you?',
  //   options: ["Very important", "Important", "Somewhat important", "Not important at all"],
  //   data: "religion_importance"
  // },
  // {
  //   id: '3',
  //   title: 'How important is religion to you?',
  //   options: ["Christianity", "Jewish", "Catholic", "Muslim", "Other", "Prefer Not to Say"],
  //   data: "religion"
  // },
  // {
  //   id: '4',
  //   title: 'Would you like to include christian based tools?',
  //   options: ["Yes", "No"],
  //   data: "christian_based_tools"
  // },
];

const questions = () => {
  const router = useRouter();
  const { user, saveUserData, nextRoute } = useAuth();

  // Existing saved answers
  const answeredData = user ?? {};
  // Filter out questions already answered
  const pendingQuestions = PERSONAL_QUESTIONS.filter(q => !answeredData[q.data]);

  // If nothing to ask, skip straight to next screen
  useEffect(() => {
    if (pendingQuestions.length === 0) {
      nextRoute(user.uid, true, false)
    }
  }, [pendingQuestions, router]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [optionSelected, setOptionSelected] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!user || pendingQuestions.length === 0) {
    return null;
  }

  const currentQuestion = pendingQuestions[currentIndex];

  const onSelected = (value: string) => {
    setOptionSelected(value);
  };

  const onNext = async () => {
    const newAnswers = { ...answers, [currentQuestion.id]: optionSelected! };
    setAnswers(newAnswers);

    if (currentIndex < pendingQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setOptionSelected(null);
    } else {
      setIsLoading(true);

      const updatedData = { ...answeredData };
      pendingQuestions.forEach(q => {
        updatedData[q.data] = newAnswers[q.id];
      });

      await saveUserData(user.uid!, updatedData);
      setIsLoading(false);
      nextRoute(user.uid, true, false)
    }
  };

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
                      loading={isLoading}
                      disabled={!optionSelected}
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