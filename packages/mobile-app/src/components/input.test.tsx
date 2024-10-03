import Input from './input';
import renderer from 'react-test-renderer';
import { fireEvent, render, screen } from '../test/testing';

describe('Components Input', () => {
  it('should match snapshot', () => {
    const handleChange = jest.fn();
    const input = renderer.create(
      <Input
        iconName='email-outline'
        placeholder='Email'
        onChangeText={handleChange}
      />,
    );

    expect(input).toMatchSnapshot();
  });
  it('should call onFocus', () => {
    const onFocus = jest.fn();
    render(
      <Input iconName='lock' testID='password-input' onChangeText={onFocus} />,
    );
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.press(passwordInput);
    fireEvent.changeText(passwordInput, 'password');

    expect(onFocus).toHaveBeenCalled();
  });
});
