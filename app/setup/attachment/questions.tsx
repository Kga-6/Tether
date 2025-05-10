const cover = require("../../../assets/images/coverimage1.png"); // Adjust the path as needed
import MyButton from "@/components/Button";
import MyQuestion from "@/components/MyQuestion";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { ECR_QUESTIONS } from "../../../data/attachmentQuestions";
import { calculateAttachmentScores, classifyAttachmentStyle } from "../../../utils/attachmentScoring";


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
    const currentQuestion = ECR_QUESTIONS[currentIndex];
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionSelected! }));

    console.log(ECR_QUESTIONS.length,currentIndex)

    if (currentIndex < ECR_QUESTIONS.length - 1 && optionSelected != null) {
      setCurrentIndex((prev) => prev + 1);
      setOptionSelected(null); // reset for next question
    } else {
      const finalAnswers = { ...answers, [currentQuestion.id]: optionSelected! };
      const scores = calculateAttachmentScores(finalAnswers, ECR_QUESTIONS);
      const style = classifyAttachmentStyle(scores);

      console.log("Anxiety Score:", scores.anxiety);
      console.log("Avoidance Score:", scores.avoidance);
      console.log("Attachment Style:", style);

      // testing router
      router.replace({
        pathname: "/setup/attachment/results",
        params: {
          anxietyScore: scores.anxiety.toString(), // Convert numbers to strings
          avoidanceScore: scores.avoidance.toString(),
          attachmentStyle: style,
        },
      })
    }
  };

  const currentQuestion = ECR_QUESTIONS[currentIndex];

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