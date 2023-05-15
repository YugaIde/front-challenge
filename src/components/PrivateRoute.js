//V6での実装がわからず、今は使ってない

import { Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuthContext();
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
