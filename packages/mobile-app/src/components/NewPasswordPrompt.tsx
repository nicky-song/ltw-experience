import { Control, FieldPath, useController, useForm } from 'react-hook-form';
import { usePasswordRequirements } from '@learn-to-win/common/hooks/usePasswordRequirements';
import { Button, Text } from '@ant-design/react-native';
import styles from '../pages/ResetPassword/ResetPassword.styles';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { ComponentProps } from 'react';
import Input from './input';

export function NewPasswordPrompt({
  onResetPassword,
}: {
  onResetPassword: (pass: string) => void;
}) {
  const { control, handleSubmit, setFocus, watch, register } = useForm<{
    password: string;
    confirmPassword: string;
  }>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // watch is needed at this level so changes to fields trigger a re-render for usePasswordRequirements
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const { passwordRequirements, areRequirementsMet } = usePasswordRequirements(
    password,
    confirmPassword,
  );

  register('password', { required: true, validate: () => areRequirementsMet });
  register('confirmPassword', {
    required: true,
    validate: () => areRequirementsMet,
  });
  return (
    <>
      <ControlledInput
        control={control}
        // WIP: Figure out why reset password input is not filling passwords in both fields
        name={'password'}
        password
        autoComplete={'new-password'}
        iconName={'lock-outline'}
        placeholder={'New Password'}
        returnKeyType={'next'}
        onSubmitEditing={() => setFocus('confirmPassword')}
      />
      <ControlledInput
        control={control}
        name={'confirmPassword'}
        password
        autoComplete={'new-password'}
        iconName={'lock-outline'}
        placeholder={'Confirm Password'}
        returnKeyType={'done'}
        onSubmitEditing={handleSubmit(() => onResetPassword(password))}
      />
      <Button
        style={styles.buttonSend}
        type='primary'
        onPress={handleSubmit(() => onResetPassword(password))}
        testID={'new-password-button'}
      >
        Update Password
      </Button>
      <View>
        {passwordRequirements.map(([requirement, isMet]) => (
          <View key={requirement} style={styles.passRequirement}>
            <Text>{requirement}</Text>
            <Text>
              {isMet ? (
                <Icon
                  name={'checkcircle'}
                  size={20}
                  color={'rgba(111, 192, 122, 1)'}
                />
              ) : (
                <Icon
                  name={'closecircle'}
                  size={20}
                  color={'rgba(0, 0, 0, 0.45)'}
                />
              )}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

type ControlledInputProps<TFieldValues, TContext> = {
  control: Control<TFieldValues, TContext>;
  // name: FieldPath<TFieldValues>;
  name: FieldPath<TFieldValues>;
} & Omit<
  ComponentProps<typeof Input>,
  'value' | 'onChange' | 'onBlur' | 'validateStatus'
>;
const ControlledInput = <T, T2>({
  control,
  name,
  ...rest
}: ControlledInputProps<T, T2>) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { invalid },
  } = useController({
    control,
    name,
  });
  return (
    <Input
      value={String(value)}
      onChangeText={onChange}
      onBlur={onBlur}
      validateStatus={invalid}
      ref={ref}
      {...rest}
    />
  );
};
