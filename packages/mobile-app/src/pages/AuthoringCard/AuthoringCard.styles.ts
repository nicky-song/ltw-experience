import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
  },
  carouselContainer: {
    padding: 10,
    paddingTop: 0,
    marginTop: 10,
  },
  inView: {
    // for some reason a background is needed on the inView container. Otherwise, it won't work on android
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    bottom: 0,
    width: '100%',
  },
  buttonContinue: {
    marginRight: 10,
    backgroundColor: '#6FC07A',
  },
  startButton: {
    flex: 1,
    margin: 10,
    backgroundColor: '#6FC07A',
  },
  endCardButtonContainer: {
    marginHorizontal: 10,
    flex: 1,
  },
  nextLessonButton: {
    // TODO: This should be set in a button component
    backgroundColor: '#6FC07A',
  },
  backToCourses: {
    backgroundColor: '#FBF9F7',
    marginTop: 10,
  },

  contentSpacer: {
    height: 45,
  },
  buttonDisabled: { backgroundColor: undefined },
});

export default styles;
