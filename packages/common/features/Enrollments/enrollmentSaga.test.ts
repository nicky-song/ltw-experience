import { expectSaga } from 'redux-saga-test-plan';
import { call, select } from 'redux-saga/effects';
import {
  createCardsEnrollment,
  createLearningItemsEnrollments,
  getCardsEnrollmentByLearningItem,
  getCourseEnrollment,
  getLearningItemEnrollment,
  getLearningItemsEnrollment,
} from './enrollmentSaga';
import {
  createCardEnrollment,
  createLearningItemEnrollment,
  getCardsEnrollmentByLearningItem as getCardsEnrollmentByLearningItemAPI,
  getCourseEnrollment as getCourseEnrollmentAPI,
  getLearningItemEnrollment as getLearningItemEnrollmentAPI,
  getLearningItemsEnrollmentByCourse,
} from './enrollmentService';
import { selectCards } from '../Cards/cardSlice';
import { selectLearningItems } from '../LearningItems/learningItemSlice';
import { Card } from '@learn-to-win/common/features/Cards/cardTypes';
import { getInvitation } from '../Invitations/invitationService';
import { LearningItem } from '../LearningItems/learningItemTypes';
import { CardType } from '../../constants';

describe('Enrollment Saga', () => {
  const action = {
    type: '',
    payload: {
      learningItemEnrollmentId: '1',
    },
  };

  const learningItems: LearningItem[] = [
    {
      id: '1',
      name: 'test 2',
      description: 'test 1',
      cards: [],
      type: 'lesson',
    },
  ];

  const cards: Card[] = [
    {
      id: '1',
      type: CardType.LESSON_CARD,
      title: 'test 1',
      sequenceOrder: 1,
      learningItemId: '123',
      learningItem: '',
      confidenceCheck: true,
      json: {
        version: '1',
        description: 'test 1',
        contentBlocks: [],
        templateType: null,
      },
    },
    {
      id: '2',
      type: CardType.LESSON_CARD,
      title: 'test 2',
      sequenceOrder: 1,
      learningItemId: '123',
      learningItem: '',
      confidenceCheck: true,
      json: {
        version: '1',
        description: 'test 2',
        contentBlocks: [],
        templateType: null,
      },
    },
  ];

  it('should handle getCourseEnrollment success', () => {
    const response = {
      organizationId: '1',
      courseId: '1',
    };

    return expectSaga(getCourseEnrollment, '1')
      .provide([
        [call(getCourseEnrollmentAPI, '1'), response],
        [call(getInvitation, '1'), response],
      ])
      .put({
        type: 'learningItems/getLearningItems',
        payload: {
          organizationId: response.organizationId,
          courseId: response.courseId,
        },
      })
      .put({
        type: 'course/getCourseDetails',
        payload: {
          organizationId: response.organizationId,
          courseId: response.courseId,
        },
      })
      .put({
        type: 'enrollment/getCourseEnrollmentSuccess',
        payload: undefined,
      })
      .run();
  });

  it('should handle getCourseEnrollment failure', () => {
    const error = new Error('Error getting course enrollment');

    return expectSaga(getCourseEnrollment, '1')
      .provide([[call(getCourseEnrollmentAPI, '1'), Promise.reject(error)]])
      .put({
        type: 'enrollment/fetchAndAPIsFailure',
        payload: error?.toString(),
      })
      .run();
  });

  it('should handle getLearningItemsEnrollment success', () => {
    const response = {
      organizationId: '1',
      courseId: '1',
    };

    return expectSaga(getLearningItemsEnrollment, 'api/courseEnrollment/1')
      .provide([[call(getLearningItemsEnrollmentByCourse, '1'), response]])
      .put({
        type: 'enrollment/getLearningItemsEnrollmentSuccess',
        payload: response,
      })
      .run();
  });

  it('should handle getLearningItemsEnrollment failure', () => {
    const error = new Error('Error getting learning items enrollment');

    return expectSaga(getLearningItemsEnrollment, 'api/courseEnrollment/1')
      .provide([
        [call(getLearningItemsEnrollmentByCourse, '1'), Promise.reject(error)],
      ])
      .put({
        type: 'enrollment/fetchAndAPIsFailure',
        payload: error?.toString(),
      })
      .run();
  });

  it('should handle createLearningItemsEnrollments when learning item list is empty', () => {
    const learningItem: LearningItem[] = [];

    return expectSaga(createLearningItemsEnrollments, '1')
      .provide([[select(selectLearningItems), learningItem]])
      .put({
        type: 'learningItems/getLearningItemsFailure',
        payload: 'No learning items found',
      })
      .run();
  });

  it('should handle createLearningItemsEnrollments success', () => {
    const response = {
      id: '1',
      learningItemId: '1',
    };

    return expectSaga(createLearningItemsEnrollments, '1')
      .provide([
        [select(selectLearningItems), learningItems],
        ...(learningItems.map((item) => [
          call(createLearningItemEnrollment as any, {
            courseEnrollment: '1',
            learningItemId: item.id,
            progress: 0,
          }),
          response,
        ]) as any),
      ])
      .put({
        type: 'enrollment/createLearningItemsEnrollmentSuccess',
        payload: response,
      })
      .run();
  });

  it('should handle createLearningItemsEnrollments failure', () => {
    const error = new Error('Error creating learning items enrollment');

    return expectSaga(createLearningItemsEnrollments, '1')
      .provide([
        [select(selectLearningItems), learningItems],
        [
          call(createLearningItemEnrollment as any, {
            courseEnrollment: '1',
            learningItemId: learningItems[0].id,
            progress: 0,
          }),
          Promise.reject(error),
        ],
      ])
      .put({
        type: 'enrollment/fetchAndAPIsFailure',
        payload: error?.toString(),
      })
      .run();
  });

  it('should handle getLearningItemEnrollment success', () => {
    const response = {
      id: '1',
      learningItemId: '123',
    };

    return expectSaga(getLearningItemEnrollment, '1')
      .provide([
        [call(getLearningItemEnrollmentAPI, '1'), response],
        [call(getCardsEnrollmentByLearningItem, action), response],
      ])
      .put({
        type: 'card/getCards',
        payload: { learningItemId: response.learningItemId },
      })
      .run();
  });

  it('should handle getLearningItemEnrollment failure', () => {
    const error = new Error('Error getting learning item enrollment');

    return expectSaga(getLearningItemEnrollment, '1')
      .provide([
        [call(getLearningItemEnrollmentAPI, '1'), Promise.reject(error)],
      ])
      .put({
        type: 'enrollment/fetchAndCreateEnrollmentsFailure',
        payload: error?.toString(),
      })
      .run();
  });

  it('should handle getCardsEnrollmentByLearningItem success', () => {
    const response = [
      {
        id: '1',
        cardId: '1',
        learningItemEnrollment: '123',
      },
      {
        id: '2',
        cardId: '2',
        learningItemEnrollment: '123',
      },
    ];

    return expectSaga(getCardsEnrollmentByLearningItem, action)
      .provide([[call(getCardsEnrollmentByLearningItemAPI, '1'), response]])
      .put({
        type: 'enrollment/getCardsEnrollmentByLearningItemSuccess',
        payload: response,
      })
      .run();
  });

  it('should handle getCardsEnrollmentByLearningItem success for no card card enrollments', () => {
    return expectSaga(getCardsEnrollmentByLearningItem, action)
      .provide([
        [call(getCardsEnrollmentByLearningItemAPI, '1'), []],
        [call(createCardsEnrollment, '1'), []],
      ])
      .run();
  });

  it('should handle getCardsEnrollmentByLearningItem failure', () => {
    const error = new Error('Error getting learning item enrollment');

    return expectSaga(getCardsEnrollmentByLearningItem, action)
      .provide([
        [call(getCardsEnrollmentByLearningItemAPI, '1'), Promise.reject(error)],
      ])
      .put({
        type: 'enrollment/fetchAndCreateEnrollmentsFailure',
        payload: error?.toString(),
      })
      .run();
  });

  it('should handle createCardsEnrollment when cards list is empty', () => {
    const cards: Card[] = [];

    return expectSaga(createCardsEnrollment, '1')
      .provide([[select(selectCards), cards]])
      .put({
        type: 'enrollment/fetchAndCreateEnrollmentsFailure',
        payload: 'No cards found',
      })
      .run();
  });

  it('should handle createCardsEnrollment success', () => {
    const response = [
      {
        id: '1',
        cardId: '1',
        learningItemEnrollment: '123',
      },
      {
        id: '2',
        cardId: '2',
        learningItemEnrollment: '123',
      },
    ];

    return expectSaga(createCardsEnrollment, '1')
      .provide([
        [select(selectCards), cards],
        ...(cards.map((card) => [
          call(createCardEnrollment as any, {
            learningItemEnrollmentId: '1',
            cardId: card.id,
            startedAt: null,
          }),
          response,
        ]) as any),
      ])
      .put({
        type: 'enrollment/createCardsEnrollmentSuccess',
        payload: response,
      })
      .run();
  });
  it('should handle createCardsEnrollment failure', () => {
    const error = new Error('Error creating card enrollment');

    return expectSaga(createCardsEnrollment, '1')
      .provide([
        [select(selectCards), cards],
        [
          call(createCardEnrollment as any, {
            learningItemEnrollmentId: '1',
            cardId: cards[0].id,
            startedAt: null,
          }),
          Promise.reject(error),
        ],
      ])
      .put({
        type: 'enrollment/fetchAndCreateEnrollmentsFailure',
        payload: error?.toString(),
      })
      .run();
  });
});
