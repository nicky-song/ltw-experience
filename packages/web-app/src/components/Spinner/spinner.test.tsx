import { render, screen } from '@tests/testing';
import Spinner from '.';
describe('spinner tests', () => {
  it('should render the spinner but not the children if spinning', () => {
    render(
      <Spinner spinning>
        <div>asdf</div>
      </Spinner>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should render the children if not spinning', () => {
    render(
      <Spinner spinning={false}>
        <div>asdf</div>
      </Spinner>,
    );

    expect(screen.getByText('asdf')).toBeInTheDocument();
  });
});
