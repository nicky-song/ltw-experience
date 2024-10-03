import { LearningItem } from '@learn-to-win/common/features/LearningItems/learningItemTypes';
import { Text, View, StyleSheet } from 'react-native';
import MoreInfo from '../../components/MoreInfo/MoreInfo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function LessonPreview({ lesson }: { lesson: LearningItem }) {
  return (
    <View style={styles.container}>
      <Text>Ready for the next lesson?</Text>
      <View style={styles.lessonDetails}>
        <View style={styles.image}>
          <Icon
            name='file-image-outline'
            size={styles.icon.size}
            color={styles.icon.color}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{lesson.name}</Text>
          <MoreInfo text={lesson.description} linesToTruncate={3} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginHorizontal: 10,
  },
  normalText: {
    fontSize: 16,
  },
  lessonDetails: { flexDirection: 'row', marginVertical: 10 },
  image: {
    height: 120,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  textContainer: { marginHorizontal: 10, flex: 1 },
  title: { fontWeight: 'bold', fontSize: 16 },
  icon: {
    size: 50,
    color: '#bbbbbb',
  },
});
