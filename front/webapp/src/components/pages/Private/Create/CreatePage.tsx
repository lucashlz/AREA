import { UserContext } from "../../../../context/userContext";
import React, { useContext, useState } from 'react';
import { Outlet, Navigate, Link } from "react-router-dom";
import Create from "./Create";
import Services from "./Services";
import ServiceActions from "./ServiceAction";

export default function CreatePage() {
  const [currentPage, setCurrentPage] = useState('create')
  const userContext = useContext(UserContext);
  let goto = localStorage.getItem('selectedService')
  let area = localStorage.getItem('selectedArea')

  if (!userContext) {
    throw new Error("Private must be used within a UserContextProvider");
  }

  const { token } = userContext;

  if (!token) {
    return <Navigate to="/" />;
  }

  if (goto) {
    localStorage.removeItem('selectedService')
    setCurrentPage(goto)
  }

  return (
    <div>
      {
        currentPage == "create" ? <Create setCurrentPage={setCurrentPage}></Create> :
        currentPage == "services" ? <Services setCurrentPage={setCurrentPage}></Services> :
        <ServiceActions setCurrentPage={setCurrentPage} currentPage={currentPage}></ServiceActions>
      }
    </div>
  );
}