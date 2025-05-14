
import Button from '@/components/Button';
import { auth } from '@/config/firebase';
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import { signOut } from 'firebase/auth';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

const home = () => {
  const router = useRouter();

  const {user, fetchPartnerData, unpairPartner} = useAuth()
  console.log("User: ", user)

  const handleLogout = async () => {
    await signOut(auth)
  }

  const handleLogPartnerData = async () => {
    if (!user?.uid) {
      Alert.alert('No user', 'You must be logged in to view partner data.');
      return;
    }

    try {
      const partner = await fetchPartnerData(user.uid);
      if (partner) {
        console.log('Partner Data:', partner);
        Alert.alert('Partner Info', `Name: ${partner.name || '—'}`);
      } else {
        Alert.alert('Not Paired', 'You are not paired with anyone yet.');
      }
    } catch (err) {
      console.error('Fetch partner error:', err);
      Alert.alert('Error', 'Could not fetch partner data.');
    }
  }

  const handleUnpair = async ( ) => {
    if (!user?.uid) {
      Alert.alert('No user', 'You must be logged in.');
      return;
    }

    try {
      unpairPartner(user.uid)
    } catch (err) {
      console.error('Unpair error:', err);
      Alert.alert('Error', 'Could not unpair.');
    }

  }

  return (
    <View className="flex-1 justify-center items-center space-y-4">
        <Text className="text-4xl text-secondary font-bold">{user?.name ? `Welcome back, ${user.name}` : "Welcome!"}</Text>
        <Button
          text="Logout" 
          onPress={handleLogout} 
          buttonClassName="w-[100%] h-[55px] justify-center items-center rounded-full" 
          textClassName="text-white text-lg font-light"
          disabledClassName="bg-accent-400"
        />
        <Button
          text="Pair" 
          onPress={()=>{router.push("/screens/partnerPair")}} 
          buttonClassName="w-[100%] h-[55px] justify-center items-center rounded-full" 
          textClassName="text-white text-lg font-light"
          disabledClassName="bg-accent-400"
        />
        <Button
          text="Unpair" 
          onPress={handleUnpair} 
          buttonClassName="w-[100%] h-[55px] justify-center items-center rounded-full" 
          textClassName="text-white text-lg font-light"
          disabledClassName="bg-accent-400"
        />
        <Button
          text="Log partner" 
          onPress={handleLogPartnerData} 
          buttonClassName="w-[100%] h-[55px] justify-center items-center rounded-full" 
          textClassName="text-white text-lg font-light"
          disabledClassName="bg-accent-400"
        />
        
    </View>
  )
}

export default home

const styles = StyleSheet.create({})