import { useAuth } from "@/contexts/authContext";
import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

const defaultprofile = require("@/assets/images/defaultprofile.jpg");

interface HeaderProps {
  title: string;
}

const MainHeader = ({ title }: HeaderProps) => {
  const {user, fetchPartnerData} = useAuth()
  const [partnerData, setPartnerData] = useState<{ name?: string } | null>(null);

  const handlePartnerData = async () => {
    if (!user?.uid) {
      Alert.alert('No user', 'You must be logged in to view partner data.');
      return;
    }

    try {
      const partner = await fetchPartnerData(user.uid);
      if (partner) {
        setPartnerData(partner)
      }
    } catch (err) {
      console.error('Fetch partner error:', err);
    }
  }

  useEffect(() => {
    handlePartnerData()
  }, [user])

  return (
    <View className='flex-row items-center'>

      <Pressable onPress={()=>{router.push("/screens/profile")}} className="w-[44px] h-[44px] mr-4">
        <Image
          source={user?.image? { uri: user.image } : defaultprofile} // user?.image? user.image: defaultprofile
          resizeMode="cover"
          className="rounded-full bg-black border-[2px] border-secondary border=primary w-[100%] h-[100%] z-[2]"
        />

        {/* {user?.In_romantic_relationship == "Yes" &&
          <Image
            source={partnerData?.image? { uri: partnerData.image } : defaultprofile} // user?.image? user.image: defaultprofile
            resizeMode="cover"
            className="rounded-full bg-black border-[2px] border-primary border=primary w-[100%] h-[100%] absolute z-0 left-8"
          />
        } */}
      </Pressable>

      <Text className="font-bold text-3xl text-[#322566]">{title}</Text>

    </View>
  )
}

export default MainHeader

const styles = StyleSheet.create({})