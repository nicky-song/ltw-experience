import { StyleSheet, View } from 'react-native';
import { Text } from '@ant-design/react-native';
import { ActivityIndicator } from './ActivityIndicator';

export const FullScreenActivityIndicator = ({ text }: { text?: string }) => (
  <View style={styles.container}>
    {!!text && <Text style={styles.loadingText}>{text}</Text>}
    <ActivityIndicator />
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 150,
    height: '100%',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 40,
    textAlign: 'center',
  },
});
