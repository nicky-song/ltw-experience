import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FBF9F7',
    paddingTop: 160,
    paddingBottom: 334,
    paddingHorizontal: 20,
  },
  textIndicator: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 50,
  },
  textHeader: {
    fontSize: 34,
    marginBottom: 24,
    fontWeight: '600',
  },
  textEmail: {
    textDecorationLine: 'underline',
    fontWeight: '600',
    marginBottom: 24,
  },
  textHeaderChangePassword: {
    fontSize: 25,
    marginBottom: 24,
    fontWeight: '600',
  },
  textBody: {
    fontSize: 16,
    marginBottom: 24,
    fontWeight: '600',
  },
  buttonSend: {
    width: `100%`,
    borderRadius: 8,
    marginBottom: 16,
  },
  linkLogIn: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '600',
  },
  linkForgotPassword: {
    marginTop: 24,
    fontSize: 18,
  },
  passwordRequirement: {
    width: `100%`,
    marginTop: 24,
  },
  passwordRequirementItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  passwordRequirementText: {
    marginRight: 'auto',
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
});

export default styles;
