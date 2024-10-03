import { render, screen } from '@testing-library/react';
import LoginLayout from '.';

describe('LoginLayout Component', () => {
  test('renders', () => {
    render(<LoginLayout>test</LoginLayout>);
    const linkElement = screen.getByText(/learn to win/i);
    expect(linkElement).toBeInTheDocument();
  });
});
