import { Checkbox, Form, FormInstance } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { ReactNode, useState, useCallback } from 'react';
import './index.scss';
type FormValue = {
  [key: string]: string;
};

interface CheckBoxFormProps {
  form: FormInstance<FormValue>;
  children: ReactNode;
  title: string;
}

function CheckBoxForm({ form, title, children }: CheckBoxFormProps) {
  const [selectAll, setSelectAll] = useState(false);

  const selectAllItems = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      const checked = (e.target as HTMLInputElement).checked;
      const items = form.getFieldsValue();
      Object?.keys(items)?.forEach((id) => {
        form.setFieldValue(id, checked);
      });
      setSelectAll(checked);
    },
    [form],
  );
  return (
    <Form form={form} className={'checkbox-form'}>
      <div className={'checkbox-form__container'}>
        <Form.Item key={'all'} name={'all'} valuePropName='checked'>
          <Checkbox checked={selectAll} onClick={selectAllItems}>
            <DownOutlined /> {title}
          </Checkbox>
        </Form.Item>
        <ul className={'checkbox-form__list'}>{children}</ul>
      </div>
    </Form>
  );
}

export default CheckBoxForm;
