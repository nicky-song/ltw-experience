import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// prevents content from being hidden by notches, status bars, etc. and allows the background color to be set
export function SafeArea({
  backgroundColor = 'white',
  children,
  centerContent = false,
}) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SafeAreaView
        style={[
          styles.safeArea,
          centerContent && { justifyContent: 'center' },
        ]}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
