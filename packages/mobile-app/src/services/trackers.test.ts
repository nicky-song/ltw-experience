import Heap from '@heap/react-native-heap';
import { initializeTrackers } from './trackers';
import { mockUserData } from '@learn-to-win/common/constants/mockUserData';
jest.mock('@heap/react-native-heap', () => ({
  identify: jest.fn(),
  addUserProperties: jest.fn(),
}));

describe('trackers', () => {
  it('calls heap properly', () => {
    initializeTrackers(mockUserData);
    expect(Heap.identify).toHaveBeenCalledWith('123');
    expect(Heap.addUserProperties).toHaveBeenCalledWith({
      email: 'test',
      firstName: 'Ryan',
      lastName: 'Rabello',
    });
    // expect it to be called again this time with the rest of the properties
    expect(Heap.addUserProperties).toHaveBeenCalledWith({
      roles: 'admin,user',
      organizations: 'Learn to Win,test',
    });
  });
});
