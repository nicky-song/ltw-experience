import { render, screen, cleanup, fireEvent } from '@tests/testing';
import ListControl from './index';

afterEach(cleanup);

describe('List Control', () => {
  it('should have buttons for numbered and bulleted', () => {
    render(<ListControl />);
    const numberedListButton: HTMLElement = screen.getByTestId(
      'list-control-numbered-list-button',
    );
    const bulletedListButton: HTMLElement = screen.getByTestId(
      'list-control-bulleted-list-button',
    );
    expect(numberedListButton).toBeInTheDocument();
    expect(bulletedListButton).toBeInTheDocument();
  });
  it('should invoke callback prop when numbered list button is clicked', () => {
    const mockToggleNumberedList = jest.fn();
    render(<ListControl toggleNumberedList={mockToggleNumberedList} />);
    const numberedListButton: HTMLElement = screen.getByTestId(
      'list-control-numbered-list-button',
    );
    fireEvent.click(numberedListButton);
    expect(mockToggleNumberedList).toHaveBeenCalled();
  });
  it('should invoke callback prop when bulleted list button is clicked', () => {
    const mockToggleBulletedList = jest.fn();
    render(<ListControl toggleBulletedList={mockToggleBulletedList} />);
    const bulletedListButton: HTMLElement = screen.getByTestId(
      'list-control-bulleted-list-button',
    );
    fireEvent.click(bulletedListButton);
    expect(mockToggleBulletedList).toHaveBeenCalled();
  });
});
