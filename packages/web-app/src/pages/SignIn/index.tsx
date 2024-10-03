import Button from '@components/Button';
import React, { useState, useEffect } from 'react';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from '@hooks/reduxHooks';
import { Alert, Form, Input, Spin, Typography } from 'antd';
import Link from '@components/Typography/Link';
import './styles.scss';
import LoginLayout from '@/layouts/LoginLayout';
import { login } from '@learn-to-win/common/features/Auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import Text from '@components/Typography/Text';
import { isValidEmail } from '@learn-to-win/common/utils/isValidEmail';
import {
  INVALID_EMAIL,
  MISSING_LOGIN_DETAILS,
  MISSING_EMAIL,
  MISSING_PASSWORD,
  INCORRECT_EMAIL_OR_PASSWORD,
  TECHNICAL_GLITCH,
} from '@learn-to-win/common/constants/validationMessages';

type ValidationStatus =
  | ''
  | 'validating'
  | 'success'
  | 'error'
  | 'warning'
  | undefined;

interface LoginInfo {
  email: string;
  password: string;
}
const SignIn: React.FC = () => {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendEmailStatus, setResendEmailStatus] =
    useState<ValidationStatus>();
  const [resendPasswordStatus, setResendPasswordStatus] =
    useState<ValidationStatus>();

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, loading, isAuthenticated, shouldChangePassword } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (error) {
      if (error.match(/Incorrect username or password/gi)) {
        setErrorMessage(INCORRECT_EMAIL_OR_PASSWORD);
      } else {
        setErrorMessage(TECHNICAL_GLITCH);
      }
      setShowError(true);
      setResendEmailStatus('error');
      setResendPasswordStatus('error');
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      //later, use role to determine which page to navigate to
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (shouldChangePassword) {
      navigate('/change-password');
    }
  }, [navigate, shouldChangePassword]);

  const handleClose = () => {
    setShowError(false);
  };

  const onFinish = (values: LoginInfo) => {
    const email = form.getFieldValue('email');
    const password = form.getFieldValue('password');
    setResendEmailStatus('');
    setResendPasswordStatus('');
    if (email && isValidEmail(email) === false) {
      setErrorMessage(INVALID_EMAIL);
      setResendEmailStatus('error');
    } else if (!email && !password) {
      setErrorMessage(MISSING_LOGIN_DETAILS);
      setResendEmailStatus('error');
      setResendPasswordStatus('error');
    } else if (!email) {
      setErrorMessage(MISSING_EMAIL);
      setResendEmailStatus('error');
    } else if (!password) {
      setErrorMessage(MISSING_PASSWORD);
      setResendPasswordStatus('error');
    } else {
      setErrorMessage('');
      const { email, password } = values;
      dispatch(login({ email, password }));
    }
  };

  return (
    <LoginLayout>
      {loading ? (
        <div className='login-form'>
          <Text classes='login-form__title'>Hang tight, almost there!</Text>
          <Spin className='login-form__loading' />
        </div>
      ) : (
        <Form
          name='login'
          className='login-form'
          initialValues={{ remember: true }}
          form={form}
          onFinish={onFinish}>
          <Form.Item>
            <Typography.Text
              data-testid='signInText'
              className='login-form__title'>
              Welcome to Learn To Win
            </Typography.Text>
          </Form.Item>
          <Form.Item
            hasFeedback
            validateStatus={resendEmailStatus}
            name='email'
            className='email'>
            <Input prefix={<UserOutlined />} placeholder='Email' />
          </Form.Item>
          <Form.Item
            hasFeedback
            validateStatus={resendPasswordStatus}
            name='password'>
            <Input.Password
              prefix={<LockOutlined />}
              type='password'
              placeholder='Password'
            />
          </Form.Item>
          {((error && showError) || errorMessage) && (
            <Form.Item>
              <Alert
                className='login-form__alert'
                type='error'
                message={errorMessage}
                closable
                afterClose={handleClose}
              />
            </Form.Item>
          )}
          <Button
            shape={'default'}
            size={'large'}
            disabled={false}
            data-testid='signInButton'
            type='primary'
            htmlType='submit'>
            Login
          </Button>
          <Link classes={'login-form__link'} href={'/forgot-password'}>
            Forgot Password
          </Link>
        </Form>
      )}
    </LoginLayout>
  );
};

export default SignIn;
