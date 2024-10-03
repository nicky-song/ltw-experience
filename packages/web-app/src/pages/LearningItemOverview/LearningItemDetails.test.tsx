import { screen, render } from '@testing-library/react';
import LearningItemDetails from '.';

jest.mock('@hooks/reduxHooks', () => ({
  useAppSelector: () => ({
    cards: [{ type: 'lesson', title: 'slide 1' }],
    courseDetails: {
      id: '1',
      title: 'course title 1',
      description: 'lesson description 1',
    },

    learningItemList: [{ id: '1', name: 'lesson title 1', type: 'lesson' }],
  }),
  useAppDispatch: () =>
    function () {
      return null;
    },
}));

describe('learning item details', () => {
  it('should render course title and sidebar', () => {
    render(<LearningItemDetails></LearningItemDetails>);
    expect(screen.getByText(/Create New/)).toBeInTheDocument();
    expect(screen.getByText(/course title 1/)).toBeInTheDocument();
    expect(screen.getByText(/lesson title 1/)).toBeInTheDocument();
  });
});
