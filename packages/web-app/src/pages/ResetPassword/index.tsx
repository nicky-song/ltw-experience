import { Form, Input, Alert, Spin } from 'antd';
import Button from '@components/Button';
import Title from '@components/Typography/Title';
import Text from '@components/Typography/Text';
import './styles.scss';
import { Fragment, useCallback, useState } from 'react';
import { resetPassword } from '@features/Auth/authService';
import { useNavigate } from 'react-router-dom';
import LoginLayout from '@/layouts/LoginLayout';
import { LockOutlined } from '@ant-design/icons';
import PasswordRequirements from '@components/PasswordRequirements';
import { useMutation } from 'react-query';
import { MobilePaths, useMobileRedirect } from '@hooks/useMobileRedirect';
import { usePasswordRequirements } from '@learn-to-win/common/hooks/usePasswordRequirements';

type ResetPasswordInfo = {
  userID: string;
  code: string;
  password: string;
};

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { passwordRequirements, areRequirementsMet } = usePasswordRequirements(
    password,
    confirmPassword,
  );

  useMobileRedirect(MobilePaths.ResetPassword);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { mutate, isLoading, isError } = useMutation<
    unknown,
    unknown,
    ResetPasswordInfo
  >({
    mutationFn: async (values) => {
      await resetPassword(values.userID, values.code, values.password);
    },
    onSuccess: () => {
      navigate('/login');
    },
  });

  const onFormFinish = useCallback((): void => {
    const queryParameters = new URLSearchParams(window.location.search);
    const userID = queryParameters.get('id');
    const code = queryParameters.get('code');
    if (userID !== null && code !== null) {
      mutate({ userID, code, password });
    }
  }, [mutate, password]);

  const handleFormChange = () => {
    const { password, confirmPassword } = form.getFieldsValue();
    setPassword(password);
    setConfirmPassword(confirmPassword);
  };

  return (
    <LoginLayout>
      {isLoading ? (
        <div className='login-form'>
          <Text classes='login-form__title'>
            Password Successfully Changed! Taking You To Login
          </Text>
          <Spin className='login-form__loading' />
        </div>
      ) : (
        <Form.Provider onFormFinish={onFormFinish}>
          <Form
            onFieldsChange={handleFormChange}
            form={form}
            className='login-form'>
            <Title level={4} classes={'password-reset-title'}>
              Reset Your Password
            </Title>
            <Fragment>
              <Form.Item shouldUpdate name='password'>
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder='New Password'
                  value={password}
                  size={'middle'}
                />
              </Form.Item>
              <Form.Item shouldUpdate name='confirmPassword'>
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder='Confirm Password'
                  value={confirmPassword}
                  size={'middle'}
                />
              </Form.Item>
              {isError && (
                <Alert
                  showIcon
                  className='alert-message'
                  message='An Error Occurred'
                  type='error'
                />
              )}
              <Button
                disabled={!areRequirementsMet}
                shape={'default'}
                size={'middle'}
                type={'primary'}
                htmlType={'submit'}>
                Reset Password
              </Button>
              <PasswordRequirements
                passwordRequirements={passwordRequirements}
              />
            </Fragment>
          </Form>
        </Form.Provider>
      )}
    </LoginLayout>
  );
}

export default ResetPassword;
