import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { forwardRef, useState } from 'react';
import { View, StyleSheet, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  iconName?: string;
  password?: boolean;
  hasFeedbackError?: boolean;
  validateStatus?: boolean;
}

const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    iconName,
    password,
    hasFeedbackError,
    validateStatus,
    ...props
  }: InputProps,
  ref,
) {
  const [hidePassword, setHidePassword] = useState(password);
  return (
    <View style={{ marginBottom: 24 }}>
      <View
        style={[
          style.inputContainer,
          validateStatus ? style.inputErrorContainerColor : null,
        ]}>
        {!!iconName && (
          <Icon
            name={iconName}
            style={[
              style.emailIcon,
              validateStatus ? style.errorColor : style.defaultColor,
            ]}
          />
        )}
        <TextInput
          ref={ref}
          secureTextEntry={hidePassword}
          style={style.inputText}
          {...props}
        />
        {password && (
          <Icon
            onPress={() => setHidePassword(!hidePassword)}
            name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
            style={[style.passwordIcon, style.defaultColor]}
          />
        )}
        {hasFeedbackError && (
          <Icon
            name='close-circle'
            style={[style.feedbackIcon, style.errorColor]}
          />
        )}
      </View>
    </View>
  );
});

const style = StyleSheet.create({
  inputContainer: {
    height: 40,
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'grey',
    width: '100%',
    alignItems: 'center',
  },
  inputText: {
    flex: 1,
    height: '100%'
  },
  inputErrorContainerColor: {
    borderColor: '#FF4D4F',
  },
  emailIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  passwordIcon: {
    fontSize: 22,
  },
  feedbackIcon: {
    marginLeft: 10,
    fontSize: 16,
  },
  errorColor: {
    color: '#FF4D4F',
  },
  defaultColor: {
    color: 'grey',
  },
});

export default Input;
