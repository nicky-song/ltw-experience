import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  scrollContainer: {
    height: '100%',
    justifyContent: 'center',
  },
  buttonSend: {
    width: `100%`,
    borderRadius: 8,
    marginBottom: 16,
  },
  textHeader: {
    fontSize: 30,
    marginBottom: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorContainer: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#fff2f0',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffccc7',
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 24,
  },
  passRequirement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
});

export default styles;
