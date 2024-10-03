import { Slate, withReact } from 'slate-react';
import { createEditor, Descendant } from 'slate';
import { render, screen, fireEvent, waitFor } from '@tests/testing';
import TextHighlightControl from './index';

const editor = withReact(createEditor());
const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'This is your body text.',
      },
    ],
  },
];
const mockInsertLink = jest.fn();
const mockRemoveLink = jest.fn();
const mockGetLinkValue = jest.fn();
const mockSetIsEditorOpen = jest.fn();
const mockSetTextColor = jest.fn();
const mockSetTextBackgroundColor = jest.fn();

const props = {
  isLinkActive: false,
  insertLink: mockInsertLink,
  removeLink: mockRemoveLink,
  getLinkValue: mockGetLinkValue,
  setTextColor: mockSetTextColor,
  setTextBackgroundColor: mockSetTextBackgroundColor,
};
describe('Text Highlight and Hyperlink Controls', () => {
  it('should render buttons for hyperlink and changing text color and background color', () => {
    render(
      <Slate editor={editor} initialValue={initialValue}>
        <TextHighlightControl {...props} />
      </Slate>,
    );
    const linkButton: HTMLElement = screen.getByTestId(
      'text-control-hyperlink',
    );
    const colorButton: HTMLElement = screen.getByTestId('text-control-color');
    const highlightButton: HTMLElement = screen.getByTestId(
      'text-control-highlight',
    );
    expect(linkButton).toBeInTheDocument();
    expect(colorButton).toBeInTheDocument();
    expect(highlightButton).toBeInTheDocument();
    expect(screen.queryByText('Link URL')).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText('Type or paste url'),
    ).not.toBeInTheDocument();
  });

  it('should render and interact with input for hyperlink', async () => {
    render(
      <Slate editor={editor} initialValue={initialValue}>
        <TextHighlightControl {...props} />
      </Slate>,
    );
    const linkButton: HTMLElement = screen.getByTestId(
      'text-control-hyperlink',
    );
    fireEvent.click(linkButton);
    expect(await screen.findByText('Link URL')).toBeInTheDocument();
    expect(
      await screen.findByPlaceholderText('Type or paste url'),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: 'Remove' }),
    ).toBeDisabled();
    expect(await screen.findByRole('button', { name: 'Apply' })).toBeDisabled();

    const urlInput: HTMLElement = await screen.findByPlaceholderText(
      'Type or paste url',
    );

    fireEvent.change(urlInput, {
      target: { value: 'google.com' },
    });
    const applyButton: HTMLElement = await screen.findByRole('button', {
      name: 'Apply',
    });
    expect(applyButton).toBeEnabled();

    fireEvent.click(applyButton);
    const removeButton: HTMLElement = await screen.findByRole('button', {
      name: 'Remove',
    });
    waitFor(async () => {
      expect(mockInsertLink).toHaveBeenCalledWith('http://www.google.com');
      expect(removeButton).toBeEnabled();
      fireEvent.click(removeButton);
      expect(mockRemoveLink).toHaveBeenCalled();
    });

    // Create a custom element with desired data attributes
    const nonEditableTarget = render(
      <div data-testid='custom-related-target'>Custom Related Target</div>,
    ).getByTestId('custom-related-target');

    fireEvent.blur(urlInput, {
      nonEditableTarget,
    });
    waitFor(() => {
      expect(mockSetIsEditorOpen).toHaveBeenCalledWith(false);
    });

    const editableTarget = render(
      <div data-slate-editor='true' data-testid='custom-related-target1'>
        Custom Related Target
      </div>,
    ).getByTestId('custom-related-target1');

    fireEvent.blur(urlInput, {
      editableTarget,
    });
    waitFor(() => {
      expect(mockSetIsEditorOpen).not.toHaveBeenCalled();
    });
  });

  it('should render controls for changing text color', async () => {
    render(
      <Slate editor={editor} initialValue={initialValue}>
        <TextHighlightControl {...props} />
      </Slate>,
    );

    const colorButton: HTMLElement = screen.getByTestId('text-control-color');
    fireEvent.click(colorButton);
    const buttonRed = await screen.findByTestId('color-selector-button-red');
    expect(buttonRed).toBeInTheDocument();
    fireEvent.click(buttonRed);
    expect(mockSetTextColor).toHaveBeenCalledWith('#f5222d');

    const highlightButton: HTMLElement = screen.getByTestId(
      'text-control-highlight',
    );
    fireEvent.click(highlightButton);
    expect(
      await screen.findByTestId('color-selector-button-gold'),
    ).toBeInTheDocument();
  });

  it('should render controls for changing text background color', async () => {
    render(
      <Slate editor={editor} initialValue={initialValue}>
        <TextHighlightControl {...props} />
      </Slate>,
    );

    const highlightButton: HTMLElement = screen.getByTestId(
      'text-control-highlight',
    );
    fireEvent.click(highlightButton);
    const buttonRedHighlight = await screen.findByTestId(
      'color-selector-button-red',
    );
    expect(buttonRedHighlight).toBeInTheDocument();
    fireEvent.click(buttonRedHighlight);
    expect(mockSetTextBackgroundColor).toHaveBeenCalledWith('#ffa39e');
  });
});
