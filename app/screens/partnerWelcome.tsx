import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

const defaultprofile = require("@/assets/images/defaultprofile.jpg");

/**
 * Renders a welcome screen that confirms the current user is paired with a partner.
 * Allows un‑pairing or advancing to the next screen.
 */
const PartnerWelcome: React.FC = () => {
  const { user, unpairPartner, fetchPartnerData, saveUserData } = useAuth();
  const router = useRouter();

  const [partnerData, setPartnerData] = useState<{ name?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [unpairing, setUnpairing] = useState(false)

  // Fetch partner data when the component mounts or when the user changes
  useEffect(() => {
    if (!user?.uid) {
      Alert.alert("No user", "You must be logged in to view partner data.");
      setLoading(false);
      return;
    }

    const loadPartnerData = async () => {
      try {
        const partner = await fetchPartnerData(user.uid);
        if (partner) {
          setPartnerData(partner);
        } else {
          Alert.alert("Not Paired", "You are not paired with anyone yet.");
        }
      } catch (err) {
        console.error("Fetch partner error:", err);
        Alert.alert("Error", "Could not fetch partner data.");
      } finally {
        setLoading(false);
      }
    };

    loadPartnerData();
  }, [user, fetchPartnerData]);

  // --- Handlers -----------------------------------------------------------
  const handleUnpair = async () => {
    if (!user?.uid) {
      Alert.alert("No user", "You must be logged in.");
      return;
    }
    setUnpairing(true)
    try {
      await unpairPartner(user.uid);
      router.replace("/(tabs)/home");
    } catch (err) {
      console.error("Unpair error:", err);
      Alert.alert("Error", "Could not unpair.");
    }
    setUnpairing(false)
  };

  const handleNext = async () => {
    if (user?.uid) {
      await saveUserData(user.uid, { partner_welcomed:true });
    }
    router.push("/(tabs)/home");
  };

  // --- Render -------------------------------------------------------------
  if (loading) {
    return (
      <ScreenWrapper className="flex-1 bg-accent-300 justify-center items-center">
        <Text className="text-accent-100 text-lg">Loading…</Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper className="flex-1 bg-primary">
      <View className="flex-1 px-4 mt-20">

        <View className="flex-1">

          <View className="flex flex-col justify-center items-center">
            <Image
              source={partnerData?.image? { uri: partnerData.image } : defaultprofile} // user?.image? user.image: defaultprofile
              resizeMode="cover"
              className="rounded-full bg-black border-[12px] border-secondary border=primary w-[50%] h-[50%]"
            />
          </View>

          <View className="mb-8">
            <Text className="text-accent-100 text-center text-3xl font-medium">
              Success! You’re paired with {partnerData?.name ?? "—"}
            </Text>
            <Text className="text-accent-600 font-light text-center text-lg mt-4 leading-[23px]">
              We're excited to see you guys grow together, next page will teach you about your partners style!
            </Text>
          </View>

        </View>

        <View className=" justify-end items-center pt-8" >

          <View className="w-full h-[55px] justify-center items-center ">
            <Pressable onPress={handleUnpair}>
              <Text className="w-full text-secondary text-center text-lg">
                {unpairing? "Unpairing..." : "Unpair"}
              </Text>
            </Pressable>
          </View>

          <Button
            text="Next"
            onPress={handleNext}
            disabled={unpairing}
            disabledClassName="bg-accent-400"
          />
        </View>

      </View>
    </ScreenWrapper>
  );
};

export default PartnerWelcome;

const styles = StyleSheet.create({});
