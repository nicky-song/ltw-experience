import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PageOverviewDrawer from '.';
import { MenuProps } from 'antd';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

describe('page overview drawer tests', () => {
  const slideOutItems: MenuProps['items'] = [
    {
      label: `Course Details`,
      key: '1',
    },
  ];
  it('should render a title and description when given itemdata', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PageOverviewDrawer
          key={'2'}
          onClose={jest.fn()}
          isDrawerOpen
          itemData={{ id: '2', title: 'fifteen', description: 'fiftytwo' }}
          menuItems={slideOutItems}
          defaultSelectedKeys={['1']}
          onFormSubmit={jest.fn()}
        />
      </QueryClientProvider>,
    );
    const titleInput = screen.getByTestId('page-overview-drawer-title');
    const descInput = screen.getByTestId('page-overview-drawer-desc');
    expect(titleInput).toHaveValue('fifteen');
    expect(descInput).toHaveValue('fiftytwo');
  });

  it('should call the onClose function prop', () => {
    const closeFunction = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <PageOverviewDrawer
          key={'2'}
          onClose={closeFunction}
          isDrawerOpen
          itemData={{ id: '2', title: 'fifteen', description: 'fiftytwo' }}
          menuItems={slideOutItems}
          defaultSelectedKeys={['1']}
          onFormSubmit={jest.fn()}
        />
      </QueryClientProvider>,
    );
    fireEvent.click(screen.getByTestId('form-button'));
    expect(closeFunction).toBeCalled();
  });

  it('should call form submit on type', async () => {
    const submitForm = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <PageOverviewDrawer
          key={'2'}
          onClose={jest.fn()}
          isDrawerOpen
          itemData={{ id: '2', title: 'fifteen', description: 'fiftytwo' }}
          menuItems={slideOutItems}
          defaultSelectedKeys={['1']}
          onFormSubmit={submitForm}
        />
      </QueryClientProvider>,
    );

    const titleInput = screen.getByTestId('page-overview-drawer-title');
    const descInput = screen.getByTestId('page-overview-drawer-desc');
    fireEvent.change(titleInput, { target: { value: 'epictitle' } });
    await waitFor(() => {
      expect(submitForm).toBeCalled();
    });
    fireEvent.change(descInput, { target: { value: 'epicdesc' } });
    await waitFor(() => {
      expect(submitForm).toBeCalled();
    });
    expect(titleInput).toHaveValue('epictitle');
    expect(descInput).toHaveValue('epicdesc');
  });
});
