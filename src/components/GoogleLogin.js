import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { auth, provider, signInWithPopup } from '../firebase';
import { useAuthContext } from '../context/AuthContext';
import logo from '../logo.svg';
import './GoogleLogin.css';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Login = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      navigate('/chat/chat_show'); // チャットページにリダイレクト
    } catch (error) {
      console.log(error);
      setError(error.message);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (user) {
    navigate('/chat/chat_show'); // 既にログイン済みの場合はチャットページにリダイレクト
    return null;
  }

  return (
    <div className="login">
      <div>
        <h1>front chat app</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <button onClick={handleLogin}>Googleログイン</button>
        )}
      </div>
      <img src={logo} className="App-logo" alt="logo" />

      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          正常にログインできませんでした
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Login;
