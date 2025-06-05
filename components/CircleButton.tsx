import React from 'react';
import { Pressable, View } from 'react-native';

interface Props {
    onPress: () => void;
    Icon: React.ReactElement;
}

const CircleButton = ({onPress, Icon}: Props) => {
  return (
    <View className="flex justify-start items-start p-4" >
      <Pressable onPress={onPress} className="bg-white border-2 border-accent-200 rounded-full w-[48px] h-[48px] justify-center items-center">
        {Icon}
      </Pressable>
    </View>
  )
}

export default CircleButton

