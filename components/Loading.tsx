import React from 'react'
import { ActivityIndicator, ActivityIndicatorProps, StyleSheet, View } from 'react-native'

const Loading = ({
    size="large",
    color = "#8C50FB"
}: ActivityIndicatorProps) => {
  return (
    <View className='flex-1 justify-center align-middle items-center'>
        <ActivityIndicator className='color-white'/>
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({})