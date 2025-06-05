import PlainHeader from '@/components/PlainHeader';

import Button from '@/components/Button';
import { auth } from '@/config/firebase';
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { classifyAttachmentStyle } from "@/utils/attachmentScoring";
const defaultprofile = require("@/assets/images/defaultprofile.jpg");

import {
  useSafeAreaInsets
} from 'react-native-safe-area-context';

const HEADER_HEIGHT = 50 

const settings = () => {
  const router = useRouter();
  const {user, fetchPartnerData, unpairPartner, deleteAccount} = useAuth()

  const [attachment, setAttachment] = useState(String);

  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of Tether?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              console.error("Logout error:", error);
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your Tether account?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
            } catch (error) {
              console.error("Logout error:", error);
            }
          }
        }
      ],
      { cancelable: true }
    );
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
    <View className='flex-1'>
      <PlainHeader HeaderTitle='Setting' HeaderHight={HEADER_HEIGHT}/>
      <ScrollView 
        className="flex-1 px-4"
        contentContainerStyle={{paddingTop: insets.top, flexGrow: 1, marginTop: HEADER_HEIGHT + 18}}
      >
        <View className='flex justify-center items-center mb-2'>

          <Text className="text-lg text-black ">{user?.email ? `${user.email}` : "Email not found!"}</Text>
          <Text className="text-lg text-black ">{attachment}</Text>

          <Button
            text="Logout" 
            onPress={handleLogout} 
            disabledClassName="bg-accent-400"
          />
            <Button
            text="Delete" 
            onPress={handleDeleteAccount} 
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
      </ScrollView>
    </View>
  )
}

export default settings

const styles = StyleSheet.create({})