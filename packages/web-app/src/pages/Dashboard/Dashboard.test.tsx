import { render, screen } from '@testing-library/react';
import AdminDashboard from '.';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useLocation: () => ({
    pathname: 'path',
  }),
}));

describe('AdminDashboard Component', () => {
  it('should render the AdminDashboard component', async () => {
    render(<AdminDashboard></AdminDashboard>);
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
  });
});
