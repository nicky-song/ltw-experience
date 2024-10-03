import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1,
  },
  lessonDetailsContainer: {
    backgroundColor: '#f0f5ff',
    paddingHorizontal: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingTop: 28,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  lessonDetailsBlock: { paddingVertical: 16, borderBottomWidth: 2 },
  buttonIcon: {
    fontSize: 20,
    overflow: 'visible',
    transform: [{ rotate: '180deg' }],
    color: 'black',
  },
  menuButton: {
    borderRadius: 6,
    border: 1,
    paddingLeft: 0,
    paddingRight: 0,
    width: 44,
    height: 44,
    backgroundColor: '#FBF9F7',
    borderColor: 'rgba(0,0,0,.15)',
  },
  learningItemName: { fontSize: 18, fontWeight: '600' },
  lessonDetails: {
    flexGrow: 1,
    fontSize: 16,
    alignSelf: 'center',
    fontWeight: '600',
  },
  exitButton: {
    borderRadius: 6,
  },
  lessonTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  placeHolderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.06)',
    marginRight: 16,
    backgroundColor: '#b5b8d9',
  },
  lessonDescription: {
    marginVertical: 20,
  },
  description: {},
  tabletIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 20,
  },
  cardTitle: { flex: 1 },
  youAreHere: { flex: 1, textAlign: 'right', marginRight: 10 },
  cardTitleGray: { color: 'rgba(0,0,0,.25)' },
});

export default styles;
