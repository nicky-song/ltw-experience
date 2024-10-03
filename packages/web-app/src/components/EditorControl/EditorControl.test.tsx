import { cleanup, render, screen } from '@tests/testing';
import EditorControl, { EditorControlProps, EditorControlType } from './index';
import { Slate, withReact } from 'slate-react';
import { createEditor, Descendant } from 'slate';

afterEach(cleanup);

describe('Editor Control', () => {
  const editor = withReact(createEditor());
  const initialValue: Descendant[] = [
    {
      type: 'title',
      children: [{ text: 'Title' }],
    },
  ];
  const setUp = (
    props?: Omit<
      EditorControlProps,
      'editorType' | 'children' | 'show' | 'textLength'
    >,
  ) => {
    const editorControlProps: Omit<EditorControlProps, 'children'> = {
      editorType: EditorControlType.titleText,
      show: true,
      textLength: 95,
      enabled: true,
      ...props,
    };
    render(
      <Slate editor={editor} initialValue={initialValue}>
        <EditorControl {...editorControlProps}>Hello</EditorControl>
      </Slate>,
    );
  };

  it('Displays the editor control', () => {
    setUp();

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Title Text')).toBeInTheDocument();
    expect(
      screen.getByTestId('text-size-control-large-button'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('text-format-control-strong-button'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('text-alignment-control-left-align-button'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('text-control-hyperlink')).toBeInTheDocument();
    expect(screen.getByText('Character Count')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should not display controls for text size when disabled', () => {
    setUp({ enableSizeControls: false, enabled: true });

    expect(
      screen.queryByTestId('text-size-control-large-button'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('text-size-control-medium-button'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('text-size-control-small-button'),
    ).not.toBeInTheDocument();
  });

  it('should not display controls for text format when disabled', () => {
    setUp({ enableFormatControls: false, enabled: true });

    expect(
      screen.queryByTestId('text-format-control-strong-button'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('text-format-control-italic-button'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('text-format-control-underline-button'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('text-format-control-strikethrough-button'),
    ).not.toBeInTheDocument();
  });

  it('should not display controls for text alignment when disabled', () => {
    setUp({ enableAlignControls: false, enabled: true });

    expect(
      screen.queryByTestId('text-alignment-control-left-align-button'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('text-alignment-control-full-justified-button'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('text-alignment-control-center-justified-button'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('text-alignment-control-right-align-button'),
    ).not.toBeInTheDocument();
  });

  it('should not display controls for text highlight when disabled', () => {
    setUp({ enableHighlightControls: false, enabled: true });
    expect(
      screen.queryByTestId('text-control-hyperlink'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('text-control-color')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('text-control-highlight'),
    ).not.toBeInTheDocument();
  });

  it('should not display character count control when disabled', () => {
    setUp({ enableCharacterCount: false, enabled: true });
    expect(screen.queryByText('Character Count')).not.toBeInTheDocument();
  });

  it('should not display delete control when disabled', () => {
    setUp({ enableDelete: false, enabled: true });
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('should not display list controls by default', () => {
    setUp();
    expect(
      screen.queryByTestId('list-control-numbered-list-button'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('list-control-bulleted-list-button'),
    ).not.toBeInTheDocument();
  });

  it('should display list controls when enabled', () => {
    setUp({ enableListControls: true, enabled: true });
    expect(
      screen.queryByTestId('list-control-numbered-list-button'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('list-control-bulleted-list-button'),
    ).toBeInTheDocument();
  });
});
