import { render, screen, fireEvent } from '@tests/testing';
import { ErrorBoundary } from './index';

describe('ErrorBoundary', () => {
  it('errors trigger Error Boundary', () => {
    const Throw = () => {
      throw new Error('Error');
    };
    render(
      <ErrorBoundary>
        <Throw />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });
  it('can retry', () => {
    let shouldThrow = true;
    const ShouldThrow = () => {
      if (shouldThrow) {
        throw new Error('Error');
      }
      return null;
    };
    render(
      <ErrorBoundary>
        <div>
          <ShouldThrow />
          <div>Rendered!</div>
        </div>
      </ErrorBoundary>,
    );
    expect(screen.getByText('Something went wrong')).toBeTruthy();
    shouldThrow = false;
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(screen.getByText('Rendered!')).toBeTruthy();
  });
});
