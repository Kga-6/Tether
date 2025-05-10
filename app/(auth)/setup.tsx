import ScreenWrapper from "@/components/ScreenWrapper";
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

const Setup = () => {
  return (
    <ScreenWrapper style="flex-1 bg-accent-300">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0} // Adjust if you have a fixed header
        style={{ flex: 1 }}
      >
        <View className="flex-1">
          
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

export default Setup

const styles = StyleSheet.create({})