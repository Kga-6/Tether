const cover = require("../../../assets/images/coverimage1.png"); // Adjust the path as needed
import MyButton from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// It's good practice to define image sources outside the component if they are static
const graphImage = require('@/assets/images/stylecartesian.png');
const profileImage = require('@/assets/images/defaultprofile.jpg');

const GRAPH_MARGIN_LEFT_PERCENT = 5;  // Example: 5% margin on the left of the plot area
const GRAPH_MARGIN_TOP_PERCENT = 5;   // Example: 5% margin on the top of the plot area
const GRAPH_PLOT_WIDTH_PERCENT = 90;  // Example: Plot area uses 90% of image width
const GRAPH_PLOT_HEIGHT_PERCENT = 90; // Example: Plot area uses 90% of image height

const DOT_SIZE = 30;

const results = () => {
  const router = useRouter();

  const params = useLocalSearchParams<{ anxietyScore: string; avoidanceScore: string; attachmentStyle: string }>();
  
  const anxietyScore = parseFloat(params.anxietyScore || '0');
  const avoidanceScore = parseFloat(params.avoidanceScore || '0');
  const attachmentStyle = params.attachmentStyle || 'Unknown'; // Default style

  console.log(params)

  // Calculate score percentage (0-100) along the conceptual axis
  // Anxiety: 1 (0%) to 5 (100%)
  const scoreXPercent = ((anxietyScore - 1) / 4) * 100;
  // Avoidance: 5 (0% at top) to 1 (100% at bottom)
  const scoreYPercent = ((5 - avoidanceScore) / 4) * 100;

  // Adjust these percentages to map onto the actual plot area within the image
  const finalLeftPercent = GRAPH_MARGIN_LEFT_PERCENT + (scoreXPercent * GRAPH_PLOT_WIDTH_PERCENT / 100);
  const finalTopPercent = GRAPH_MARGIN_TOP_PERCENT + (scoreYPercent * GRAPH_PLOT_HEIGHT_PERCENT / 100);

  const onNext = () => {

  }

  return (
    <ScreenWrapper style="flex-1 bg-accent-300" edges={['top', "bottom"]}>
      <ScrollView className="flex-1 px-4 mt-14">
          <View className="mb-8">
            <Text className="text-start w-full text-3xl mb-4 text-accent-100 font-medium">
                We've got results:
            </Text>
            <Text className=" text-secondary text-4xl font-medium">
                {attachmentStyle}
            </Text>
          </View>

          <View className="mb-8" >
            <Text className="text-accent-100 font-light text-lg mb-8">
                This assessment evaluates two key traits, each scored on a scale from 1 to 5:
            </Text>

            <Text className="text-accent-100 font-light text-lg mb-8">
                <Text className="font-bold">Avoidance</Text>: Your score for avoidance was <Text className="font-bold">{avoidanceScore}</Text>, this personality trait is related to how much you are unwilling to allow yourself to be vulnerable to your partner. High scorers do not like to open up to others. Low scorers share their feelings freely.
            </Text>

            <Text className="text-accent-100 font-light text-lg mb-8">
                <Text className="font-bold">Anxiety</Text>: Your score for anxiety was <Text className="font-bold">{anxietyScore}</Text>, this personality trait is related to how much you worry about your partner paying attention to you. People who score high on this trait frequently worry about, and are dissatisfied with, the attention they receive. Low scorers tend not to worry about this.
            </Text>
            <Text className="text-accent-100 font-light ">
                Your two scores are used to determine your attachment style, which is visually represented on the chart below.
            </Text>
          </View>

        <View className="relative w-full bg-black mb-8" style={{ aspectRatio: 1 }}>
          {/* Background graph */}
          <Image
            source={graphImage}
            resizeMode="contain"
            className="w-full h-full"
          />

          {/* Profile dot (positioned absolutely) */}
          {/* Profile dot (positioned absolutely) */}
          <View
            style={{
              position: 'absolute',
              top: `${finalTopPercent}%`,
              left: `${finalLeftPercent}%`,
              width: DOT_SIZE, // Explicitly set width
              height: DOT_SIZE, // Explicitly set height
              transform: [
                { translateX: -(DOT_SIZE / 2) }, // Center the dot horizontally
                { translateY: -(DOT_SIZE / 2) }  // Center the dot vertically
              ]
            }}
          >
            <Image
              source={profileImage}
              resizeMode="cover" // 'cover' or 'contain' depending on desired look for the dot
              className="rounded-full bg-black border-[2px] border-primary w-full h-full" // Use w-full h-full
            />
          </View>
        </View>

          
        </ScrollView>

        <View className=" justify-end items-center px-4 pt-8" >
            <View className="w-full h-[40px] justify-start items-center">
              <TouchableOpacity onPress={()=>{router.replace("/setup/attachment/questions")}} >
                <Text className="text-secondary text-center underline text-lg font-light">Retake</Text>
              </TouchableOpacity>
            </View>

            <MyButton
                text="Next"
                onPress={onNext}
                disabled={false}
                buttonClassName="w-full h-[55px] justify-center items-center rounded-full bg-secondary"
                textClassName="text-white text-lg font-light"
                disabledClassName="bg-accent-400"
            />
        </View>
    </ScreenWrapper>
  )
}

export default results

const styles = StyleSheet.create({})