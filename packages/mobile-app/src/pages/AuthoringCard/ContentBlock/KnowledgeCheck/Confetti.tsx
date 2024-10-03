import { useEffect, useRef, useState } from 'react';
import LottieView from 'lottie-react-native';
import { View, StyleSheet } from 'react-native';
import ConfettiJSON from '@learn-to-win/common/assets/confetti.json';
import { vibrateWithPattern } from './vibrateWithPattern';

export function Confetti() {
  const ref = useRef<LottieView>();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    ref.current?.play();
    vibrateWithPattern('X--x.x.x.x');

    // Let animation run before hiding component (to not block any button taps)
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      {isVisible && (
        <LottieView
          ref={ref}
          style={styles.lottie}
          source={ConfettiJSON}
          loop={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    bottom: -100,
  },
  lottie: {
    width: 350,
    height: 350,
  },
});
