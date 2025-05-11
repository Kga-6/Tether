import React, { FC, useEffect, useRef, useState } from 'react';
import {
  Animated,
  AppState,
  AppStateStatus,
  Easing,
  Image,
  ImageSourcePropType,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Slide {
  id: string;
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
}

const SLIDES_DATA: Slide[] = [
  {
    id: '1',
    image: require('../assets/images/coverimage1.png'),
    title: 'Make connection a daily habit',
    subtitle:
      'Dedicate time each day to connect with each other through quick, daily conversations',
  },
  {
    id: '2',
    image: require('../assets/images/coverimage2.png'),
    title: 'Explore New Perspectives',
    subtitle: 'Broaden your horizons by understanding different viewpoints.',
  },
  {
    id: '3',
    image: require('../assets/images/coverimage3.png'),
    title: 'Achieve Goals Together',
    subtitle: 'Collaboration makes complex tasks easier and more enjoyable.',
  },
];

const SLIDE_DURATION = 5000;

const SlideShow: FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const resetTimerAndProgress = (): void => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: SLIDE_DURATION,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    timerRef.current = setTimeout(goToNextSlide, SLIDE_DURATION) as unknown as number;
  };

  const goToNextSlide = (): void => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES_DATA.length);
  };

  const goToPreviousSlide = (): void => {
    setCurrentIndex((prev) =>
      prev === 0 ? SLIDES_DATA.length - 1 : prev - 1,
    );
  };

  const goToSlide = (index: number): void => {
    setCurrentIndex(index);
  };

  /* ───────────────────────── LIFECYCLE ───────────────────────── */
  useEffect(() => {
    resetTimerAndProgress();
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [currentIndex]);

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        resetTimerAndProgress();
      } else if (nextState.match(/inactive|background/)) {
        if (timerRef.current !== null) clearTimeout(timerRef.current);
      }
      appState.current = nextState;
    };

    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      sub.remove();
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  /* ──────────────────────── SWIPE HANDLER ─────────────────────── */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 10,
      onPanResponderRelease: (_, g) => {
        if (g.dx > 50) {
          // swipe right → previous
          goToPreviousSlide();
        } else if (g.dx < -50) {
          // swipe left → next
          goToNextSlide();
        }
      },
    }),
  ).current;

  const currentSlide = SLIDES_DATA[currentIndex];

  /* ────────────────────────── RENDER ─────────────────────────── */
  return (
    <View className="flex-1 w-full" {...panResponder.panHandlers}>
      <View className="flex-1 justify-center items-center">
        <Image
          key={currentSlide.id}
          source={currentSlide.image}
          resizeMode="contain"
          style={{ width: '100%', height: '60%' }}
        />
        <View className="w-full justify-center items-center">
          <Text className="text-accent-100 text-center text-3xl font-medium">
            {currentSlide.title}
          </Text>
          <Text className="text-accent-600 font-light text-center text-lg mt-4 leading-[23px]">
            {currentSlide.subtitle}
          </Text>
        </View>
      </View>

      <View className="flex-row h-2.5 my-6 mx-2">
        {SLIDES_DATA.map((slide, index) => {
          let barFill;
          if (index < currentIndex) {
            barFill = (
              <View className="h-full bg-secondary rounded-full" style={{ width: '100%' }} />
            );
          } else if (index === currentIndex) {
            barFill = (
              <Animated.View
                className="h-full bg-secondary rounded-full"
                style={{
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                }}
              />
            );
          } else {
            barFill = (
              <View className="h-full bg-secondary rounded-full" style={{ width: '0%' }} />
            );
          }

          return (
            <TouchableOpacity
              key={slide.id}
              className="flex-1 bg-white rounded-full overflow-hidden mx-1"
              onPress={() => goToSlide(index)}
              activeOpacity={0.7}
            >
              {barFill}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default SlideShow;
