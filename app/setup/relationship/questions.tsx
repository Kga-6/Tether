const cover = require("../../../assets/images/coverimage1.png"); // Adjust the path as needed
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

const RELATIONSHIP_QUESTIONS: Question[] = [
  {
    id: '1',
    title: 'How do you define your relationship with Monica?',
    options: ["In a relationship", "Engaged", "Married", "In a civil partnership"],
    data: "status"
  },
  {
    id: '2',
    title: 'Do you live together?',
    options: ["We live together", "We live separately, nearby", "We live separately, long distance"],
    data: "live"
  },
  {
    id: '3',
    title: 'Do any of you have kids?',
    options: ["Yes", "No"],
    data: "kids"
  },
  {
    id: '4',
    title: 'How important is religion in your relationship?',
    options: ["Very important", "Important", "Somewhat important", "Not important at all"],
    data: "religion_importance"
  },
  {
    id: '5',
    title: 'Which religion do you identify with?',
    options: ["Christianity", "Jewish", "Catholic", "Muslim", "Other", "Prefer Not to Say"],
    data: "religion"
  },
  {
    id: '6',
    title: 'Have you guys broken up before?',
    options: ["Yes", "No"],
    data: "breakup"
  }
];

const questions = () => {
  const router = useRouter();
  const { user, saveUserData, nextRoute } = useAuth();

  // Existing saved answers
  const answeredData = user?.partner_base ?? {};
  // Filter out questions already answered
  const pendingQuestions = RELATIONSHIP_QUESTIONS.filter(q => !answeredData[q.data]);

  // If nothing to ask, skip straight to next screen
  useEffect(() => {
    if (pendingQuestions.length === 0) {
      router.replace('/setup/attachment/startup');
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
    // Add current answer
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionSelected! }));

    // More questions remaining?
    if (currentIndex < pendingQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setOptionSelected(null);
    } else {
      setIsLoading(true);
      const allAnswered = { ...answers, [currentQuestion.id]: optionSelected! };

      // Merge new answers into existing partner_base
      const updatedPartnerBase = { ...answeredData } as Record<string, any>;
      pendingQuestions.forEach(q => {
        updatedPartnerBase[q.data] = allAnswered[q.id];
      });

      await saveUserData(user.uid!, { partner_base: updatedPartnerBase });
      setIsLoading(false);

      nextRoute(user.uid, true, true)
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