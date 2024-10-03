import { ChangeEvent, ReactNode } from 'react';
import './index.scss';
import {
  CheckCircleFilled,
  CheckSquareFilled,
  CloseCircleFilled,
} from '@ant-design/icons';
import classNames from 'classnames';
interface InputOptionProps {
  value: boolean;
  feedBackType?: 'success' | 'failure' | 'unmarked-correct' | null;
  label: ReactNode | string;
  type: 'radio' | 'checkbox';
  onChange: (event?: ChangeEvent<HTMLInputElement>) => void;
}
const InputOption: React.FC<InputOptionProps> = ({
  value,
  label,
  onChange,
  feedBackType,
  type,
}: InputOptionProps) => {
  return (
    <div
      className={classNames({
        'option-select': true,
        'option-select__success': feedBackType === 'success',
        'option-select__failure': feedBackType === 'failure',
        'option-select__selected': !feedBackType && value,
      })}>
      {(feedBackType === 'success' || feedBackType === 'unmarked-correct') &&
        type === 'radio' && (
          <CheckCircleFilled className={'option-select__input-success'} />
        )}
      {(feedBackType === 'success' || feedBackType === 'unmarked-correct') &&
        type === 'checkbox' && (
          <CheckSquareFilled className={'option-select__input-success'} />
        )}
      {feedBackType === 'failure' && ['radio', 'checkbox'].includes(type) && (
        <CloseCircleFilled className={'option-select__input-failure'} />
      )}
      <input
        data-testid={`input-option`}
        className={classNames({
          'option-select__input': true,
          'option-select__input--hidden': feedBackType !== null,
        })}
        type={type}
        checked={value}
        onChange={onChange}
      />
      {label}
    </div>
  );
};

export default InputOption;
