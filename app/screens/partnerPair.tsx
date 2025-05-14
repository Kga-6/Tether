import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/contexts/authContext";
import * as Clipboard from 'expo-clipboard';
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

const PairScreen: React.FC = () => {
  const { user, pairWithPartner, nextRoute } = useAuth();
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handlePair = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await pairWithPartner(user.uid!, code.trim().toUpperCase());
      // Navigate to home after pairing
      await nextRoute(user.uid!, false, true);
    } catch (e) {
      console.error("Pairing error:", e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!user) return;
    
    await Clipboard.setStringAsync(user?.pair_code);
    Alert.alert('Copied', user?.pair_code);
  };


  return (
    <ScreenWrapper style="flex-1 bg-accent-300">
      <View className="flex-1 px-4 mt-20">
        <View className="mb-8">
          <Text className="text-3xl mb-2 text-accent-100 font-medium">
            Pair with your partner
          </Text>
          <Text className="text-accent-100 font-light text-lg">
            Pair with your partner and heal together
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-secondary">Your Code: {user?.pair_code ?? "—"}</Text>
        </View>
        <Button
          text="Tap to copy"
          onPress={copyToClipboard}
          buttonClassName="w-full"
        />

        <View className="mb-6">
          <Text className="mb-2">I have a code from my partner:</Text>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Enter partner's code"
            autoCapitalize="characters"
            className="h-[55px] bg-accent-100 text-white px-4"
          />
        </View>

        <Button
          text="Pair now"
          onPress={handlePair}
          disabled={!code || loading}
          loading={loading}
          buttonClassName="w-full"
        />
      </View>
    </ScreenWrapper>
  );
};

export default PairScreen;

const styles = StyleSheet.create({});
