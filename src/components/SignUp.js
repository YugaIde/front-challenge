import { auth } from '../firebase';
import { useAuthContext } from '../context/AuthContext';
import { Link, Navigate,useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SignUp = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [error, setError] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      await auth.createUserWithEmailAndPassword(email.value, password.value);
      navigate.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  if (user) {
    return <Navigate to="/" replace />;
  }


  return (
    <div>
      {/* ↓user.emailはエラーになる */}
      {/* <h1>ユーザ登録 {user.email}</h1> */}
      <h1>ユーザ登録</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>メールアドレス</label>
          <input name="email" type="email" placeholder="email" />
        </div>
        <div>
          <label>パスワード</label>
          <input name="password" type="password" placeholder="password" />
        </div>
        <div>
          <button>登録</button>
        </div>
        <div>
          ユーザ登録済みの場合は<Link to={'/login'}>こちら</Link>から
        </div>
      </form>
    </div>
  );
};

export default SignUp;