import { Button, Text } from '@ant-design/react-native';
import { View, ActivityIndicator } from 'react-native';
import { Link, useNavigation } from '@react-navigation/native';
import { useState, useEffect, useRef } from 'react';
import styles from './ForgotPassword/Password.styles';
import Input from '../components/input';
import { isValidEmail } from '@learn-to-win/common/utils/isValidEmail';
import { login } from '@learn-to-win/common/features/Auth/authSlice';
import {
  INVALID_EMAIL,
  MISSING_LOGIN_DETAILS,
  MISSING_EMAIL,
  MISSING_PASSWORD,
  INCORRECT_EMAIL_OR_PASSWORD,
  TECHNICAL_GLITCH,
} from '@learn-to-win/common/constants/validationMessages';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from '../hooks/reduxHooks';
import { SafeArea } from '../components/SafeArea';
export function Login() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendEmailStatus, setResendEmailStatus] = useState(false);
  const [resendPasswordStatus, setResendPasswordStatus] = useState(false);
  const [hasFeedbackError, setHasFeedbackError] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { error, loading, shouldChangePassword } = useSelector(
    (state) => state.auth,
  );

  // Redirect to change password if needed
  useEffect(() => {
    if (shouldChangePassword) {
      navigation.navigate('ChangePassword');
    }
  }, [navigation, shouldChangePassword]);

  useEffect(() => {
    if (error) {
      if (error.match(/Incorrect username or password/gi)) {
        setErrorMessage(INCORRECT_EMAIL_OR_PASSWORD);
      } else {
        setErrorMessage(TECHNICAL_GLITCH);
      }
      setResendEmailStatus(true);
      setResendPasswordStatus(true);
      setHasFeedbackError(true);
    }
  }, [error]);

  const onSubmit = () => {
    setResendEmailStatus(false);
    setResendPasswordStatus(false);
    setHasFeedbackError(false);
    if (email && isValidEmail(email) === false) {
      setErrorMessage(INVALID_EMAIL);
      setResendEmailStatus(true);
    } else if (!email && !password) {
      setErrorMessage(MISSING_LOGIN_DETAILS);
      setResendEmailStatus(true);
      setResendPasswordStatus(true);
    } else if (!email) {
      setErrorMessage(MISSING_EMAIL);
      setResendEmailStatus(true);
    } else if (!password) {
      setErrorMessage(MISSING_PASSWORD);
      setResendPasswordStatus(true);
    } else {
      setErrorMessage('');
      dispatch(login({ email, password }));
    }
  };

  const passwordRef = useRef(null);

  return (
    <SafeArea backgroundColor={'#FBF9F7'}>
      {loading ? (
        <View style={styles.container}>
          <Text style={styles.textIndicator}>Hang tight, almost there!</Text>
          <ActivityIndicator size='large' color='#6FC07A' />
        </View>
      ) : (
        <View style={styles.container} testID="login">
          <Text style={styles.textHeaderChangePassword}>
            Welcome to Learn To Win
          </Text>
          <Input
            iconName={'email-outline'}
            placeholder={'Email'}
            hasFeedbackError={hasFeedbackError}
            validateStatus={resendEmailStatus}
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoComplete={'email'}
            returnKeyType={'next'}
            blurOnSubmit={false}
            onSubmitEditing={() => {
              passwordRef.current.focus();
            }}
            testID={'emailInput'}
          />
          <Input
            password
            iconName={'lock-outline'}
            placeholder={'Password'}
            hasFeedbackError={hasFeedbackError}
            validateStatus={resendPasswordStatus}
            value={password}
            onChangeText={(text) => setPassword(text)}
            returnKeyType={'done'}
            ref={passwordRef}
            onSubmitEditing={onSubmit}
            testID={'pwdInput'}
          />
          {!!errorMessage && (
            <View style={styles.errorContainer}>
              <Text>{errorMessage}</Text>
            </View>
          )}
          <Button style={styles.buttonSend} type='primary' onPress={onSubmit} testID={'loginBtn'}>
            Login
          </Button>
          <Link style={styles.linkForgotPassword} to={'/ForgotPassword'}>
            Forgot password?
          </Link>
        </View>
      )}
    </SafeArea>
  );
}
