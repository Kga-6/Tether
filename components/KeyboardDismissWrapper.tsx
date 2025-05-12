import React from "react";
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, View } from "react-native";

interface Props {
  children: React.ReactNode;
  style?: object;
}

const KeyboardDismissWrapper: React.FC<Props> = ({ children, style }) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
      <View style={[styles.container, style]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
          style={{ flex: 1 }}
        >
          {children}
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default KeyboardDismissWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
