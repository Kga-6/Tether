import React, { FC, useEffect, useRef, useState } from 'react';
import {
    Animated,
    AppState,
    AppStateStatus,
    Easing,
    Image,
    ImageSourcePropType,
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
    subtitle: 'Dedicate time each day to connect with each other through quick, daily conversations',
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

interface SlideShowProps {}

const SlideShow: FC<SlideShowProps> = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const resetTimerAndProgress = (): void => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    progressAnim.setValue(0); // Reset animation progress

    Animated.timing(progressAnim, {
        toValue: 1,
        duration: SLIDE_DURATION,
        easing: Easing.linear, // 👈 linear easing for no tweening
        useNativeDriver: false,
    }).start();

    timerRef.current = setTimeout(() => {
      goToNextSlide();
    }, SLIDE_DURATION) as unknown as number;
  };

  const goToNextSlide = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDES_DATA.length);
  };

  const goToSlide = (index: number): void => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    resetTimerAndProgress();
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        resetTimerAndProgress(); // Resume on foreground
      } else if (nextAppState.match(/inactive|background/)) {
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const currentSlide: Slide = SLIDES_DATA[currentIndex];

  return (
    <View className="flex-1 w-full">
      <View className="flex-1 justify-center items-center">
        <Image
          key={currentSlide.id}
          source={currentSlide.image}
          resizeMode="contain"
          style={{ width: '100%', height: '60%' }}
        />
        <View className="w-full px-4 justify-center items-center">
          <Text className="text-accent text-center text-2xl font-bold">{currentSlide.title}</Text>
          <Text className="text-accent text-center mt-4">{currentSlide.subtitle}</Text>
        </View>
      </View>

      <View className="flex-row h-2.5 my-6 mx-2">
        {SLIDES_DATA.map((slide, index) => {
          let barFill;
          if (index < currentIndex) {
            barFill = <View className="h-full bg-secondary rounded-full" style={{ width: '100%' }} />;
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
            barFill = <View className="h-full bg-secondary rounded-full" style={{ width: '0%' }} />;
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
