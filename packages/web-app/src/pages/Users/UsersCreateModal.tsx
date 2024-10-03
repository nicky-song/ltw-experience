import { Modal, Alert, Form, Input, Select } from 'antd';
import { getUsers, createUser } from '@features/Users/userSlice';
import { useAppDispatch, useAppSelector } from '@hooks/reduxHooks';
import { useEffect } from 'react';

interface UsersCreateModalProps {
  setIsModalOpen(initialState: boolean): void;
  isModalOpen: boolean;
}
function UsersCreateModal({
  setIsModalOpen,
  isModalOpen,
}: UsersCreateModalProps) {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleFormChange = () => {
    form
      .validateFields()
      .then((values) => {
        dispatch(createUser(values));
      })
      .catch((errorInfo) => {
        console.log('Validate Failed:', errorInfo);
      });
  };

  const { error, userCreated } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (userCreated) {
      form.resetFields();
      setIsModalOpen(false);
      dispatch(getUsers({ itemsPerPage: 50 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCreated]);

  return (
    <Modal
      title='Create User'
      open={isModalOpen}
      okText='Create'
      okButtonProps={{ className: 'button-create-user' }}
      onOk={handleFormChange}
      onCancel={handleCancel}>
      {error && (
        <Alert message='An error occurred' type='error' showIcon closable />
      )}
      <Form form={form}>
        <Form.Item name='firstName' hasFeedback>
          <Input placeholder='First Name' />
        </Form.Item>
        <Form.Item name='lastName' hasFeedback>
          <Input placeholder='Last Name' />
        </Form.Item>
        <Form.Item
          name='email'
          hasFeedback
          rules={[
            {
              pattern: /^[^@]+@[^@]+\.[^@]+$/g,
              required: true,
              message: 'Please input a valid email.',
            },
          ]}>
          <Input placeholder='Email' />
        </Form.Item>
        <Form.Item
          name='phoneNumber'
          hasFeedback
          rules={[
            {
              pattern:
                /^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/g,
              message: 'Please input a valid Phone Number.',
            },
          ]}>
          <Input placeholder='Phone Number' />
        </Form.Item>
        <Form.Item
          name='role'
          hasFeedback
          rules={[{ required: true, message: 'Please select a role.' }]}>
          <Select
            placeholder='Role'
            options={[
              { value: 'ORG_ROLE_LEARNER', label: 'Learner' },
              { value: 'ORG_ROLE_ANALYST', label: 'Analyst' },
              { value: 'ORG_ROLE_ADMIN', label: 'Admin' },
            ]}
          />
        </Form.Item>
        <Form.Item name='group' hasFeedback>
          <Select
            placeholder='Group'
            options={[
              { value: '1', label: 'Group 1' },
              { value: '2', label: 'Group 2' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UsersCreateModal;
