import React from "react";
import { useAuthContext } from "../../firebase/AuthProvider";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import LoadingIndicator from "../../assets/loading";

const PrivateRoute = ({ children }) => {
  const { loading, user } = useAuthContext();

  if (loading) {
    return <LoadingIndicator />
  }

  if (user) {
    return children;
  }

  return <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoute;