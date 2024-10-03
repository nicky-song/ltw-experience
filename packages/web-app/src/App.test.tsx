import { render, screen } from '@tests/testing';
import { waitFor } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

test('renders learn react link', async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  await waitFor(() => {
    const companyName = screen.getByText('Learn to Win');
    expect(companyName).toBeInTheDocument();
  });
});
