import { useNextLearningItem } from './useNextLearningItem';
import { render, screen, waitFor } from '../../test/testing';
import { createStackNavigator } from '@react-navigation/stack';
import { Stack } from '../../AppNavigation';
import { Text, Button } from 'react-native';
import { fireEvent } from '@testing-library/react-native';

jest.mock(
  '@learn-to-win/common/features/LearningItems/learningItemService',
  () => ({
    // getLearningItem: undefined,
    getLearningItem: jest.fn(() => {
      return Promise.resolve({
        data: {
          id: 'learningItem-2',
          name: 'Learning Item 2',
          description: 'Learning Item 2 Description',
        },
      });
    }),
  }),
);

const HookComponent = (props: Parameters<typeof useNextLearningItem>[0]) => {
  const { nextLesson, navigateToNextLesson } = useNextLearningItem(props);
  return (
    <>
      <Text>{JSON.stringify({ nextLesson }, null, 2)}</Text>
      <Button title={'Next Lesson'} onPress={() => navigateToNextLesson} />
    </>
  );
};
const preloadedState = {
  enrollment: {
    learningItemEnrollments: [
      {
        id: 'enrollment-1',
        learningItemId: 'learningItem-1',
        courseEnrollment: 'courseEnrollment-1',
        progress: 0,
        completedAt: '2021-08-10T15:00:00.000Z',
      },
      {
        id: 'enrollment-2',
        learningItemId: 'learningItem-2',
        courseEnrollment: 'courseEnrollment-1',
        progress: 0,
        completedAt: '2021-08-10T15:00:00.000Z',
      },
    ],
    cardEnrollments: [],
    courseEnrollment: [],
    loading: false,
    error: null,
  },
};
describe('useNextLearningItem', () => {
  it('should return the next learning item', async () => {
    const Stack = createStackNavigator();
    render(
      <Stack.Navigator>
        <Stack.Screen
          name='Test'
          initialParams={{
            invitationId: 'invitation-1',
          }}>
          {() => (
            <HookComponent isEnabled={true} learningItemId='learningItem-1' />
          )}
        </Stack.Screen>
      </Stack.Navigator>,
      {
        preloadedState: preloadedState,
      },
    );


    await waitFor(() =>
      expect(screen.getByText(/"id": "learningItem-2"/)).toBeTruthy(),
    );

    fireEvent.press(screen.getByText('Next Lesson'));
  });

  it('should return nothing if on the last learning item', async () => {
    const Stack = createStackNavigator();
    render(
      <Stack.Navigator>
        <Stack.Screen
          name='Test'
          initialParams={{
            invitationId: 'invitation-1',
          }}>
          {() => (
            <HookComponent isEnabled={true} learningItemId='learningItem-2' />
          )}
        </Stack.Screen>
      </Stack.Navigator>,
      {
        preloadedState: preloadedState,
      },
    );

    fireEvent.press(screen.getByText('Next Lesson'));

    await waitFor(() =>
      expect(screen.getByText(/"nextLesson": null/)).toBeTruthy(),
    );
  });
});
