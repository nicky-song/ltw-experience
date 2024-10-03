import React, { useState } from 'react';
import { Alert, Button, Form, Input, Space } from 'antd';
import { confirmEmail } from '@features/Auth/authService';
import { useSearchParams, Navigate } from 'react-router-dom';

/*
http://localhost:3000/confirmUser?client_id=061cdf2b-2f02-44a4-9bfb-4a1347819c11&user_name=sbengtson+user99@learntowin.com&confirmation_code=123456
https://<your user pool domain>/confirmUser/?client_id=abcdefg12345678&user_name=emailtest&confirmation_code=123456
https://l2w-athena-dev.auth.us-west-2.amazoncognito.com/confirmUser?client_id=15epggdqj9jse35oamokdpm45i&user_name=20352107-ca69-4f6a-a1f2-66f6873efea7&confirmation_code=679657
*/

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

interface ConfirmEmailFormValues {
  code: string;
}

const ConfirmEmail: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | undefined>('Unknown Error');

  const onFinish = async (
    formValues: ConfirmEmailFormValues,
  ): Promise<void> => {
    const { code } = formValues;
    try {
      await confirmEmail(code, searchParams.get('client_id') ?? '');
      setSuccess(true);
    } catch (error: unknown) {
      setFailure(true);
      setErrorMsg(error?.toString());
      return;
    }
  };

  if (success) {
    return <Navigate replace to='/login' />;
  }

  return (
    <Space direction='vertical'>
      {failure && (
        <Alert
          message='Error'
          description={errorMsg}
          type='error'
          showIcon
          closable
        />
      )}
      <Form
        {...formItemLayout}
        name='confirmEmail'
        onFinish={onFinish}
        autoComplete='off'
        initialValues={{ code: searchParams.get('confirmation_code') }}>
        <Form.Item
          label='Code'
          name='code'
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please input your confirmation code!',
            },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 4 }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default ConfirmEmail;
