import { Button, Text } from '@ant-design/react-native';
import { Link, useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { useState } from 'react';
import Input from '../../components/input';
import styles from './Password.styles';
import { forgotPassword } from '../../features/Auth/authService';
import { isValidEmail } from '@learn-to-win/common/utils/isValidEmail';

export function ForgotPassword() {
  const [resendStatus, setResendStatus] = useState(false);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendEmailStatus, setResendEmailStatus] = useState(false);
  const navigation = useNavigation();

  const onSubmit = () => {
    const messageATryAgain = 'Please try again.';
    setResendEmailStatus(false);
    if (email && isValidEmail(email) === false) {
      setErrorMessage('Invalid email. ' + messageATryAgain);
      setResendEmailStatus(true);
    } else if (!email) {
      setErrorMessage('Email is missing. ' + messageATryAgain);
      setResendEmailStatus(true);
    } else {
      setErrorMessage('');
      forgotPassword(email)
        .then(() => {
          setResendStatus(true);
        })
        .catch((error) => {
          setResendStatus(false);
          setErrorMessage(error.message);
        });
    }
  };

  return (
    <View style={styles.container}>
      {resendStatus ? (
        <>
          <Text style={styles.textHeader}>Check Your Email</Text>
          <Text style={styles.textBody}>
            If an account is associated with the provided email, you&apos;ll
            receive instructions to reset your password. Please remember to
            check your spam folder if you don&apos;t see it in your inbox.
          </Text>
          <Text style={styles.textEmail}> {email} </Text>

          <Button
            style={styles.buttonSend}
            type='primary'
            onPress={() => {
              navigation.navigate('Login');
            }}>
            Back To Log In
          </Button>
        </>
      ) : (
        <>
          <Text style={styles.textHeader}>Forgot Password?</Text>
          <Text style={styles.textBody}>
            Enter the email you use for learntowin.com
          </Text>
          <Input
            iconName={'email-outline'}
            placeholder={'Email'}
            validateStatus={resendEmailStatus}
            onChangeText={(text) => setEmail(text)}
            autoComplete={'email'}
            onSubmitEditing={onSubmit}
            returnKeyType={'done'}
          />
          {!!errorMessage && (
            <View style={styles.errorContainer}>
              <Text>{errorMessage}</Text>
            </View>
          )}
          <Button style={styles.buttonSend} type='primary' onPress={onSubmit}>
            Send Instructions
          </Button>
          <Link style={styles.linkLogIn} to={'/Login'}>
            Back to Log In
          </Link>
        </>
      )}
    </View>
  );
}
