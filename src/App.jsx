import logo from './logo.svg';
import './App.css';
import SignUp from './components/sign-up/SignUp';
import Login from './components/log-in/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';

/**
 * 
 * Put Inside Private Routes that you want to hide
 */

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/' element={<PrivateRoute element={<h2>Welcome, Home Chick .</h2>} />} />
            <Route path="/about" element={<PrivateRoute element={<Login />} />} />
            <Route path="/contact" element={<PrivateRoute element={<Login />} />} />
            <Route exact path='/login/' element={<Login />} />
            <Route exact path='/signup/' element={<SignUp />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
