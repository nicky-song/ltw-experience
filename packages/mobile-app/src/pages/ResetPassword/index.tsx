import { Text } from '@ant-design/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import styles from './ResetPassword.styles';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { resetPassword } from '../../features/Auth/authService';
import { FullScreenActivityIndicator } from '../../components/ActivityIndicator/FullScreenActivityIndicator';
import { NewPasswordPrompt } from '../../components/NewPasswordPrompt';

export function ResetPassword() {
  const route = useRoute();
  const navigation = useNavigation();
  const code = route.params['code'];
  const userID = route.params['id'];

  const [isChangeSuccess, setIsChangeSuccess] = useState(false);

  const { mutate, isLoading, isError } = useMutation<unknown, unknown, string>({
    mutationFn: async (password) => {
      await resetPassword(userID, code, password);
      setIsChangeSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    },
    onSuccess: () => {
      navigation.goBack();
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {isLoading ? (
          <FullScreenActivityIndicator
            text={
              isChangeSuccess
                ? 'Password Successfully Changed!\n\nTaking You To Login'
                : 'Hang tight, almost there!'
            }
          />
        ) : (
          <>
            <Text style={styles.textHeader}>Reset Your Password</Text>
            {!!isError && (
              <View style={styles.errorContainer}>
                <Text>An error occurred</Text>
              </View>
            )}
            <NewPasswordPrompt onResetPassword={(pass) => mutate(pass)} />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
