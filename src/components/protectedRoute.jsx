import React, {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import useAuthStore from "../stores/authStore";
import PremiumLoader from "./loader";

const ProtectedRoute = ({children}) => {
  const {checkAuth, isAuthenticated, isLoading} = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const verify = async () => {
      await checkAuth();
      setAuthChecked(true);
    };
    verify();
  }, []);

  if (isLoading || !authChecked) {
    return <PremiumLoader fullPage />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
