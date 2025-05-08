import { Tabs } from "expo-router"
import React from 'react'
import { StyleSheet } from 'react-native'

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen
            name="home"
            options={{
                title:"home",
                headerShown:false
            }}
        />
        <Tabs.Screen
            name="bank"
            options={{
                title:"bank",
                headerShown:false
            }}
        />
        <Tabs.Screen
            name="us"
            options={{
                title:"us",
                headerShown:false
            }}
        />
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})