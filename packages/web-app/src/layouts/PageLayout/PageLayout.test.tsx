import PageLayout from '.';
import { render, screen } from '@testing-library/react';
import { MenuItem } from './types';

describe('content details layout', () => {
  it('should render children', () => {
    render(<PageLayout>layoutDetails</PageLayout>);
    expect(screen.getByText(/layoutDetails/)).toBeInTheDocument();
  });

  it('should render the sidebar with menu items', () => {
    const items: MenuItem[] = [
      { key: '1', icon: null, label: 'details-layout-one' },
      { key: '2', icon: null, label: 'details-layout-two' },
    ];
    render(<PageLayout.SideBar items={items} onCreate={() => null} />);
  });

  it('should render the flex container with its children', () => {
    render(
      <PageLayout.FlexContainer>layoutflexcontainer</PageLayout.FlexContainer>,
    );
    expect(screen.getByText(/layoutflexcontainer/)).toBeInTheDocument();
  });
});
