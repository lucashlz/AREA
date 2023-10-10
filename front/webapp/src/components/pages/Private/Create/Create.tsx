import { Outlet } from "react-router-dom";
import './Create.css';
import { Button } from '../../../Button';
import React, { useEffect, useState } from 'react';
import { postService } from "../../../../interfaces/postArea";
import { aboutService } from "../../../../interfaces/aboutDotJson";
import axios from "axios";
import { getBetterNames } from "./ServiceAction";
import { Navigate } from 'react-router-dom';

interface IftttProps {
  ifttt_name: string;
  is_current: boolean;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  selectedArea: postService
}

const IftttSquare: React.FC<IftttProps> = ({ ifttt_name, is_current, setCurrentPage, selectedArea }) => {
  const [services, setServices] = useState<aboutService | undefined>();
  var serviceName = ''
  var action = ''
  var color = ''

  if (ifttt_name == "If This" && selectedArea.action && selectedArea.action.name.length > 0) {
    serviceName = selectedArea.action.service
    action = selectedArea.action.name
    ifttt_name = "If"
  }
  if (ifttt_name == "Then That" && selectedArea.reactions && selectedArea.reactions[0].name.length > 0) {
    serviceName = selectedArea.reactions[0].service
    action = selectedArea.reactions[0].name
    ifttt_name = "Then"
  }

  let actionName = getBetterNames(action)

  useEffect(() => {
    const fetchData = async () => {
      let token = localStorage.getItem('userToken');
      try {
        const response = await axios.get('http://localhost:8080/about/about.json', { headers: { Authorization: `Bearer ${token}` } });
        if (response.data) {
          let service = response.data.server.services;
          const currentService = service.find((service: aboutService) => service.name === serviceName);
          setServices(currentService);
        }
      } catch (error) {
        console.error("Error while fetching areas");
      }
    }
    fetchData();
  }, []);

  color = services ? services.color : (!is_current ? '#BCBCBC' : '#000000')

  return (
    <div className='ifttt-rectangle' style={{ backgroundColor: color }}>
      <div className='ifttt-rectangle-text'>{ifttt_name}</div>
      {is_current && !services ?
        <div className={"ifttt-add-btn-link"}>
          <button className='add-action-btn' onClick={() => { setCurrentPage("services") }}>
            Add
          </button>
        </div>
        : ''}
      {services ?
        <>
          <div className="service-logo-holder" style={{ width: '15%', marginBottom: '0%', marginLeft: '3%' }}>
            <img
              alt="logo"
              className="service-logo"
              src={services ? require(`../../../../../public/servicesLogo/${services.name}.png`) : ''}
            />
          </div>
          <div className="create-action-name-container">
            <div className="create-action-name">
              {actionName}
            </div>
          </div>
        </>
        : ''}
    </div>
  );
}

interface CreateProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const Create: React.FC<CreateProps> = ({ setCurrentPage }) => {
  const [current, setCurrent] = useState('this')
  const [selectedArea, setSelectedArea] = useState<postService | undefined>()
  const [reload, setReload] = useState(1)

  const resetCreation = () => {
    localStorage.removeItem('selectedArea')
    window.location.reload();
  }

  const setCreation = async () => {
    let area = localStorage.getItem('selectedArea')
    let token = localStorage.getItem('userToken')

    try {
      const response = await axios.post('http://localhost:8080/areas', area, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status == 200) {
          <Navigate to="/applets" replace />
      } else {
          console.log("error creating area: code[", response.status, "]")
      }
    } catch (error) {
        console.error("Error creating areas");
    }
  }

  useEffect(() => {
    let selectedArea: postService = JSON.parse(localStorage.getItem('selectedArea') || 'null') || {
      action: {
        name: '',
        service: '',
        parameters: [{name: '', input: ''}] 
      },
      reactions: [
        {
          name: '',
          service: '',
          parameters: [{name: '', input: ''}]
        }
      ]
    };

    setSelectedArea(selectedArea)
    if (selectedArea.action && selectedArea.action.name.length > 0)
      setCurrent('that')
  }, [])

  if (!selectedArea)
    return <></>

  return (
    <div className="ifttt-container">
      <Outlet />
      <div className='ifttt'>
        <IftttSquare ifttt_name='If This' selectedArea={selectedArea} is_current={current == 'this' ? true : false} setCurrentPage={setCurrentPage}></IftttSquare>
        <div className='ifttt-link-line'></div>
        <IftttSquare ifttt_name='Then That' selectedArea={selectedArea} is_current={current == 'that' ? true : false} setCurrentPage={setCurrentPage}></IftttSquare>
        {selectedArea.reactions && selectedArea.reactions[0].name.length > 0 ?
          <div className={"ifttt-add-btn-link"} style={{ justifyContent: 'space-around' }}>
            <button className='add-action-btn' style={{ marginLeft: 0, marginTop: '10%', border: '1px solid' }} onClick={() => { setCreation() }}>
              Add
            </button>
            <button className='add-action-btn' style={{ marginLeft: 0, marginTop: '10%', border: '1px solid' }} onClick={() => { resetCreation() }}>
              Reset
            </button>
          </div>
          : ''}
      </div>
    </div>
  );
}

export default Create