import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Invitations } from './pages/Invitations';
import { CourseDetails } from './pages/CourseDetails';
import { ForgotPassword } from './pages/ForgotPassword';
import { LearnerLesson } from './pages/LearnerLesson';
import { LessonDetails } from './pages/LessonDetails';
import { useAppSelector } from './hooks/reduxHooks';
import { Login } from './pages/Login';
import { ImageModalFullScreen } from './pages/AuthoringCard/ContentBlock/ImageModalFullScreen';
import * as Linking from 'expo-linking';
import { ResetPassword } from './pages/ResetPassword';
import { NotFound } from './components/NotFound';
import { ChangeTempPassword } from './pages/ResetPassword/ChangeTempPassword';

const prefix = Linking.createURL('/');

export const Stack = createStackNavigator();

const LessonNavigation = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name='LearnerLesson' component={LearnerLesson} />
    <Stack.Screen name='LessonDetails' component={LessonDetails} />
  </Stack.Navigator>
);

export function AppNavigation() {
  const isAuthed = useAppSelector((state) => state.auth.isAuthenticated);

  const linking = {
    prefixes: [prefix],
    config: {
      initialRouteName: isAuthed
        ? ('Invitations' as const)
        : ('Login' as const),
      screens: isAuthed
        ? {
            Invitations: 'Invitations',
            NotFound: '*',
          }
        : {
            // This is required for utilizing deep links, using the <Link />
            // component or setting the initialRouteName
            ResetPassword: 'reset-password',
            Login: 'Login',
            ForgotPassword: 'ForgotPassword',
            ChangePassword: 'ChangePassword',
            NotFound: '*',
          },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      {isAuthed ? (
        <Stack.Navigator initialRouteName={'Invitations'}>
          <Stack.Screen name='Invitations' component={Invitations} />
          <Stack.Screen name='CourseDetails' component={CourseDetails} />
          <Stack.Screen
            name='Lesson'
            component={LessonNavigation}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            options={{ headerShown: false, presentation: 'modal' }}
            name='ImageModal'
            component={ImageModalFullScreen}
          />
          <Stack.Screen name={'NotFound'} component={NotFound} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName={'Login'}>
          <Stack.Screen
            name='Login'
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
          <Stack.Screen name='ResetPassword' component={ResetPassword} />
          <Stack.Screen
            name='ChangePassword'
            component={ChangeTempPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen name='NotFound' component={NotFound} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
