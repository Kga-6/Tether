import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from 'react';
import { StyleSheet } from 'react-native';

const iconMap: Record<string, { focused: string; unfocused: string }> = {
  home:     { focused: "home",          unfocused: "home-outline" },
  explore:  { focused: "search",        unfocused: "search-outline" },
  companion:{ focused: "chatbubbles",   unfocused: "chatbubbles-outline" },
  timeline: { focused: "calendar",          unfocused: "calendar-outline" },
  debug: { focused: "bug",          unfocused: "bug-outline" },
};

const _layout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        // active/inactive colors
        tabBarActiveTintColor: "#8C50FB",
        tabBarInactiveTintColor: "#685F96",

        // background + stroke
        tabBarStyle: {
          backgroundColor: "#F9F4FB",   // your bg
          borderTopColor: "#E7E0EE",    // your stroke
          borderTopWidth: 1,            // make sure it's visible
        },

        // hide headers
        headerShown: false,

        // inject icon
        tabBarIcon: ({ color, size, focused }) => {
          const { focused: nameF, unfocused: nameU } = iconMap[route.name] || {};
          const iconName = focused ? nameF : nameU;
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
          name="home"
          options={{
              title:"Home",
              headerShown:false
          }}
      />
      <Tabs.Screen
          name="explore"
          options={{
              title:"Expore",
              headerShown:false
          }}
      />
      <Tabs.Screen
          name="companion"
          options={{
              title:"AI",
              headerShown:false
          }}
      />
      <Tabs.Screen
          name="timeline"
          options={{
              title:"Timeline",
              headerShown:false
          }}
      />
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})