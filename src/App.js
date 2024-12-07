import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import CommonPage from './components/CommonPage';
import Logout from './components/Logout';
import CommonLogin from './components/CommonLogin';
import CommonRegister from './components/CommonRegister';
import Dashboard from './components/Dashboard';
import TutorDashboard from './components/TutorDashboard';
import StudentDashboard from './components/StudentDashboard'; 
import ParentProfile from './components/ParentProfile';
import TutorProfile from './components/TutorProfile';
import StudentProfile from './components/StudentProfile';
import TutorSearch from './components/TutorSearch';
import PendingLessons from './components/PendingLessons';
import ChildLessons from './components/ChildLessons';
import LessonDetails from './components/LessonDetails';
import Error404 from './components/Error404';
import Payments from "./components/Payments";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<CommonPage children={CommonLogin}/>}/>
          <Route path='/register' element={<CommonPage children={CommonRegister}/>}/>
          <Route path='/logout' element={<Logout/>}/>
          <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
          <Route path="/tutor-dashboard" element={<ProtectedRoute element={TutorDashboard} />} />
          <Route path="/student-dashboard" element={<ProtectedRoute element={StudentDashboard} />} />
          <Route path="/parent-profile" element={<ProtectedRoute element={ParentProfile} />} />
          <Route path="/tutor-profile" element={<ProtectedRoute element={TutorProfile} />} />
          <Route path="/student-profile" element={<ProtectedRoute element={StudentProfile} />} />
          <Route path="/search" element={<ProtectedRoute element={TutorSearch} />} />
          <Route path="/pending-lessons" element={<ProtectedRoute element={PendingLessons} />} />
          <Route path="/child-lessons" element={<ProtectedRoute element={ChildLessons} />} />
          <Route path="/lessons/:id" element={<ProtectedRoute element={LessonDetails} />} />
          <Route path="/payments" element={<ProtectedRoute element={Payments} />} />
          {/* <Route path="*" element={<Error404 />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;