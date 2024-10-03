import { fireEvent, render, screen } from '@tests/testing';
import AdminLesson from '.';
import { MemoryRouter } from 'react-router';

jest.mock('@hooks/reduxHooks', () => ({
  useAppSelector: () => ({
    cards: [
      {
        id: '1',
        sequenceOrder: 0,
        title: 'title card',
        description: 'test desc',
        json: {
          version: '1.0',
          contentBlocks: [],
        },
      },
      {
        id: '2',
        sequenceOrder: 1,
        title: 'end card',
        description: 'test description',
        json: {
          version: '1.0',
          contentBlocks: [],
        },
      },
    ],
  }),
  useAppDispatch: () =>
    function () {
      return null;
    },
}));

describe('AdminLesson Component', () => {
  it('should render AdminLesson component', async () => {
    render(
      <MemoryRouter>
        <AdminLesson />
      </MemoryRouter>,
    );
    expect(screen.getByText('Editing Lesson')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('End')).toBeInTheDocument();
    expect(screen.getByTestId('createCardButton')).toBeInTheDocument();
  });

  it('should render a slideout to choose card templates', async () => {
    render(
      <MemoryRouter>
        <AdminLesson />
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByTestId('createCardButton'));

    expect(screen.getByText('Lesson Cards')).toBeInTheDocument();
  });
});
