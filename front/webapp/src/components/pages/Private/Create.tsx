import React, { useContext, useState } from 'react';
import { UserContext } from "../../../context/userContext";
import { Outlet, Navigate, Link } from "react-router-dom";
import './Create.css';
import { Button } from '../../Button';

interface IftttProps {
  ifttt_name: string;
  is_current: boolean;
}

const IftttSquare: React.FC<IftttProps> = ({ ifttt_name, is_current }) => {
  var color = '#000000' 
  if (!is_current)
    color = '#BCBCBC'

  return (
    <div className='ifttt-rectangle' style={{backgroundColor: color}}>
      <div className='ifttt-rectangle-text'>{ifttt_name}</div>
      {is_current ?
        <Link to={"/applets"} className={"ifttt-add-btn-link"}>
          <button className='add-action-btn'>
            Add
          </button>
        </Link>
      : ''}
    </div>
  );
}

const Create: React.FC = () => {
  const userContext = useContext(UserContext);
  const [currrent, setCurrent] = useState('this')

  if (!userContext) {
    throw new Error("Private must be used within a UserContextProvider");
  }

  const { token } = userContext;

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <Outlet />
      <div className='cancel-bar'>
        <Button linkTo="/applets" type="button" buttonStyle='bordered-button' buttonSize="btn--medium">
          Cancel
        </Button>
      </div>
      <div className='thin-line'></div>
      <div className='ifttt'>
        <IftttSquare ifttt_name='If This' is_current={currrent == 'this' ? true : false}></IftttSquare>
        <div className='ifttt-link-line'></div>
        <IftttSquare ifttt_name='Then That' is_current={currrent == 'that' ? true : false}></IftttSquare>
      </div>
    </div>
  );
}

export default Create;
