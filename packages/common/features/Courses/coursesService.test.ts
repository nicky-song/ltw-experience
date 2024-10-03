import {
  createCourse,
  getCoursesAPI,
  getCourseDetails,
  getInvitedCoursesAPI,
  getLearnerInvitedOrEnrolledCourses,
} from './coursesService';

const mockRestClient = {
  get: jest.fn(() => ({
    data: {
      'hydra:member': [{ id: '1', title: '1' }] as any,
    },
  })),
  post: jest.fn(),
};
jest.mock('../../utils/restClient', () => {
  return {
    getRestClient: jest.fn(() => mockRestClient),
    getApiGatewayUrl: jest.fn(() => 'test'),
  };
});

describe('courses service', () => {
  it('getCoursesApi should take an organization id and return data', async () => {
    const course = await getCoursesAPI({ organizationId: '1' });
    expect(course).toEqual([{ id: '1', title: '1' }]);
  });

  it('createCourse should make a post request', async () => {
    mockRestClient.post.mockReturnValueOnce({
      data: {
        'hydra:member': 'data',
      },
    });
    const course = await createCourse({
      title: 'testTitle',
      description: 'testDesc',
    });
    expect(course).toEqual('data');
  });

  it('should take a courseid and org id and return data', async () => {
    const course = await getCourseDetails({
      organizationId: '1',
      courseId: '1',
    });

    expect(course['hydra:member']).toEqual([{ id: '1', title: '1' }]);
  });

  it('should make a successful request to get course enrollments', async () => {
    const course = await getInvitedCoursesAPI({
      organizationId: '1',
      invitationIds: [],
    });

    expect(course).toEqual([{ id: '1', title: '1' }]);
  });

  it('should make a successful request to get course invitations and enrollments', async () => {
    mockRestClient.get.mockReturnValueOnce({
      data: {
        'hydra:member': [
          {
            '@id': '/api/invitations/87828398-a4f5-433d-a80e-12e5fcc6f7bf',
            '@type': 'Invitation',
            id: '87828398-a4f5-433d-a80e-12e5fcc6f7bf',
            organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
            courseId: '10a93c97-eed4-4f0c-bdac-b925f8f1db35',
            invitedUserId: '37689bd7-2d76-4197-a100-a43266fb08cb',
            createdAt: '2023-09-01T17:32:23+00:00',
            updatedAt: '2023-09-01T17:32:23+00:00',
            createdBy: '1d294192-5d98-498e-ae9c-6714594d14b6',
            updatedBy: '1d294192-5d98-498e-ae9c-6714594d14b6',
          },
        ],
      },
    });
    mockRestClient.get.mockReturnValueOnce({
      data: {
        'hydra:member': [
          {
            '@id':
              '/api/course_enrollments/1ee097f9-59da-623e-b5d0-8f4fd6590d57',
            '@type': 'CourseEnrollment',
            id: '1ee097f9-59da-623e-b5d0-8f4fd6590d57',
            invitation: '/api/invitations/1e618480-810c-4752-936e-2244870ef038',
            userId: '37689bd7-2d76-4197-a100-a43266fb08cb',
            organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
            courseId: '10a93c97-eed4-4f0c-bdac-b925f8f1db35',
            createdAt: '2023-06-13T00:16:47+00:00',
            updatedAt: '2023-06-30T22:27:19+00:00',
            createdBy: '37689bd7-2d76-4197-a100-a43266fb08cb',
            updatedBy: '37689bd7-2d76-4197-a100-a43266fb08cb',
            elapsedSec: 0,
            progress: 0,
            score: 0,
            startedAt: '2023-06-30T22:27:18+00:00',
          },
        ],
      },
    });
    mockRestClient.get.mockReturnValueOnce({
      data: {
        'hydra:member': [
          {
            '@id': '/api/courses/10a93c97-eed4-4f0c-bdac-b925f8f1db35',
            '@type': 'Course',
            id: '10a93c97-eed4-4f0c-bdac-b925f8f1db35',
            organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
            title: 'Ryan Test 6',
            description: 'Ryan tests',
            state: 'draft',
            learningItems: [
              '/api/learning_items/4c792f86-63cf-490b-804e-43e90d20ab4f',
              '/api/learning_items/c06a0aa7-9cf7-491d-ac21-d969683534ea',
              '/api/learning_items/d93d7053-05e6-432d-828b-2dd257de3297',
            ],
            createdAt: '2023-08-21T20:53:13+00:00',
            updatedAt: '2023-08-21T20:53:13+00:00',
            createdBy: '',
            updatedBy: '',
            ownedBy: '37689bd7-2d76-4197-a100-a43266fb08cb',
          },
        ],
      },
    });
    const invitation = await getLearnerInvitedOrEnrolledCourses({
      userId: '1',
      organizationId: '1',
    });
    expect(invitation).toEqual([
      {
        id: '87828398-a4f5-433d-a80e-12e5fcc6f7bf',
        name: 'Ryan Test 6',
        status: 'Not Started',
      },
    ]);
  });
});
