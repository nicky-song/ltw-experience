import { render, screen, fireEvent, waitFor } from '@tests/testing';
import { ColorSelector } from './index';
import * as tokens from '@/tokens/figma-tokens.json';

const mockOnColorSelect = jest.fn();

describe('Color Selector', () => {
  it('should render buttons for text color', () => {
    render(
      <ColorSelector
        theme='textColor'
        onColorSelect={mockOnColorSelect}
        selectedColorHex='#000000'
      />,
    );
    expect(screen.getAllByRole('button').length).toEqual(12);
    expect(
      screen.getByTestId('color-selector-button-transparent'),
    ).toBeDisabled();
    expect(screen.getByLabelText('check-circle')).toHaveClass(
      'color-selector__icon__color-block__check',
    );
    expect(
      screen.getByTestId('custom-color-selector-trigger'),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('color-selector-button-red'));
    expect(mockOnColorSelect).toHaveBeenCalledWith(tokens.red[6].value);
  });

  it('should render buttons for text background color', () => {
    render(
      <ColorSelector
        theme='backgroundColor'
        onColorSelect={mockOnColorSelect}
        selectedColorHex='#FFFFFF'
      />,
    );
    expect(screen.getAllByRole('button').length).toEqual(12);
    expect(
      screen.getByTestId('color-selector-button-transparent'),
    ).toBeEnabled();
    expect(screen.getByLabelText('check-circle')).not.toHaveClass(
      'color-selector__icon__color-block__check',
    );
    fireEvent.click(screen.getByTestId('color-selector-button-blue'));
    expect(mockOnColorSelect).toHaveBeenLastCalledWith(tokens.blue[3].value);
  });

  it('should set custom color from ColorPicker', async () => {
    render(
      <ColorSelector
        theme='textColor'
        onColorSelect={mockOnColorSelect}
        selectedColorHex='#FFFB8F'
      />,
    );
    fireEvent.click(screen.getByTestId('custom-color-selector-trigger'));
    waitFor(async () => {
      expect(await screen.findByRole('input')).toHaveValue('#FFFB8F');
      fireEvent.change(await screen.findByRole('input'), {
        target: { value: '#B7EB8F' },
      });
      expect(mockOnColorSelect).toHaveBeenLastCalledWith('#B7EB8F');
    });
  });
});
