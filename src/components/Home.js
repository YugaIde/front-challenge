import { auth } from '../firebase';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleLogout = () => {
    auth.signOut();
    navigate('/glogin');
  };

  if (!user) {
    return <Navigate to="/glogin" replace />;
  }

  return (
    <div>
      <h1>front chat app</h1>
      <button onClick={handleLogout}>ログアウト</button>
      {/* <Outlet /> */}
    </div>
  );
};

export default Home;
