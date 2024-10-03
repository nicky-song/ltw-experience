import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  // Unauthenticated routes
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  ChangePassword: undefined;

  // Authenticated routes
  Invitations: undefined;
  CourseDetails: {
    invitationId: string;
  };
  ImageModal: {
    mediaUrl: string;
  };
  Lesson: NavigatorScreenParams<LessonParamList>;

  // Available to all
  NotFound: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type LessonParamList = {
  Popular: undefined;
  Latest: undefined;
};

export type HomeTabScreenProps<T extends keyof LessonParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<LessonParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface RootParamList extends RootStackParamList {}
  }
}
