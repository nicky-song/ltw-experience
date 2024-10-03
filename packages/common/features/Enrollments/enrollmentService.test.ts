import {
  createCourseInvitations,
  getLearningItemEnrollment,
  getCardsEnrollmentByLearningItem,
  createCardEnrollment,
  updateLearningEnrollment,
  updateCardEnrollment,
  updateCardEnrollmentAnswer,
  updateCardEnrollmentStartedAt,
  getCourseEnrollment,
  getCourseEnrollments,
  getLearningItemsEnrollmentByCourse,
  createCourseEnrollment,
  createLearningItemEnrollment,
  updateCourseEnrollmentStartedAt,
  getCourseEnrollmentById,
  updateCourseEnrollmentCompletedAt,
  updateCardEnrollmentConfidence,
} from './enrollmentService';
import {
  UpdateCardEnrollmentParams,
  UpdateCardEnrollmentStartedAtParams,
  UpdateCourseEnrollmentCompletedAtParams,
  UpdateCourseEnrollmentStartedAtParams,
  UpdateLearningItemEnrollmentParams,
} from './enrollmentTypes';

const mockRestClient = {
  get: jest.fn(() => ({
    data: {
      'hydra:member': 'helloWorld',
    },
  })),
  post: jest.fn(() => ({
    data: {
      'hydra:member': 'postResponse',
    },
  })),
  patch: jest.fn(() => ({
    data: {
      'hydra:member': 'patchResponse',
    },
  })),
};
jest.mock('../../utils/restClient', () => {
  return {
    getRestClient: jest.fn(() => mockRestClient),
    getApiGatewayUrl: jest.fn(() => 'test'),
  };
});

describe('Enrollment Service', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('createCourseInvitations: should make an api request', async () => {
    const res = await createCourseInvitations(
      'string',
      'string',
      'string',
      'string',
    );

    expect(res).toEqual('postResponse');
  });

  it('getCourseEnrollment: should make an api request', async () => {
    const res = await getCourseEnrollment('12345');

    expect(res).toEqual('helloWorld');
  });

  it('getCourseEnrollments: should make an api request', async () => {
    const res = await getCourseEnrollments(['12344', '12345']);

    expect(res).toEqual('helloWorld');
  });

  it('getLearningItemsEnrollmentByCourse: should make an api request', async () => {
    const res = await getLearningItemsEnrollmentByCourse('12345');

    expect(res).toEqual('helloWorld');
  });

  it('createCourseEnrollment: should make an api request', async () => {
    const res = await createCourseEnrollment({
      invitation: '12345',
      courseId: '12345',
      userId: '12345',
      organizationId: '12345',
    });

    expect(res).toEqual({ 'hydra:member': 'postResponse' });
  });

  it('createLearningItemEnrollment: should make an api request', async () => {
    const res = await createLearningItemEnrollment({
      courseEnrollment: '12345',
      learningItemId: '12345',
      learningItemEnrollmentId: '12345',
      progress: 0,
    });

    expect(res).toEqual({ 'hydra:member': 'postResponse' });
  });

  it('getCourseEnrollmentById: should make an api request', async () => {
    const res = await getCourseEnrollmentById('56gfs5684fg');

    expect(res).toEqual({ 'hydra:member': 'helloWorld' });
  });

  it('getLearningItemEnrollment: should make an api request', async () => {
    const res = await getLearningItemEnrollment('56gfs5684fg');

    expect(res).toEqual({ 'hydra:member': 'helloWorld' });
  });

  it('getCardsEnrollmentByLearningItem: should make an api request', async () => {
    const res = await getCardsEnrollmentByLearningItem('56gfs5684fg');

    expect(res).toEqual('helloWorld');
  });

  it('createCardEnrollment: should make an api request', async () => {
    const res = await createCardEnrollment({
      learningItemEnrollmentId: '56gfs5684fg',
      cardId: '2473589',
      startedAt: '2021-09-09',
    });

    expect(res).toEqual({ 'hydra:member': 'postResponse' });
  });

  it('should return data when updating the learning enrollment', async () => {
    jest.mock('@learn-to-win/common/features/Cards/cardService', () => ({
      getCardsAPI: () => [{ completedAt: true }],
    }));
    const test: UpdateLearningItemEnrollmentParams = {
      learningItemEnrollmentId: '',
      completedAt: '',
      startedAt: '',
      elapsedSec: 1,
    };
    const res = await updateLearningEnrollment(test);
    expect(res).toEqual('patchResponse');
  });

  it('should return data when updating the card enrollment', async () => {
    const test: UpdateCardEnrollmentParams = {
      cardEnrollmentId: '1',
      completedAt: '',
      elapsedSec: 1,
    };
    const res = await updateCardEnrollment(test);
    expect(res).toEqual('patchResponse');
  });

  it('should return data when updating the card enrollment answer column', async () => {
    const test = {
      cardEnrollmentId: '1',
      answer: ['1'],
    };
    const res = await updateCardEnrollmentAnswer(test);
    expect(res).toEqual('patchResponse');
  });

  it('should return data when updating the card enrollment confidence column', async () => {
    const test = {
      cardEnrollmentId: '1',
      confidence: 100
    };
    const res = await updateCardEnrollmentConfidence(test);
    expect(res).toEqual('patchResponse');
  });

  it('should return data when updating the card enrollment startedAt', async () => {
    const test: UpdateCardEnrollmentStartedAtParams = {
      cardEnrollmentId: '1',
      startedAt: '',
    };
    const res = await updateCardEnrollmentStartedAt(test);
    expect(res).toEqual('patchResponse');
  });

  it('should return data when updating the course enrollment startedAt', async () => {
    const test: UpdateCourseEnrollmentStartedAtParams = {
      courseItemEnrollmentId: '1',
      startedAt: '',
    };
    const res = await updateCourseEnrollmentStartedAt(test);
    expect(res).toEqual('patchResponse');
  });

  it('should return data when updating the course enrollment completedAt', async () => {
    const test: UpdateCourseEnrollmentCompletedAtParams = {
      courseItemEnrollmentId: '1',
    };
    const res = await updateCourseEnrollmentCompletedAt(test);
    expect(res).toEqual(undefined);
  });
});
