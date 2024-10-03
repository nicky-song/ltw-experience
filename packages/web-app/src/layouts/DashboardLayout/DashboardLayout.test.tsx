import { render, screen } from '@testing-library/react';
import DashboardLayout from '.';

jest.mock('./NavigationBar');

describe('Dashboard Component', () => {
  it('should render the dashboard component', () => {
    render(
      <DashboardLayout>
        <div>Hello World</div>
      </DashboardLayout>,
    );
    expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
  });
});
