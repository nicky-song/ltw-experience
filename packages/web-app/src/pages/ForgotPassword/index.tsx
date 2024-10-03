import { Alert, Form, Input } from 'antd';
import Button from '@components/Button';
import Title from '@components/Typography/Title';
import Link from '@components/Typography/Link';
import './styles.scss';
import { Fragment, useState, useCallback } from 'react';
import LoginLayout from '@/layouts/LoginLayout';
import { forgotPassword } from '@features/Auth/authService';
import { UserOutlined } from '@ant-design/icons';
import { isValidEmail } from '@learn-to-win/common/utils/isValidEmail';

type ValidationStatus =
  | ''
  | 'validating'
  | 'success'
  | 'error'
  | 'warning'
  | undefined;

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<ValidationStatus>();
  const [errorMessage, setErrorMessage] = useState('');
  const [form] = Form.useForm();
  const onFormFinish = useCallback((): void => {
    const email = form.getFieldValue('email');
    const messageATryAgain = 'Please try again';
    setResendStatus('error');
    if (email && isValidEmail(email) === false) {
      setErrorMessage('Invalid email. ' + messageATryAgain);
    } else if (!email) {
      setErrorMessage('Email is missing. ' + messageATryAgain);
    } else {
      setEmail(email);
      setResendStatus('validating');
      forgotPassword(email)
        .then(() => {
          setResendStatus('success');
        })
        .catch(() => {
          setResendStatus('error');
        });
    }
  }, [form]);

  const handleClose = () => {
    setErrorMessage('');
  };

  return (
    <LoginLayout>
      <Form.Provider onFormFinish={onFormFinish}>
        <Form form={form} className='login-form'>
          {resendStatus === 'success' ? (
            <div className='check-email-container'>
              <Title level={4} classes={'reset-password-title'}>
                Check Your Email
              </Title>
              <Title level={5} classes={'reset-password-title'}>
                If an account is associated with the provided email, you&apos;ll
                receive instructions to reset your password. Please remember to
                check your spam folder if you don&apos;t see it in your inbox.
              </Title>
              <Title level={5} classes={'reset-password-title'}>
                {`${email}`}
              </Title>
              <Button
                classes='back-to-log-in'
                shape={'default'}
                size={'middle'}
                type={'primary'}
                htmlType={'submit'}
                href={'/login'}>
                Back to Log in
              </Button>
            </div>
          ) : (
            <Fragment>
              <Title level={4} classes={'reset-password-title'}>
                Forgot your Password?
              </Title>
              <Title level={5} classes={'reset-password-title'}>
                Enter the email you use for Learn to Win
              </Title>
              <Form.Item
                shouldUpdate
                name='email'
                hasFeedback
                validateStatus={resendStatus}>
                <Input
                  prefix={<UserOutlined />}
                  placeholder='Email'
                  size={'middle'}
                />
              </Form.Item>
              {!!errorMessage && (
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
                size={'middle'}
                type={'primary'}
                htmlType={'submit'}>
                Send Instructions
              </Button>
              <Link href={'/login'} classes={'back-to-sign-in'}>
                Back to Log In
              </Link>
            </Fragment>
          )}
        </Form>
      </Form.Provider>
    </LoginLayout>
  );
}

export default ForgotPassword;
