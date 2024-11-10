import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import CommonPage from './components/CommonPage';
import Logout from './components/Logout';
import CommonLogin from './components/CommonLogin';
import CommonRegister from './components/CommonRegister';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<CommonPage children={CommonLogin}/>}/>
          <Route path='/register' element={<CommonPage children={CommonRegister}/>}/>
          <Route path='/logout' element={<Logout/>}/>
          <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;