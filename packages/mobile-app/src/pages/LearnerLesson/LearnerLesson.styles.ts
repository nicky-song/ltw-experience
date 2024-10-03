import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1,
  },
  cardContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 34,
  },
  buttonIcon: {
    fontSize: 20,
    overflow: 'visible',
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
  learningItemName: {
    flexGrow: 1,
    fontSize: 16,
    marginLeft: 16,
    alignSelf: 'center',
    fontWeight: '600',
  },
  exitButton: {
    borderRadius: 6,
  },
});

export default styles;
