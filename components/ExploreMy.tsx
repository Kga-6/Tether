import { useAuth } from "@/contexts/authContext";
import { journeys as allJourneys } from "@/data/journeys";
import React, { useMemo } from "react";
import {
  FlatList,
  Text,
  View
} from "react-native";
import JourneyLink from "./JourneyLink";

export default function ExploreMy() {
  const { myJourneys } = useAuth();

  /* ---------- split into in-progress vs. done ---------- */
  const { currentJourneys, completedJourneys } = useMemo(() => {
    const current: typeof allJourneys = [];
    const done:    typeof allJourneys = [];

    allJourneys.forEach((j) => {
      const completedSteps = myJourneys[j.id]?.completedSteps ?? {};
      const totalSteps     = j.sections.reduce((s, sec) => s + sec.steps.length, 0);
      const finished       = Object.keys(completedSteps).length;
      const isComplete     = totalSteps && finished >= totalSteps;
      const hasStarted     = finished >= 0; 

      if (isComplete)      done.push(j);
      else if (hasStarted) current.push(j);
    });

    return { currentJourneys: current, completedJourneys: done };
  }, [myJourneys]);

  /* ---------- list item ---------- */
  const renderJourneyRow = ({ item }: { item: typeof allJourneys[number] }) => {
    const completedSteps = myJourneys[item.id]?.completedSteps ?? {};
    const totalSteps     = item.sections.reduce((s, sec) => s + sec.steps.length, 0);
    const finished       = Object.keys(completedSteps).length;
    const percent        = totalSteps ? finished / totalSteps : 0;
    const complete       = totalSteps && finished >= totalSteps;

    return (
      <JourneyLink
        journey={item}
        percent={percent}
        complete={complete}
      />
    );
  };

  /* ---------- small wrapper so FlatList receives the right props ---------- */
  const Section = ({ title, data }: { title: string; data: typeof allJourneys }) => (
    <View>
      <Text className="font-bold text-2xl text-[#322566] mb-4 px-4">
        {title}
      </Text>
      {data.length === 0 ? (
        <Text className="text-[#BAAFCF] px-4 mb-6">
          {title === "Current Journeys"
            ? "You haven’t started any journeys yet."
            : "Nothing here yet — keep going!"}
        </Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(j) => j.id}
          renderItem={renderJourneyRow}
          scrollEnabled={false}
          className="px-4"
        />
      )}
    </View>
  );

  return (
    <View className="flex-1">
      <Section title="Current Journeys"   data={currentJourneys} />
      <Section title="Completed Journeys" data={completedJourneys} />
    </View>
  );
}
