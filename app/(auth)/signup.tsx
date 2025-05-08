import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Signup = () => {
  const router = useRouter();
 

  return (
    <ScreenWrapper style="flex-1 bg-accent3">
      <View className="flex-1 bg-accent3 ">

        <BackButton
          onPress={()=> router.push("/welcome")}
        />

        <View className="flex-1 justify-start px-4 mt-4">

          <Text className="text-start w-full text-3xl mb-8 text-accent font-medium">
            Create your Tether account
          </Text>

          <View>
            <Input/>
            <Input/>
            <Input/>
          </View>
        </View>

        <View className="flex-1 justify-end items-center px-4" >
          <Button
            text="Next"
            onPress={()=> router.push("/welcome")}
          />

          <Text className="text-black text-center px-4 mt-4 text-sm font-light">
            By continuing, you agree to our <Text className="underline">Term of Service</Text> and <Text className="underline">Privacy Policy</Text>.
          </Text>
        </View>

      </View>
    </ScreenWrapper>
  )
}

export default Signup

const styles = StyleSheet.create({})