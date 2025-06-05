import type { Step } from '@/types/journey';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Slider from '@react-native-community/slider';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated, LayoutChangeEvent, Pressable,
  Text,
  View
} from 'react-native';


import {
  useSafeAreaInsets
} from 'react-native-safe-area-context';

type Props = {
  step: Step & { type: 'meditation' };
  journeyId: string;
  onComplete: () => void;
};

/** Time helper ─ e.g. 5 min 8 sec → “5:08” */
const fmt = (sec = 0) => {
  const m = Math.floor(sec / 60).toString();
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export default function ExploreMeditation({ step, onComplete }: Props) {
  const player = useAudioPlayer({ uri: step.payload.url }); 
  const status = useAudioPlayerStatus(player);

  /* ───── derived state ───── */
  const total     = status.duration   ?? player.duration   ?? 0;          // seconds
  const position  = status.currentTime?? player.currentTime?? 0;          // seconds
  const remaining = Math.max(total - position, 0);
  const [isSaving, setSaving] = useState(false)

  /* rerender every second while playing so timer/slider move */
  const [, force] = useState(0);
  useEffect(() => {
    if (!status.playing) return;
    const id = setInterval(() => force(i => i + 1), 1000);
    return () => clearInterval(id);
  }, [status.playing]);

  /* ───── handlers ───── */
  const toggle = () =>
    status.playing ? player.pause() : player.play();

  const seek   = useCallback(
    (v: number) => player.seekTo(v * total),   // v ∈ [0,1]
    [player, total]
  );

  const skip = (secs: number) => {
    /* use the freshest currentTime the status hook gives us */
    const now      = status.currentTime ?? player.currentTime ?? 0;
    const target   = Math.min(Math.max(now + secs, 0), total); // clamp
    player.seekTo(target);
  };

  const handleSaving = (force) => {
    console.log("HEREs")
    if(force){
      onComplete()
    }
    if (isSaving === false) {
      setSaving(true);
      if (status.didJustFinish || (total && position >= total)) onComplete();
      setSaving(false);
    }
  }

  /* safe-area paddings */
  const insets = useSafeAreaInsets();

  /* auto-finish (Avoids firing onComplete twice) */
  useEffect(() => {
    handleSaving()
  }, [status.didJustFinish]);

  /* ---------- UI-chrome visibility ---------- */
  const [visible, setVisible] = useState(true);
  const opacity = useRef(new Animated.Value(1)).current;

  const toggleChrome = () => {
    Animated.timing(opacity, {
      toValue: visible ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setVisible(v => !v));
  };

  /* ───── slider / scrubbing state ───── */
  const [dragging, setDragging]   = useState(false);    // finger down?
  const [dragVal,  setDragVal]    = useState(0);        // value 0-1 while dragging
  const [wasPlaying, setWasPlaying] = useState(false);  // restore play state
  const [trackW, setTrackW]       = useState(0);        // px width of slider

  /* helper: position to show in UI */
  const shownPos   = dragging ? dragVal * total : position;
  const shownRem   = Math.max(total - shownPos, 0);

  /* save + pause when user starts scrub -------------------------------- */
  const onSlideStart = () => {
    setWasPlaying(status.playing);
    player.pause();
    setDragging(true);
  };

  /* live update while finger moves -------------------------------------- */
  const onSlide = (v: number) => setDragVal(v);

  /* seek + resume when released ----------------------------------------- */
  const onSlideEnd = (v: number) => {
    const target = v * total;
    player.seekTo(target);
    if (wasPlaying) player.play();
    setDragging(false);
  };

  /* px→time bubble position --------------------------------------------- */
  const bubbleLeft = trackW ? Math.min(Math.max(dragVal * trackW, 24), trackW - 24) : 0;

  /* measure slider width once */
  const onTrackLayout = (e: LayoutChangeEvent) => setTrackW(e.nativeEvent.layout.width);

  /* ───── while loading ───── */
  if (!status.isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#8000FF" size="large" />
      </View>
    );
  }

  const handleRouting = () => {
    router.back()
  }

  return(
    <View className='flex-1'>
      <Pressable
        className="flex-1"
        onPress={toggleChrome}
        android_disableSound
      >
        <LinearGradient
          colors={step.gradient? step.gradient : ['#9858D8', '#8000FF']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}  
          end={{ x: 1, y: 1 }}
        >
          <View className='flex-1' style={{ paddingTop: insets.top + 12 }}>
            <Animated.View
              className="justify-center items-center"
              style={{ opacity}}
            >
              <View className="flex-row w-full justify-between items-start p-4">
                <Pressable onPress={handleRouting}>
                  <Text className="text-white text-center underline text-lg font-light">Exit</Text>
                </Pressable>

                <Pressable onPress={()=>{handleSaving(true)}}>
                  <Text className="text-white text-center underline text-lg font-light">Done</Text>
                </Pressable>
              </View>
            </Animated.View>
            
            <Animated.View
              className="justify-center items-center"
              style={{ opacity, paddingTop: insets.top + 12 }}
            >
              <Text className="text-center font-medium w-[85%] text-4xl text-white mb-4">
                {step.title}
              </Text>
              <Text className="text-center text-1 font-light text-white">
                Guided by {step.author}
              </Text>
            </Animated.View>

            {/* countdown */}
            <View className="flex-1 justify-center items-center absolute right-0 left-0 top-0 bottom-0">
              <Text className="text-white text-7xl font-light">{fmt(shownRem)}</Text>
            </View>

            {/* controls & progress */}
            <Animated.View
              className="flex-1  justify-end"
              style={{
                opacity,
                paddingBottom: insets.bottom + 12,
                alignItems: 'center',
              }}
            > 
              {/* --- button row --- */}
              {!dragging &&
                <View className="flex-row items-center mb-4 space-x-6">
                  {/* ◀️ 15s backward */}
                  <Pressable
                    onPress={() => skip(-15)}
                    className="w-12 h-12 rounded-full justify-center items-center"
                  >
                    <FontAwesome5 name="backward" size={20} color="#fff" />
                  </Pressable>

                  {/* play / pause */}
                  <Pressable
                    onPress={toggle}
                    className="w-16 h-16 rounded-full justify-center items-center mx-4"
                  >
                    <FontAwesome5
                      name={status.playing ? 'pause' : 'play'}
                      size={28}
                      color="#fff"
                    />
                  </Pressable>

                  {/* 15s forward ▶️ */}
                  <Pressable
                    onPress={() => skip(15)}
                    className="w-12 h-12 rounded-full justify-center items-center"
                  >
                    <FontAwesome5 name="forward" size={20} color="#fff" />
                  </Pressable>
                </View>
              }
          

              {/* slider + bubble */}
              <View className="w-[90%] mb-4" onLayout={onTrackLayout}>
                {/* bubble only while dragging */}
                {dragging && (
                  <View
                    className="absolute  top-[-60]"
                    style={{ left: bubbleLeft - 40 /* bubble half-width */ }}
                  >
                    <View className="bg-white rounded-xl px-4 py-2">
                      <Text className="text-black font-semibold">{fmt(shownPos)}</Text>
                    </View>
                    <View
                      className="w-0 h-0"
                      style={{
                        borderLeftWidth: 8,
                        borderRightWidth: 8,
                        borderTopWidth: 10,
                        borderLeftColor: 'transparent',
                        borderRightColor: 'transparent',
                        borderTopColor: '#fff',
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                )}

                <Slider
                  style={{ flex: 1 }}
                  minimumTrackTintColor="#fff"
                  maximumTrackTintColor="rgba(255,255,255,0.30)"
                  thumbTintColor="#fff"             /* permanent white thumb */
                  value={total ? position / total : 0}
                  onSlidingStart={onSlideStart}
                  onValueChange={onSlide} 
                  onSlidingComplete={onSlideEnd} 
                />
              </View>

              {/* elapsed / remaining labels – live update */}
              <View className="w-[90%] flex-row justify-between">
                <Text className="text-white text-xs">{fmt(shownPos)}</Text>
                <Text className="text-white text-xs">{fmt(shownRem)}</Text>
              </View>
            </Animated.View>
              
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  )
}
