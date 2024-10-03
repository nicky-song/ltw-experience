import { Route, Routes } from 'react-router-dom';
import Register from './components/auth/Register';
import SignIn from './pages/SignIn';
import ConfirmEmail from './components/auth/ConfirmEmail';
import HomePage from './components/auth/HomePage';
import PrivateRoute from './components/PrivateRoute';
import Organizations from './pages/Organizations';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Users from './pages/Users';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CourseDetails from './pages/CourseDetails';
import Invitations from './pages/Invitations';
import ChangePassword from './pages/ChangePassword';
import AdminLesson from './pages/AdminLesson';
import LearnerLesson from './pages/LearnerLesson';
import LearnerCourseDetails from './pages/LearnerCourseDetails';
import { AIQuizPoc } from './pages/AdminLesson/AIQuizPOC/AIQuiz.poc';
import FocusModeEditor from '@pages/FocusModeEditor';
//import LearningItemOverview from '@pages/LearningItemOverview/';

function AppNavigation() {
  return (
    <Routes>
      <Route path='/register' Component={Register} />
      <Route path='/login' Component={SignIn} />
      <Route path='/confirmUser' Component={ConfirmEmail} />
      <Route path='/forgot-password' Component={ForgotPassword} />
      <Route path='/reset-password' Component={ResetPassword} />
      <Route path='/change-password' Component={ChangePassword} />
      <Route path='/' Component={PrivateRoute}>
        <Route path='/' Component={HomePage} />
      </Route>
      <Route path='/superadmin' Component={PrivateRoute}>
        <Route path='organizations' Component={Organizations} />
      </Route>
      <Route path='/admin' Component={PrivateRoute}>
        <Route path='dashboard' Component={Dashboard} />
        <Route path='users' Component={Users} />
        <Route path='courses' Component={Courses} />
        <Route path='courses/:courseId/details' Component={CourseDetails} />
        {/*<Route path='courses/:courseId/details' Component={LearningItemOverview} />*/}
      </Route>
      <Route path='/learner' Component={PrivateRoute}>
        <Route path='dashboard' Component={Dashboard} />
        <Route path='courses' Component={Invitations} />
        <Route
          path='invitation/:invitationId/details'
          Component={LearnerCourseDetails}
        />
        <Route
          path='learning_item/:learningItemEnrollmentId/invitation/:invitationId'
          Component={LearnerLesson}
        />
      </Route>
      <Route path='/learning_item' Component={PrivateRoute}>
        <Route path={':learningItemId/quiz'} Component={AIQuizPoc} />
        <Route path=':learningItemId' Component={AdminLesson}>
          <Route path='card/:cardId' Component={AdminLesson} />
        </Route>
      </Route>
      <Route
        path='/learning_item/:learningItemType/:learningItemId/card'
        Component={PrivateRoute}>
        <Route path={':cardId/block/:blockId'} Component={FocusModeEditor} />
      </Route>
      <Route path='*' Component={PrivateRoute}>
        {/* Error page here */}
        <Route path='*' Component={HomePage}></Route>
      </Route>
    </Routes>
  );
}

export default AppNavigation;
