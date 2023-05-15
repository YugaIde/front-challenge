import { useNavigate, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { auth, provider } from '../firebase';
import { useAuthContext } from '../context/AuthContext';
import logo from '../logo.svg';
import './GoogleLogin.css';

const Login = () => {
    const {user} = useAuthContext();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await auth.signInWithPopup(provider);
      navigate('/');
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div class="login">
      <div>
      <h1>front chat app</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogin}>Googleログイン</button>
      </div>
      <img src={logo} className="App-logo" alt="logo" />

    </div>
  );
};

export default Login;
