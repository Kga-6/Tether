import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

const Input = () => {
  return (
    <View>
      <TextInput
        className='flex w-full h-[55px] bg-white text-secondary border-accent2 rounded-2xl border-2 text-lg justify-center items-center text-light-100 mb-4 px-6 '
        placeholder='Your email'
        placeholderTextColor={"#E7E0EE"}
      />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({})