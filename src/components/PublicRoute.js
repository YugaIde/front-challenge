//V6での実装がわからず、今は使ってない

import { Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
const PublicRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuthContext();
  return (
    <Route
      {...rest}
      render={(routeProps) => {
        return !user ? <Component {...routeProps} /> : <Navigate to="/" />;
      }}
    />
  );
};

export default PublicRoute;