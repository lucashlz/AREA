import { Outlet } from "react-router-dom";
import './Create.css';
import { Button } from '../../../Button';
import React, { useEffect, useState } from 'react';
import { postService } from "../../../../interfaces/postArea";
import { aboutService } from "../../../../interfaces/aboutDotJson";
import axios from "axios";
import { getBetterNames } from "./ServiceAction";
import { Navigate } from 'react-router-dom';
import { FaFileSignature } from "react-icons/fa";
import { getLocalSelectedArea } from "../../../../interfaces/postArea";
import { selectClasses } from "@mui/material";

interface IftttProps {
  ifttt_name: string;
  is_current: boolean;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  selectedArea: postService
  JSONservices: aboutService[]
  index: number
  refreshPageContent: () => void;
}

const IftttSquare: React.FC<IftttProps> = ({ ifttt_name, is_current, setCurrentPage, selectedArea, JSONservices, index, refreshPageContent }) => {
  var serviceName = ''
  var action = ''
  var services

  if (ifttt_name == "If This" && selectedArea.trigger && selectedArea.trigger.name.length > 0) {
    serviceName = selectedArea.trigger.service
    action = selectedArea.trigger.name
    ifttt_name = "If"
  }
  if (ifttt_name == "Then That" && selectedArea.actions && selectedArea.actions[index].name.length > 0) {
    serviceName = selectedArea.actions[index].service
    action = selectedArea.actions[index].name
    ifttt_name = "Then"
  }

  let actionName = getBetterNames(action)

  if (JSONservices) {
    const serv = JSONservices.find((JSONservice: aboutService) => JSONservice.name === serviceName);
    if (serv)
      services = serv
  }

  var color = services ? services.color : (!is_current ? '#BCBCBC' : '#000000')

  const deleteStep = () => {
    if (index == -1) {
      selectedArea.trigger = {
        service: '',
        name: '',
        parameters: []
      }
    }
    if (index >= 0) {
      if (index === 0 && selectedArea.actions.length === 1) {
        selectedArea.actions[0] = {
          service: '',
          name: '',
          parameters: []
        }
      }
      if (selectedArea.actions.length > 1) {
        selectedArea.actions.splice(index, 1)
      }
    }
    localStorage.setItem('selectedArea', JSON.stringify(selectedArea));
    refreshPageContent()
  }

  return (
    <div className='ifttt-rectangle' style={{ backgroundColor: color }}>
      <div className='ifttt-rectangle-text'>{ifttt_name}</div>
      {is_current && !services ?
        <div className="ifttt-add-btn-link">
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
            <button className="delete-applet" style={{ height: '35%' }} onClick={deleteStep}>
              <img className="delete-applet-img" src={`${process.env.PUBLIC_URL}/bin.png`}></img>
            </button>
        </>
        : ''}
      {!services && (index > 0 || selectedArea.actions.length > 1) && !(index === -1 && selectedArea.trigger.name === '') ?
        <>
          <button className="delete-applet" style={{ height: '35%' }} onClick={deleteStep}>
            <img className="delete-applet-img" src={`${process.env.PUBLIC_URL}/bin.png`}></img>
          </button>
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
  const [selectedArea, setSelectedArea] = useState<postService>()
  const [services, setServices] = useState<aboutService[]>([])
  const [error, setError] = useState('')
  const [requestIsGood, setRequestIsGood] = useState(false)
  const [refresh, setRefresh] = useState(0)

  const refreshPageContent = () => {
    let area = getLocalSelectedArea()
    setSelectedArea(area)
    if (area.trigger && area.trigger.name.length > 0)
      setCurrent('that')
    else {
      setCurrent('this')
    }
    setRefresh(Math.random())
  }

  useEffect(() => {
    let area = getLocalSelectedArea()
    setSelectedArea(getLocalSelectedArea())
    if (area.trigger && area.trigger.name.length > 0)
      setCurrent('that')

    const fetchAboutJSON = async () => {
      let token = localStorage.getItem('userToken');
      try {
        const response = await axios.get('http://localhost:8080/about/about.json', { headers: { Authorization: `Bearer ${token}` } });
        if (response.data) {
          let service = response.data.server.services;
          setServices(service);
        }
      } catch (error) {
        console.error("Error while fetching areas");
      }
    }
    fetchAboutJSON();
  }, [])

  const resetCreation = () => {
    localStorage.removeItem('selectedArea')
    refreshPageContent()
  }

  const addBlankAction = () => {
    selectedArea?.actions.push({
      service: '',
      name: '',
      parameters: []
    })
    localStorage.setItem('selectedArea', JSON.stringify(selectedArea));
    setRefresh(Math.random())
  }

  const setCreation = async () => {
    setError('')
    let area = getLocalSelectedArea()
    let token = localStorage.getItem('userToken')
    try {
      const response = await axios.post('http://localhost:8080/areas', area, { headers: { Authorization: `Bearer ${token}` } })
      if (response.status == 200) {
        setRequestIsGood(true)
        localStorage.removeItem('selectedArea')
      } else {
        setError(response.data.message)
      }
    } catch (error) {
      setError("Incorrect Trigger/Actions Parameters")
    }
  }

  if (requestIsGood) {
    return <Navigate to="/applets" replace />;
  }

  if (!selectedArea)
    return <></>

  return (
    <div className="ifttt-container" key={refresh}>
      <Outlet />
      <div className='ifttt'>
        <IftttSquare JSONservices={services} ifttt_name='If This' selectedArea={selectedArea} is_current={current == 'this' ? true : false} setCurrentPage={setCurrentPage} index={-1} refreshPageContent={refreshPageContent}></IftttSquare>
        {selectedArea.actions.map((item, index) => (
          <>
            <div className='ifttt-link-line'></div>
            <IftttSquare JSONservices={services} ifttt_name='Then That' selectedArea={selectedArea} is_current={current == 'that' ? true : false} setCurrentPage={setCurrentPage} index={index} refreshPageContent={refreshPageContent}></IftttSquare>
          </>
        ))}
        <div className='ifttt-error-message'>{error != '' ? error : ''}</div>
        {selectedArea.actions && selectedArea.actions[selectedArea.actions.length - 1].name.length > 0 && selectedArea.trigger.name.length > 0 ?
          <>
            <button className='add-then-button' style={{ marginLeft: 0, border: '1px solid' }} onClick={() => { addBlankAction() }}>
              +
            </button>
            <div className="ifttt-add-btn-link" style={{ justifyContent: 'space-around' }}>
              <button className='add-action-btn' style={{ marginLeft: 0, border: '1px solid' }} onClick={() => { setCreation() }}>
                Add
              </button>
              <div className="horizontal-spacer"></div>
              <button className='add-action-btn' style={{ marginLeft: 0, border: '1px solid' }} onClick={() => { resetCreation() }}>
                Reset
              </button>
            </div>
          </>
          : ''}
      </div>
    </div>
  );
}

export default Create