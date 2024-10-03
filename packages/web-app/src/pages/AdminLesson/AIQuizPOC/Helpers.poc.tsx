import React, { useState } from 'react';
import { Alert, Radio, Space } from 'antd';
import classNames from 'classnames';

export type Question = {
  question: string;
  choices: string[];
  answer?: string;
};
export const MultipleChoiceQuizCard: React.FC<{
  question: Question;
  isDisabled: boolean;
  onClick: () => void;
}> = ({ question, isDisabled, onClick }) => {
  const [value, setValue] = useState();

  const isAnswered = value !== undefined;
  const isCorrect = isAnswered && question?.choices[value] === question?.answer;
  return (
    <Slide
      className={classNames(
        'card-container',
        'card-container__card-component',
        isDisabled && 'card-container__not-editable',
      )}
      onClick={onClick}>
      <Title>{question?.question}</Title>
      <Radio.Group
        onChange={(e) => setValue(e.target.value)}
        value={value}
        style={{ width: '100%' }}>
        <Space
          direction='vertical'
          style={{
            width: '100%',
          }}>
          {question?.choices.map((choice, i) => (
            <Radio
              key={i}
              value={i}
              className={'ai-quiz__question-option'}
              style={{
                margin: '8px 0',
                padding: '16px',
                borderRadius: '8px',

                width: '100%',
              }}>
              {choice}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
      <div style={{ margin: '8px 0', width: '100%' }}>
        {isAnswered &&
          (isCorrect ? (
            <Alert message='Correct' type='success' showIcon />
          ) : (
            <Alert message='Incorrect' type='error' showIcon />
          ))}
      </div>
    </Slide>
  );
};
const Slide: React.FC<{
  buttonText?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, buttonText = 'Continue', className, onClick }) => {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        justifyContent: 'start',
        alignItems: 'start',
        alignContent: 'start',
      }}>
      {children}
    </div>
  );
};
const Title = ({ children }: { children: React.ReactNode }) => {
  return (
    <h2
      style={{
        fontWeight: 'bold',
        // // fontSize: 20,
        // lineHeight: 1.5,
      }}>
      {children}
    </h2>
  );
};

export function randomID() {
  return Math.random().toString(36).substring(7);
}

export const CardSpacer: React.FC = () => {
  return (
    <div className={'header-container__card-container__card-spacer'}>
      &nbsp;
    </div>
  );
};
