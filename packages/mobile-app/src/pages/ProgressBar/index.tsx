import { View } from 'react-native';
import styles from './progressBar.styles';

interface ProgressBarProps {
  currentIndex: number;
  cardCount: number;
}

const ProgressBar = ({ cardCount, currentIndex }: ProgressBarProps) => {
  return (
    <View style={styles.progressContainer}>
      {cardCount < 35 ? (
        Array.from(new Array(cardCount)).map((_, i) => (
          <View
            key={i}
            style={
              i <= currentIndex ? styles.barComplete : styles.barIncomplete
            }></View>
        ))
      ) : (
        <View style={styles.barContainer}>
          <View
            style={[
              styles.barComplete,
              { width: `${((currentIndex + 1) / cardCount) * 100}%` },
            ]}
          />
        </View>
      )}
    </View>
  );
};

export default ProgressBar;
