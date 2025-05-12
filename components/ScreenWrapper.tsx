import React, { ReactNode } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView, SafeAreaViewProps } from "react-native-safe-area-context";

// Define the props for your custom component
interface StyledSafeAreaViewProps extends Omit<SafeAreaViewProps, "style" | "edges"> {
  children: ReactNode;
  style?: string; 
  edges?: SafeAreaViewProps["edges"];
}

const defaultEdges = ["top", "bottom"] as const;

const StyledSafeAreaView: React.FC<StyledSafeAreaViewProps> = ({
  children,
  style,
  edges = defaultEdges,
  ...rest
}) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
      <SafeAreaView className={style} edges={edges} {...rest}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
          style={styles.keyboardAvoidingView}
        >
          {children}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
});

export default StyledSafeAreaView;
