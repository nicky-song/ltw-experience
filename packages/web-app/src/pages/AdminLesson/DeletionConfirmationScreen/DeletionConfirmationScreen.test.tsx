import { render, screen } from '@tests/testing';
import { DeletionConfirmationScreen } from './DeletionConfirmationScreen';

const mockCloseDeleteConfirmationScreen = jest.fn();
const mockDeleteCard = jest.fn();

describe('DeleteConfirmationScreen Component', () => {
  it('should render DeleteConfirmationScreen component', async () => {
    render(
      <DeletionConfirmationScreen
        closeDeleteConfirmationScreen={mockCloseDeleteConfirmationScreen}
        deleteCard={mockDeleteCard}></DeletionConfirmationScreen>,
    );
    expect(
      screen.getByText(
        'Looks like you want to delete this card, is that right?',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Yes, delete')).toBeInTheDocument();
  });
});
