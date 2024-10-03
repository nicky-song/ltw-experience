import { render, screen } from '@testing-library/react';
import TableViewLayout from '.';
import { defineWindowMatchMedia } from '@/utils/testUtils';

defineWindowMatchMedia();

describe('TableViewLayout Component', () => {
  it('should render the dashboard', () => {
    render(
      <TableViewLayout
        dataSource={[{ id: '1', name: 'testName' }]}
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
          },
        ]}
        title={'Hello World'}
      />,
    );
    expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
    expect(screen.getByText('testName')).toBeInTheDocument();
  });
});
