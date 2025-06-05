import { useAuth } from "@/contexts/authContext";
import { journeys } from '@/data/journeys';
import React, { useMemo } from 'react';
import {
  Dimensions,
  FlatList,
  Text,
  View
} from 'react-native';
import JourneyLink from "./JourneyLink";


const CARD_WIDTH   = Dimensions.get('window').width * 0.87; // tweak
const COLUMN_SIZE  = 2;   // 👉 2 cards per column

const ExploreFind = () => {
  const {myJourneys} = useAuth()

  /* 🛠️ 2.  Keep an explicit type */
  const columns = useMemo<(typeof journeys[number])[][]>(() => {
    const chunks: (typeof journeys[number])[][] = [];
    for (let i = 0; i < journeys.length; i += COLUMN_SIZE) {
      chunks.push(journeys.slice(i, i + COLUMN_SIZE));
    }
    return chunks;
  }, [journeys]);

  const canScrollHorizontally = columns.length > 1;   // 👉 disable if only one page

  return (
    <View className='flex-1 '>
      {/* Journeys */}
      <View>
        <Text className="font-bold text-2xl text-[#322566] mb-4 mx-4">
          Journeys
        </Text>

        {/* horizontal FlatList where *each* item is a column of 2 cards */}
        <FlatList
          data={columns}
          keyExtractor={(_, i) => `col-${i}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={canScrollHorizontally}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          renderItem={({ item: column }) => (
            <View style={{ width: CARD_WIDTH, marginLeft: 8, justifyContent: 'space-between' }}>
              {column.map(journey => {
                /* ------- progress calc (same as before) ------- */
                const completedSteps = myJourneys[journey.id]?.completedSteps ?? {};
                const totalSteps     = journey.sections.reduce(
                  (sum, s) => sum + s.steps.length,
                  0
                );
                const completedCount   = Object.keys(completedSteps).length;
                const percentComplete  = totalSteps ? completedCount / totalSteps : 0;
                const isComplete       = totalSteps && completedCount >= totalSteps;

                return (
                  <JourneyLink
                    journey={journey}
                    percent={percentComplete}
                    complete={isComplete}
                  />
                );
              })}
            </View>
          )}
        />
      </View>
    </View>
  )
}

export default ExploreFind
