import { Alert, Form, Input, Spin } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { changePassword } from '@features/Auth/authService';
import LoginLayout from '@/layouts/LoginLayout';
import Button from '@components/Button';
import Title from '@components/Typography/Title';
import Text from '@components/Typography/Text';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from '@hooks/reduxHooks';
import {
  login,
  loginSuccess,
} from '@learn-to-win/common/features/Auth/authSlice';
import './styles.scss';
import { LockOutlined } from '@ant-design/icons';
import PasswordRequirements from '@components/PasswordRequirements';
import { usePasswordRequirements } from '@learn-to-win/common/hooks/usePasswordRequirements';

type ChangePasswordInfo = {
  password: string;
  user: unknown;
};

const ChangePassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { error, loading, tempCognitoUser } = useSelector(
    (state) => state.auth,
  );
  const dispatch = useDispatch();
  const { passwordRequirements, areRequirementsMet } = usePasswordRequirements(
    password,
    confirmPassword,
  );

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    let userName = queryParameters.get('userName');
    const tempPassword = queryParameters.get('tempPassword');
    if (userName) {
      userName = userName.replace(/ /g, '+');
    }
    if (userName && tempPassword) {
      dispatch(login({ email: userName, password: tempPassword }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      navigate('/login');
    }
  }, [error, navigate]);

  const handleFormChange = () => {
    const { password, confirmPassword } = form.getFieldsValue();
    setPassword(password);
    setConfirmPassword(confirmPassword);
  };

  const handleSuccess = (user: any) => {
    dispatch(loginSuccess(user));
    navigate('/admin/dashboard');
  };

  const { mutate, isLoading, isError } = useMutation<
    unknown,
    unknown,
    ChangePasswordInfo
  >({
    mutationFn: async (values) => {
      const user = await changePassword(values);
      return user;
    },
    onSuccess: (user) => {
      handleSuccess(user);
    },
  });

  const onFormFinish = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        mutate({ password: values.password, user: tempCognitoUser });
      })
      .catch(() => {
        // no op
        // fields are highlighted red when button is clicked
      });
  }, [form, mutate, tempCognitoUser]);

  return (
    <LoginLayout>
      {isLoading || loading ? (
        <div className='login-form'>
          <Text classes='login-form__title'>Hang tight, almost there!</Text>
          <Spin className='login-form__loading' />
        </div>
      ) : (
        <Form.Provider onFormFinish={onFormFinish}>
          <Form onFieldsChange={handleFormChange} form={form}>
            {isError && <Alert description='An error occurred' type='error' />}
            <Title level={4} classes={'change-password__title'}>
              Change Temporary Password
            </Title>
            <Form.Item
              shouldUpdate
              name='password'
              className='change-password__input'>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder='New Password'
              />
            </Form.Item>
            <Form.Item shouldUpdate name='confirmPassword'>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder='Confirm Password'
              />
            </Form.Item>
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  disabled={!areRequirementsMet}
                  shape={'default'}
                  size={'middle'}
                  type={'primary'}
                  htmlType={'submit'}
                  classes='change-password__button'>
                  Update Password
                </Button>
              )}
            </Form.Item>
            <PasswordRequirements passwordRequirements={passwordRequirements} />
          </Form>
        </Form.Provider>
      )}
    </LoginLayout>
  );
};

export default ChangePassword;
