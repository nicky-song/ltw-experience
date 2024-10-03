import { Text } from '@ant-design/react-native';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import styles from './ResetPassword.styles';
import { useState } from 'react';
import { useMutation } from 'react-query';
import {
  changePassword,
  getAllUserInfo,
} from '../../features/Auth/authService';
import { FullScreenActivityIndicator } from '../../components/ActivityIndicator/FullScreenActivityIndicator';
import { NewPasswordPrompt } from '../../components/NewPasswordPrompt';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { loginSuccess } from '@learn-to-win/common/features/Auth/authSlice';
import { UserResponse } from '@learn-to-win/common/types/UserServiceTypes';

export function ChangeTempPassword() {
  const [isChangeSuccess, setIsChangeSuccess] = useState(false);
  const { tempCognitoUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { mutate, isLoading, isError } = useMutation<
    UserResponse,
    unknown,
    string
  >({
    mutationFn: async (password) => {
      await changePassword({ cognitoUser: tempCognitoUser, password });
      const userData = await getAllUserInfo();
      setIsChangeSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return userData;
    },
    onSuccess: (user) => {
      dispatch(loginSuccess(user));
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
                ? 'Your Password Is Secure\nAnd You’re All Set!'
                : 'Hang tight, almost there!'
            }
          />
        ) : (
          <>
            <Text style={styles.textHeader}>Change Temp Password</Text>
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
