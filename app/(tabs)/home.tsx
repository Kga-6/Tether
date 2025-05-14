
import Button from '@/components/Button';
import ScreenWrapper from "@/components/ScreenWrapper";
import { auth } from '@/config/firebase';
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

import { classifyAttachmentStyle } from "@/utils/attachmentScoring";
const defaultprofile = require("@/assets/images/defaultprofile.jpg");

const home = () => {
  const router = useRouter();
  const {user, fetchPartnerData, unpairPartner, deleteAccount} = useAuth()

  const [attachment, setAttachment] = useState(String);

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

  useEffect(() => {
    
    if (user?.ecr_scores){
      const { anxiety, avoidance } = user.ecr_scores; 
      setAttachment(classifyAttachmentStyle({ anxiety, avoidance }));
    }

    
  }, [user])

  return (
    <ScreenWrapper className="flex-1">
      <View className="flex-1 px-4 mt-20">

          <View className='flex justify-center items-center mb-2'>
            <View className="w-[105px] h-[105px] mb-3">
              <Image
                source={user?.image? { uri: user.image } : defaultprofile} // user?.image? user.image: defaultprofile
                resizeMode="cover"
                className="rounded-full bg-black border-[4px] border-secondary border=primary w-[100%] h-[100%]"
              />
            </View>

            <Text className="text-lg text-black ">{user?.name ? `${user.name}` : "Name not found!"}</Text>
            <Text className="text-lg text-black ">{user?.email ? `${user.email}` : "Email not found!"}</Text>
            <Text className="text-lg text-black ">{attachment}</Text>

            <Button
              text="Logout" 
              onPress={handleLogout} 
              disabledClassName="bg-accent-400"
            />
             <Button
              text="Delete" 
              onPress={deleteAccount} 
              disabledClassName="bg-accent-400"
            />
          </View>

          <View className='flex flex-col space-y-1'>
            <Button
              text="Pair" 
              onPress={()=>{router.push("/screens/partnerPair")}} 
              disabledClassName="bg-accent-400"
            />
            <Button
              text="Unpair" 
              onPress={handleUnpair} 
              disabledClassName="bg-accent-400"
            />
            <Button
              text="Log partner" 
              onPress={handleLogPartnerData} 
              disabledClassName="bg-accent-400"
            />
          </View>
          
          
      </View>
    </ScreenWrapper>
  )
}

export default home

const styles = StyleSheet.create({})