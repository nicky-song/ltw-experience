import { render, screen } from '@testing-library/react';
import ItemEditorLayout from '.';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: () => ({
    data: '1',
  }),
}));
describe('Item editor layout', () => {
  it('Should render on the page', () => {
    render(
      <MemoryRouter>
        <ItemEditorLayout learningItemType='quiz'>
          <p>child</p>
        </ItemEditorLayout>
      </MemoryRouter>,
    );

    expect(screen.getByText(/child/)).toBeInTheDocument();
    expect(screen.getByText('Editing Quiz')).toBeInTheDocument();
  });
});
