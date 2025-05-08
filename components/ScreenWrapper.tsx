import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

// Define the props for your custom component
// It will take all the props that SafeAreaView takes,
// but we'll set defaults for 'style' and 'edges'.
interface StyledSafeAreaViewProps extends Omit<SafeAreaViewProps, 'style' | 'edges'> {
  children: ReactNode;
  style?: string; // Allow overriding style
  edges?: SafeAreaViewProps['edges']; // Allow overriding edges
}

const defaultEdges = ['top', 'bottom'] as const; // Use 'as const' for better type inference

const StyledSafeAreaView: React.FC<StyledSafeAreaViewProps> = ({
  children,
  style,
  edges = defaultEdges, // Default edges
  ...rest // Pass through any other SafeAreaView props
}) => {
  return (
    <SafeAreaView
      className={style}
      edges={edges}
      {...rest}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  defaultSafeArea: {
    flex: 1,
    backgroundColor: '#DCC2F9', // Your default background color
  },
});

export default StyledSafeAreaView;