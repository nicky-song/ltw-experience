import React, { useState } from 'react';
import { Alert, Button, Form, Input, Space } from 'antd';
import { register } from '@features/Auth/authService';

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

interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName: string;
}

const Register: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Unknown Error');

  const onFinish = (formValues: UserFormValues): void => {
    const { firstName, lastName, email, password, organizationName } =
      formValues;
    register(firstName, lastName, email, password, organizationName).then(
      () => {
        setFailure(false);
        setErrorMsg('Unknown Error');
        setSuccess(true);
      },
      (error) => {
        setSuccess(false);
        setErrorMsg(error.response.data['hydra:description']);
        setFailure(true);
      },
    );
  };

  return (
    <Space direction='vertical'>
      {success && (
        <Alert
          message='Success'
          description='User created!'
          type='success'
          showIcon
          closable
        />
      )}
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
        name='register'
        onFinish={onFinish}
        autoComplete='off'>
        <Form.Item
          label='First Name'
          name='firstName'
          hasFeedback
          rules={[
            { required: true, message: 'Please input your first name!' },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item
          label='Last Name'
          name='lastName'
          hasFeedback
          rules={[{ required: true, message: 'Please input your last name!' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label='Email'
          name='email'
          hasFeedback
          rules={[
            {
              type: 'email',
              message: 'Please input a valid email',
            },
            {
              required: true,
              message: 'Please input your email!',
            },
          ]}>
          <Input placeholder='you@example.com' />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          hasFeedback
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item
          label='Organization Name'
          name='organizationName'
          hasFeedback
          rules={[
            { required: true, message: 'Please input your organization name!' },
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

export default Register;
