import React, { useCallback, useEffect, useState } from 'react';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from '@hooks/reduxHooks';
import { getUsers, User } from '@features/Users/userSlice';
import { Modal, Form, Checkbox, Alert } from 'antd';
import { useMutation } from 'react-query';
import { createCourseInvitations } from '@learn-to-win/common/features/Enrollments/enrollmentService';
import CheckBoxForm from '@components/CheckBoxForm/CheckBoxForm';

type InviteLearnerModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  courseId: string;
  adminId: string;
};
const InviteLearnerModal: React.FC<InviteLearnerModalProps> = ({
  isOpen,
  setIsOpen,
  courseId,
  adminId,
}: InviteLearnerModalProps) => {
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {
    mutate,
    isLoading: createInvitationsLoading,
    isError: createInvitationsError,
  } = useMutation<unknown, unknown, string[] | undefined>({
    mutationFn: async (userIds) => {
      setInviteSuccess(false);
      /*
        Temporary..this should be changed to send a collection of user ids
        and not multiple requests for each user id
      */
      for (const userId of userIds ?? []) {
        await createCourseInvitations(
          userId,
          '1edd401b-4f47-6b0c-af14-f7a89e373a72',
          courseId,
          adminId,
        );
      }
    },
    onSuccess: () => {
      form.resetFields();
      setInviteSuccess(true);
    },
  });
  const { users } = useSelector((state) => state.user);

  useEffect(() => {
    // Todo: Lazy load/infinite scroll or pagination...
    dispatch(getUsers({ itemsPerPage: 100 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // Todo: Remove when toasts are implemented
  useEffect(() => {
    const closeSuccess = setTimeout(() => {
      setInviteSuccess(false);
    }, 2500);
    return () => {
      clearTimeout(closeSuccess);
    };
  }, [inviteSuccess]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    form.resetFields();
  }, [form, setIsOpen]);

  const onSubmit = () => {
    const formSelectedUsers = form.getFieldsValue();
    const usersToEnroll = users
      ?.filter((user: User) => formSelectedUsers[user.id])
      .map((user: User) => user.id);
    mutate(usersToEnroll);
  };

  return (
    <Modal
      title='Invite Learner'
      open={isOpen}
      onCancel={closeModal}
      onOk={onSubmit}
      okText='Invite'
      okButtonProps={{
        type: 'primary',
        htmlType: 'button',
        shape: 'default',
        size: 'middle',
        loading: createInvitationsLoading,
      }}>
      <CheckBoxForm form={form} title={users?.length + ' Learners'}>
        {users?.map((user: User) => (
          <Form.Item key={user.id} name={user.id} valuePropName='checked'>
            <Checkbox onClick={() => form.setFieldValue('all', false)}>
              {user.email}
            </Checkbox>
          </Form.Item>
        ))}
      </CheckBoxForm>
      {createInvitationsError && (
        <Alert message={'There was an error'} type='error' />
      )}
      {inviteSuccess && (
        <Alert message={'Successfully Invited User(s)'} type='success' />
      )}
    </Modal>
  );
};

export default InviteLearnerModal;
