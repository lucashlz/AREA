import React, { useContext } from 'react';
import { UserContext } from "../../../context/userContext";
import { Outlet, Navigate } from "react-router-dom";

const Private: React.FC = () => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("Private must be used within a UserContextProvider");
  }

  const { token } = userContext;

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
        <h1 className="display-2
        text-light">
          PRIVATE !!! CREATE PAGE
        </h1>
      <Outlet />
    </div>
  );
}

export default Private;
