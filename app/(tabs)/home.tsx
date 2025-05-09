
import Button from '@/components/Button'
import { auth } from '@/config/firebase'
import { useAuth } from '@/contexts/authContext'
import { signOut } from 'firebase/auth'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const home = () => {

  const {user} = useAuth()
  console.log("User: ", user)
  const handleLogout = async () => {
    await signOut(auth)
  }

  return (
    <View className="flex-1 justify-center items-center">
        <Text className="text-4xl text-secondary font-bold">Home Page</Text>
        <Button
            text="Logout" 
            onPress={handleLogout} 
            buttonClassName="w-[100%] h-[55px] justify-center items-center rounded-full" 
            textClassName="text-white text-lg font-light"
            disabledClassName="bg-accent-400"
          />
    </View>
  )
}

export default home

const styles = StyleSheet.create({})