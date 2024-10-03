import React, { ReactNode } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Alert, Row, Table } from 'antd';
import Button from '@components/Button';
import './index.scss';

interface TableProps {
  dataSource: undefined | readonly any[];
  columns: object[];
  title?: string;
  backUrl?: string;
  createResource?(): void;
  createButtonText?: string;
  children?: ReactNode;
  loading?: boolean;
  error?: string | null | unknown;
  navigate?: (
    record: { key: string },
    rowIndex: number | undefined,
  ) => () => null;
  rowKey?: string;
}
const TableViewLayout: React.FC<TableProps> = ({
  dataSource,
  columns,
  title,
  backUrl,
  createResource,
  createButtonText = 'Create',
  loading,
  error,
  navigate,
  rowKey = 'key',
}: TableProps) => {
  return (
    <div className='table-dashboard-container'>
      <Row className='table-dashboard-container__header'>
        <div className='table-dashboard-container__header-buttons'>
          {!!backUrl && (
            <Button
              htmlType='button'
              shape={'default'}
              disabled={false}
              size={'middle'}
              type={'primary'}
              classes={'table-dashboard-container__back-button'}
              href={backUrl}
              icon={<ArrowLeftOutlined />}></Button>
          )}
          <h1>{title}</h1>
        </div>
        {!!createResource && (
          <Button
            htmlType='button'
            shape={'default'}
            disabled={false}
            size={'middle'}
            type={'primary'}
            onClick={createResource}>
            {createButtonText}
          </Button>
        )}
      </Row>
      {!!error && (
        <Alert
          message='Error'
          description={'An Error Occured'}
          type='error'
          showIcon
          closable
        />
      )}
      <Table
        size='middle'
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        rowKey={rowKey}
        onRow={(record, rowIndex) => {
          return {
            onClick: navigate ? navigate(record, rowIndex) : () => null,
          };
        }}
      />
    </div>
  );
};

export default TableViewLayout;
