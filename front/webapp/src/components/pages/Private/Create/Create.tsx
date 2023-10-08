import { Outlet } from "react-router-dom";
import './Create.css';
import { Button } from '../../../Button';
import React, { useEffect, useState } from 'react';
import { PostArea } from "../../../../interfaces/postArea";
import { Service } from "../../../../interfaces/aboutDotJson";
import axios from "axios";
import { getBetterNames } from "./ServiceAction";

interface IftttProps {
  ifttt_name: string;
  is_current: boolean;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  selectedArea: PostArea
}

const IftttSquare: React.FC<IftttProps> = ({ ifttt_name, is_current, setCurrentPage, selectedArea }) => {
  const [services, setServices] = useState<Service | undefined>();
  var serviceName = ''
  var action = ''
  var color = ''

  if (ifttt_name == "If This" && selectedArea.actionName.length > 0) {
    serviceName = selectedArea.actionService
    action = selectedArea.actionName
    ifttt_name = "If"
  }
  if (ifttt_name == "Then That" && selectedArea.reactionName.length > 0) {
    serviceName = selectedArea.reactionService
    action = selectedArea.reactionName
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
          const currentService = service.find((service: Service) => service.name === serviceName);
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
  const [selectedArea, setSelectedArea] = useState<PostArea | undefined>()
  const [reload, setReload] = useState(1)

  const resetCreation = () => {
    localStorage.removeItem('selectedArea')
    window.location.reload();
  }

  const setCreation = () => {
    
  }

  useEffect(() => {
    let selectedArea: PostArea = JSON.parse(localStorage.getItem('selectedArea') || 'null') || {
      actionService: '',
      reactionService: '',
      actionName: '',
      reactionName: '',
      actionParameters: [],
      reactionParameters: [],
    };

    setSelectedArea(selectedArea)
    if (selectedArea && selectedArea.actionName.length > 0)
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
        {selectedArea.reactionName.length > 0 ?
            <div className={"ifttt-add-btn-link"} style={{justifyContent: 'space-around'}}>
              <button className='add-action-btn' style={{marginLeft: 0, marginTop: '10%', border: '1px solid'}} onClick={() => { setCreation() }}>
                Add
              </button>
              <button className='add-action-btn' style={{marginLeft: 0, marginTop: '10%', border: '1px solid'}} onClick={() => { resetCreation() }}>
                Reset
              </button>
            </div>
            : ''}
      </div>
    </div>
  );
}

export default Create