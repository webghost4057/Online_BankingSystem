import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Protected = ({ children , authentication = true}) => {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const redirect = () => {
      if (authentication && authStatus!==authentication) {
        navigate('/login');
      } else if (!authentication && authStatus!==authentication) {
        navigate('/');
      }
      setLoader(false);
    };
    redirect();
  }, [authStatus, navigate]);

  if (loader) {
    return <h1>Loading...</h1>;
  }

  return <>{children}</>;
};

export default Protected;
