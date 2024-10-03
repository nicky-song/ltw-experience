import { Modal, Input, Form, Alert } from 'antd';
import { useCallback } from 'react';
import { useMutation } from 'react-query';
import { createCourse } from '@learn-to-win/common/features/Courses/coursesService';
import { useAppDispatch as useDispatch } from '@hooks/reduxHooks';
import { getCoursesAction } from '@learn-to-win/common/features/Courses/courseSlice';

type CreateCourseModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

type FormValues = {
  title: string;
  description?: string;
};

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const closeModal = useCallback(() => {
    setIsOpen(false);
    form.resetFields();
  }, [setIsOpen, form]);

  const { mutate, isLoading, isError } = useMutation<
    unknown,
    unknown,
    FormValues
  >({
    mutationFn: async (values) => {
      await createCourse({
        ...values,
        organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
        // To remove when organization feature is implemented
      });
      // TODO: Correct org ID
      dispatch(
        getCoursesAction({
          organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
        }),
      );
    },
    onSuccess: closeModal,
  });

  const handleValidation = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        mutate(values);
      })
      .catch(() => {
        // no op
        // fields are highlighted red when button is clicked
      });
  }, [form, mutate]);

  return (
    <Modal
      title='Create Course'
      open={isOpen}
      onOk={handleValidation}
      onCancel={closeModal}
      okText='Create'
      okButtonProps={{
        type: 'primary',
        htmlType: 'button',
        shape: 'default',
        size: 'middle',
        loading: isLoading,
      }}>
      {isError && <Alert description='Error creating course' type='error' />}
      <Form<FormValues>
        form={form}
        name='create-course'
        layout='vertical'
        onFinish={mutate}>
        <Form.Item
          label='Course Title'
          name='title'
          hasFeedback
          rules={[{ required: true, message: 'Please input a course title' }]}>
          <Input placeholder='Course Title' />
        </Form.Item>
        <Form.Item label='Course Description' name='description'>
          <Input.TextArea placeholder='Course Description' />
        </Form.Item>
      </Form>
    </Modal>
  );
};
