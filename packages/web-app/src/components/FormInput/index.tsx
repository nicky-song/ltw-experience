import { Input } from 'antd';
import { ChangeEventHandler, KeyboardEvent, ReactNode } from 'react';
import './styles.scss';
interface FormInputProps {
  placeholder?: string;
  value: string | number | readonly string[] | undefined;
  defaultValue?: string | number | readonly string[];
  onChange: ChangeEventHandler<HTMLInputElement>;
  onPressEnter?: (event: KeyboardEvent<HTMLInputElement>) => void;
  size: 'large' | 'middle' | 'small';
  showCount?:
    | boolean
    | {
        formatter: (info: {
          value: string;
          count: number;
          maxLength?: number;
        }) => ReactNode;
      };
  status?: 'error' | 'warning';
  maxLength?: number;
  className?: string;
}
function FormInput(props: FormInputProps) {
  return <Input data-testid='form-input' className={'form-input'} {...props} />;
}

export default FormInput;
