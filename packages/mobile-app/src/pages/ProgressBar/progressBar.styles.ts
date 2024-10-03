import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  progressContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    width: '100%',
    borderRadius: 10,
  },
  barContainer: {
    borderRadius: 20,
    width: '100%',
    backgroundColor: 'black',
  },
  barComplete: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    height: 4,
    backgroundColor: '#6FC07A',
    borderRadius: 20,
    margin: 2,
  },
  barIncomplete: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    height: 4,
    backgroundColor: 'black',
    borderRadius: 20,
    margin: 2,
  },
});

export default styles;
