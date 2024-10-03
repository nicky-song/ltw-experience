import { initializeTrackers } from '@/utils/trackers';
import { mockUserData } from '@learn-to-win/common/constants/mockUserData';

window.heap = {
  identify: jest.fn(),
  addUserProperties: jest.fn(),
};

describe('trackers', () => {
  it('calls heap properly', () => {
    initializeTrackers(mockUserData);
    expect(window.heap.identify).toHaveBeenCalledWith('123');
    expect(window.heap.addUserProperties).toHaveBeenCalledWith({
      email: 'test',
      firstName: 'Ryan',
      lastName: 'Rabello',
    });
    // expect it to be called again this time with the rest of the properties
    expect(window.heap.addUserProperties).toHaveBeenCalledWith({
      roles: 'admin,user',
      organizations: 'Learn to Win,test',
    });
  });
});
