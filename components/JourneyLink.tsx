import { journeys as allJourneys } from "@/data/journeys";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface Props {
  journey: typeof allJourneys[number];   // <-- the real Journey object
  percent: number;
  complete: boolean;                     // <-- boolean, not number
}

const JourneyLink = ({ journey, percent, complete }: Props) => (
  <Link href={`/journeys/${journey.id}`} asChild>
    <Pressable className="flex-row mb-4">
      <Image
        source={{ uri: journey.coverImage }}
        className="h-[84px] w-[84px] mr-4 rounded-md"
      />

      <View className="flex-1 py-2 justify-between">
        <View>
          <Text className="text-[#322566] text-lg font-medium">
            {journey.title}
          </Text>
          <Text className="text-[#BAAFCF] text-sm">
            {journey.sections.length} steps
          </Text>
        </View>

        {percent !== 0 && !complete && (
          <View>
            <Text className="mb-1 text-[#BAAFCF] text-sm">Progress</Text>
            <View
              className="rounded-full bg-[#E7E0EE] overflow-hidden"
              style={{ height: 8 }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${(percent * 100).toFixed(1)}%`,
                  backgroundColor: "#8C50FB",
                }}
              />
            </View>
          </View>
        )}
      </View>

      {complete && (
        <View className="justify-center items-center">
          <View className="bg-[#8C50FB] w-[32px] h-[32px] rounded-full justify-center items-center">
            <MaterialIcons name="check" size={16} color="#fff" />
          </View>
        </View>
      )}
    </Pressable>
  </Link>
);

export default JourneyLink;
