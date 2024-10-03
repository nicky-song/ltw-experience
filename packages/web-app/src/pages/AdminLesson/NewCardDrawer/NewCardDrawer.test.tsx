import { render, waitFor, screen, fireEvent } from '@tests/testing';
import { NewCardDrawer } from './NewCardDrawer';
import { DrawerContext } from '@pages/AdminLesson/context';
import { toProperCase } from '@learn-to-win/common/utils/getLearningItemTypeProperCase';
import { LearningItemType } from '@learn-to-win/common/constants';

test('renders new card ', async () => {
  render(
    <DrawerContext.Provider
      value={{ isDrawerOpen: true, setIsDrawerOpen: (val) => val }}>
      <NewCardDrawer
        createCardWithTemplate={jest.fn()}
        learningItemType={toProperCase(LearningItemType.LESSON)}
      />
    </DrawerContext.Provider>,
  );

  await waitFor(() => {
    expect(screen.getByText('Lesson Cards')).toBeInTheDocument();
    expect(screen.getByText('Blank')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Media')).toBeInTheDocument();
    expect(screen.getByText('Slideshow')).toBeInTheDocument();
    expect(screen.getByText('Expandable List')).toBeInTheDocument();
  });
});

describe('NewCardDrawer', () => {
  const mockCreateCardWithTemplate = jest.fn();
  it('renders quiz cards tab and create a quiz card', async () => {
    render(
      <DrawerContext.Provider
        value={{ isDrawerOpen: true, setIsDrawerOpen: (val) => val }}>
        <NewCardDrawer
          createCardWithTemplate={mockCreateCardWithTemplate}
          learningItemType={toProperCase(LearningItemType.QUIZ)}
        />
      </DrawerContext.Provider>,
    );
    await waitFor(() => {
      expect(screen.getByText('Quiz Cards')).toBeInTheDocument();
      expect(screen.getByText('Multiple Choice')).toBeInTheDocument();
      expect(screen.getByText('True or False')).toBeInTheDocument();
    });

    const selectMCBtn = await screen.findByTestId('Multiple Choice');
    fireEvent.click(selectMCBtn);
    expect(mockCreateCardWithTemplate).toHaveBeenCalledWith('multipleChoice');
  });

  it('can navigate to the import card state', async () => {
    render(
      <DrawerContext.Provider
        value={{ isDrawerOpen: true, setIsDrawerOpen: (val) => val }}>
        <NewCardDrawer
          createCardWithTemplate={jest.fn()}
          learningItemType={toProperCase(LearningItemType.LESSON)}
        />
      </DrawerContext.Provider>,
    );
    const importNavButton = await screen.findByText('Import Cards');

    fireEvent.click(importNavButton);
    const chooseLqText = await screen.findByText(
      'Choose Lesson or Quiz to Import',
    );
    expect(chooseLqText).toBeInTheDocument();
  });

  it('should invoke callback prop when close button is clicked', async () => {
    const mockSetIsDrawerOpen = jest.fn();
    render(
      <DrawerContext.Provider
        value={{ isDrawerOpen: true, setIsDrawerOpen: mockSetIsDrawerOpen }}>
        <NewCardDrawer
          createCardWithTemplate={jest.fn()}
          learningItemType={toProperCase(LearningItemType.LESSON)}
        />
      </DrawerContext.Provider>,
    );
    const closeButton = await screen.findByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);
    expect(mockSetIsDrawerOpen).toHaveBeenCalledWith(false);
  });
});
