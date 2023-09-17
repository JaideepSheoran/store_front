import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './Login.css';

function Login() {
  const nav = useNavigate();
  const {login} = useAuth();
  const [btnData, setBtnData] = useState('Login');
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnData('Logging In...');
    const {email, password} = data;
    try {
      const res = await login(email, password);
      setBtnData('Login');
      nav('/');
    } catch (error) {
      window.alert(error)
    }

  }


  return (
    <div className='form-container'>
        <form className='formdata' method='POST'>
          <p className='formhead'>Login</p>
          <input className='forminput' type='email' name='email' value={data.email} onChange={handleChange} placeholder='E-mail' />
          <input className='forminput' type='password' name='password' value={data.password} onChange={handleChange} placeholder='Password' />
          <div className='formlogo'>
            <button className='form-button' type='submit' onClick={handleSubmit}>{btnData}</button>
            <Link to='/signup/'>Don't have an account ?</Link>
          </div>
        </form>
    </div>
  )
}

export default Login;