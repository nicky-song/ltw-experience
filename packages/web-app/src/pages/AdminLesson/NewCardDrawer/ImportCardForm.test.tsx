import { render, screen, fireEvent, waitFor } from '@tests/testing';
import ImportCardForm from './ImportCardForm';
import { DrawerContext } from '@pages/AdminLesson/context';
import { LearningItemType } from '@learn-to-win/common/constants';
import { getFilteredLearningItems } from '@learn-to-win/common/features/LearningItems/learningItemService';

jest.mock('@learn-to-win/common/features/LearningItems/learningItemService');

const recentlyUpdatedLearningItems = [
  {
    id: '7166729a-475b-488a-b0d3-c8ee0d98a471',
    name: 'Confidence quiz',
    description: 'This is your quiz description.',
    type: 'quiz',
  },
  {
    id: '8467e695-cdc0-4df1-a106-3852ee95429b',
    name: 'Confidence Lesson',
    description: 'This is your lesson description.',
    type: 'lesson',
  },
  {
    id: '5fe44c8a-0a11-49f5-8224-1447e1d857d8',
    name: 'Do you have a lot of experience in react?',
    description: 'This is your quiz description.',
    type: 'quiz',
  },
  {
    id: '0e4ae917-2c48-40b0-ba6a-355ae19abfde',
    name: 'React quiz',
    description: 'This is your quiz description.',
    type: 'quiz',
  },
  {
    id: 'a9a9e8bc-0ee5-49a7-8948-227f0746f094',
    name: 'Do you have a lot of experience in react-native?',
    description: 'This is your quiz description.',
    type: 'quiz',
  },
  {
    id: '79d2bcdc-5c90-4dd5-b632-433cf5c4e95b',
    name: 'Another quiz',
    description: 'This is your quiz description.',
    type: 'quiz',
  },
  {
    id: '146980f6-ebb3-4a18-9ad5-112d8cf97fb4',
    name: 'Quiz test',
    description: 'This is your quiz description.',
    type: 'quiz',
  },
];

const searchedLearningItems = [
  {
    id: '7166729a-475b-488a-b0d3-c8ee0d98a471',
    name: 'Confidence quiz',
    description: 'This is your quiz description.',
    type: 'quiz',
  },
  {
    id: '8467e695-cdc0-4df1-a106-3852ee95429b',
    name: 'Confidence Lesson',
    description: 'This is your lesson description.',
    type: 'lesson',
  },
];

describe('ImportCardForm', () => {
  it('should render the form', async () => {
    render(<ImportCardForm />);
    expect(
      screen.getByText('Choose Lesson or Quiz to Import'),
    ).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Import/ })).toBeDisabled();
    const questionImg = screen.getByRole('img', { name: /question/ });
    expect(questionImg).toBeInTheDocument();
    fireEvent.mouseOver(questionImg);
    expect(
      await screen.findByText(/Once you import the new cards/),
    ).toBeInTheDocument();
  });

  describe('Import cards to a lesson', () => {
    it('should fetch recently updated lessons', async () => {
      const recentlyUpdatedLessons = recentlyUpdatedLearningItems.filter(
        (item) => item.type === 'lesson',
      );
      (getFilteredLearningItems as jest.Mock).mockResolvedValue(
        recentlyUpdatedLessons,
      );
      render(
        <DrawerContext.Provider
          value={{
            isDrawerOpen: true,
            setIsDrawerOpen: (val) => val,
            learningItemId: '123',
            learningItemType: LearningItemType.LESSON,
          }}>
          <ImportCardForm />
        </DrawerContext.Provider>,
      );

      const searchSelect = document.querySelector(
        `[data-testid="import-search-select"] > .ant-select-selector`,
      ) as HTMLElement;
      fireEvent.mouseDown(searchSelect);
      waitFor(() => {
        expect(screen.getByText('Recently Updated')).toBeInTheDocument();
        expect(getFilteredLearningItems).toHaveBeenLastCalledWith({
          organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
          searchQuery: 'order[updatedAt]=desc&type=lesson',
        });
      });
    });

    it('should fetch searched lessons', async () => {
      const searchedLessons = searchedLearningItems.filter(
        (item) => item.type === 'lesson',
      );
      (getFilteredLearningItems as jest.Mock).mockResolvedValue(
        searchedLessons,
      );
      render(
        <DrawerContext.Provider
          value={{
            isDrawerOpen: true,
            setIsDrawerOpen: (val) => val,
            learningItemId: '123',
            learningItemType: LearningItemType.LESSON,
          }}>
          <ImportCardForm />
        </DrawerContext.Provider>,
      );
      const selectInput = screen.getByRole('combobox');
      fireEvent.focus(selectInput);
      fireEvent.change(selectInput, { target: { value: 'Confidence' } });
      waitFor(() => {
        expect(screen.getByText('Recently Updated')).not.toBeInTheDocument();
        expect(getFilteredLearningItems).toHaveBeenLastCalledWith({
          organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
          searchQuery: 'name=Confidence&type=lesson',
        });
      });
    });
  });

  describe('Import cards to a quiz', () => {
    it('should fetch recently updated learning items', async () => {
      (getFilteredLearningItems as jest.Mock).mockResolvedValue(
        recentlyUpdatedLearningItems,
      );
      render(
        <DrawerContext.Provider
          value={{
            isDrawerOpen: true,
            setIsDrawerOpen: (val) => val,
            learningItemId: '123',
            learningItemType: LearningItemType.QUIZ,
          }}>
          <ImportCardForm />
        </DrawerContext.Provider>,
      );
      const selectInput = screen.getByRole('combobox');
      fireEvent.focus(selectInput);
      expect(getFilteredLearningItems).toHaveBeenLastCalledWith({
        organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
        searchQuery: 'order[updatedAt]=desc',
      });
    });

    it('should fetch searched learning items', async () => {
      (getFilteredLearningItems as jest.Mock).mockResolvedValue(
        searchedLearningItems,
      );
      render(
        <DrawerContext.Provider
          value={{
            isDrawerOpen: true,
            setIsDrawerOpen: (val) => val,
            learningItemId: '123',
            learningItemType: LearningItemType.LESSON,
          }}>
          <ImportCardForm />
        </DrawerContext.Provider>,
      );
      const selectInput = screen.getByRole('combobox');
      fireEvent.focus(selectInput);
      fireEvent.change(selectInput, { target: { value: 'Confidence' } });
      waitFor(() => {
        expect(getFilteredLearningItems).toHaveBeenLastCalledWith({
          organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
          searchQuery: 'name=Confidence',
        });
      });
    });
  });
});
