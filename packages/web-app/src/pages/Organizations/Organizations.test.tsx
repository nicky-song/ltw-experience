import { render, screen } from '@testing-library/react';
import SuperAdminOrganizations from '.';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useLocation: () => ({
    pathname: 'path',
  }),
}));

describe('SuperAdminOrganizations Component', () => {
  it('should render the SuperAdminOrganizations component', async () => {
    render(<SuperAdminOrganizations></SuperAdminOrganizations>);
    expect(screen.getByText(/Super Admin Organizations/i)).toBeInTheDocument();
  });
});
