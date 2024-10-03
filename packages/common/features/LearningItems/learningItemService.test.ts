import { createLearningItem, getLearningItemsAPI } from './learningItemService';

const mockRestClient = {
  get: jest.fn(() => ({
    data: {
      'hydra:member': 'helloWorld',
    },
  })),
  post: jest.fn(() => ({
    data: {
      'hydra:member': 'postResponse',
    } as any,
  })),
  patch: jest.fn(() => ({
    data: 'patchResponse',
  })),
};
jest.mock('../../utils/restClient', () => {
  return {
    getRestClient: jest.fn(() => mockRestClient),
    getApiGatewayUrl: jest.fn(() => 'test'),
  };
});

describe('getLearningItemsAPI', () => {
  it('should make an api request', async () => {
    const res = await getLearningItemsAPI({
      organizationId: '1',
      courseId: '1',
    });

    expect(res).toEqual('helloWorld');
  });
});

describe('createLearningItem', () => {
  it('should make an api request', async () => {
    const res = await createLearningItem({
      state: 'draft',
      courseId: '1',
      type: 'quiz',
      name: 'test',
    });

    expect(res).toEqual({ 'hydra:member': 'postResponse' });
  });

  it('returns learning item', async () => {
    mockRestClient.post.mockImplementationOnce(() => ({
      data: { id: 'test id' },
    }));

    const res = await createLearningItem({
      state: 'draft',
      courseId: '1',
      type: 'quiz',
      name: 'test',
      description: 'test description',
    });

    expect(res).toEqual({ id: 'test id' });
    expect(mockRestClient.post).toHaveBeenCalled();
  });
});
