import { Button, Card, Modal, Form, Input, FormInstance } from 'antd';
import { useMutation } from 'react-query';
import {
  ArrowRightOutlined,
  ReadOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  DownOutlined,
  UpOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { createLearningItem } from '@learn-to-win/common/features/LearningItems/learningItemService';
import './index.scss';
import { useState, useRef } from 'react';
import { AICourseCreatePoc } from './CreateAILessonPOC/AICourseCreate.poc';
import { LearningItemType } from '@learn-to-win/common/constants';
import SubmitButton from '@components/Button';
import { addLearningItem } from '@learn-to-win/common/features/LearningItems/learningItemSlice';
import { useAppDispatch } from '@hooks/reduxHooks';
import { CreateLearningItem } from '@learn-to-win/common/features/LearningItems/learningItemTypes';

type CreateLearningItemModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

type CreateLearningItemValues = {
  type: string;
  state: string;
  courseId: string;
  name: string;
  description: string;
};

type LearningItemFormProps = {
  formRef: React.Ref<FormInstance>;
  learningItemType: LearningItemType;
  setFormSubmitEnabled: (enabled: boolean) => void;
};

const learningItemDefaults = {
  lesson: {
    name: 'Lesson Name',
    description:
      "This is your lesson description. Give your learners an idea of what they're about to learn!",
  },
  quiz: {
    name: 'Quiz Name',
    description:
      "This is your quiz description. Give your learners an idea of what they're about to learn!",
  },
};

export const CreateLearningItemModal: React.FC<
  CreateLearningItemModalProps
> = ({ isOpen, setIsOpen }) => {
  const [showForm, setShowForm] = useState(false);
  const dispatch = useAppDispatch();

  const [learningItemType, setLearningItemType] = useState<LearningItemType>(
    LearningItemType.LESSON || LearningItemType.QUIZ,
  );
  const [formSubmitEnabled, setFormSubmitEnabled] = useState(false);
  const formRef = useRef<FormInstance>(null);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { mutate } = useMutation<unknown, unknown, CreateLearningItemValues>({
    mutationFn: async (values) => {
      const res = await createLearningItem(values);
      if (res) {
        // adding LearningItem to redux store on creation for use within the edit lesson page
        dispatch(addLearningItem(res as CreateLearningItem));
        navigate('/learning_item/' + res?.id);
        handleCancel();
      }
    },
  });

  const makeLearningItem = () => {
    const formData = formRef.current?.getFieldsValue();
    if (courseId) {
      mutate({
        courseId,
        state: 'draft',
        type: learningItemType,
        name: formData[`${learningItemType}Name`],
        description:
          formData[`${learningItemType}Description`] ??
          learningItemDefaults[`${learningItemType}`].description,
      });
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setShowForm(false);
    setFormSubmitEnabled(false);
  };

  const handleClick = (type: LearningItemType) => {
    if (learningItemType === type) {
      setShowForm(!showForm);
    } else {
      setShowForm(true);
    }
    setLearningItemType(type);
  };

  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <Modal
      title='Add New'
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      closeIcon={<CloseOutlined />}
      className='create-learning-item__modal'>
      <div className='create-learning-item__container'>
        <Card
          hoverable
          onClick={() => handleClick(LearningItemType.LESSON)}
          bodyStyle={{ padding: '16px' }}>
          <div className='card'>
            <div className='card__icon'>
              <ReadOutlined />
            </div>
            <div className='card__text'>
              <h3>Lesson</h3>
              <p>
                Deliver an engaging learning experience with vibrant images and
                immersive videos, and audio.
              </p>
            </div>
            <Button
              type='text'
              htmlType='button'
              size='middle'
              icon={
                <div className='arrow-icon'>
                  {showForm && learningItemType === LearningItemType.LESSON ? (
                    <UpOutlined />
                  ) : (
                    <DownOutlined />
                  )}
                </div>
              }
              className='card__button'
              data-testid='open-lesson-form'
            />
          </div>
        </Card>
      </div>
      {showForm && learningItemType === LearningItemType.LESSON && (
        <LearningItemForm
          formRef={formRef}
          learningItemType={learningItemType}
          setFormSubmitEnabled={setFormSubmitEnabled}
        />
      )}
      <div className='create-learning-item__container'>
        <Card
          hoverable
          onClick={() => setIsAIOpen(true)}
          bodyStyle={{ padding: '16px' }}>
          <div className='card'>
            <div className='card__icon ai-icon'>
              <RobotOutlined />
            </div>
            <div className='card__text'>
              <h3>AI Generated Lesson</h3>
              <p>
                Unlock Your Teaching Superpowers! Effortlessly Create Engaging
                Lessons with the click of a button.
              </p>
            </div>
            <Button
              type='text'
              shape='circle'
              htmlType='button'
              size='middle'
              icon={
                <div className='arrow-icon'>
                  <ArrowRightOutlined />
                </div>
              }
            />
          </div>
        </Card>
      </div>
      <div className='create-learning-item__container'>
        <Card
          hoverable
          onClick={() => handleClick(LearningItemType.QUIZ)}
          bodyStyle={{ padding: '16px' }}>
          <div className='card'>
            <div className='card__icon quiz-icon'>
              <ThunderboltOutlined />
            </div>
            <div className='card__text'>
              <h3>Quiz</h3>
              <p>
                Ensure mastery of the course material by creating an
                interactiove quiz to assess competency.
              </p>
            </div>
            <Button
              type='text'
              htmlType='button'
              size='middle'
              icon={
                <div className='arrow-icon'>
                  {showForm && learningItemType === LearningItemType.QUIZ ? (
                    <UpOutlined />
                  ) : (
                    <DownOutlined />
                  )}
                </div>
              }
              className='card__button'
              data-testid='open-quiz-form'
            />
          </div>
        </Card>
      </div>
      {showForm && learningItemType === LearningItemType.QUIZ && (
        <LearningItemForm
          formRef={formRef}
          learningItemType={learningItemType}
          setFormSubmitEnabled={setFormSubmitEnabled}
        />
      )}

      <Form.Item shouldUpdate className='card__submit-container'>
        <SubmitButton
          disabled={!formSubmitEnabled}
          shape={'default'}
          size={'middle'}
          type={'primary'}
          htmlType={'submit'}
          onClick={() => makeLearningItem()}
          classes='card__submit-button'
          data-testid='create-learning-item'>
          Create
        </SubmitButton>
      </Form.Item>

      <Modal
        open={isAIOpen}
        footer={null}
        onCancel={() => setIsAIOpen(false)}
        closable={false}>
        <AICourseCreatePoc />
      </Modal>
    </Modal>
  );
};

const LearningItemForm: React.FC<LearningItemFormProps> = ({
  formRef,
  learningItemType,
  setFormSubmitEnabled,
}) => {
  const [form] = Form.useForm();
  const handleFieldsChange = () => {
    const values = form.getFieldsValue();
    setFormSubmitEnabled(!!values[`${learningItemType}Name`]);
  };

  return (
    <Form
      ref={formRef}
      form={form}
      onFieldsChange={handleFieldsChange}
      className='card__form'>
      <Form.Item name={`${learningItemType}Name`}>
        <Input placeholder={learningItemDefaults[`${learningItemType}`].name} />
      </Form.Item>
      <Form.Item name={`${learningItemType}Description`}>
        <Input.TextArea
          rows={5}
          placeholder={learningItemDefaults[`${learningItemType}`].description}
        />
      </Form.Item>
    </Form>
  );
};
