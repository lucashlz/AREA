import React, { useContext, useEffect, useState } from 'react';
import './Applets.css';
import { Button } from '../../Button';
import { Navigate, redirect } from 'react-router-dom';
import { IUserContext, UserContext } from '../../../context/userContext';
import axios from 'axios';
import Input from '../../Input';
import { postService } from '../../../interfaces/postArea';

interface AppletProps<T> {
  item: postService;
  onoff: string;
}

const Applet: React.FC<AppletProps<any>> = ({onoff, item}) => {
  const [status, setStatus] = useState(onoff);
  const toogleStatus = () => {
    status === "on" ? setStatus("off") : setStatus("on")
  }

  const { setToken, token} = useContext(UserContext) as IUserContext;

  useEffect(() => {
    const checkToken = async() => {
    if (!token) {
      const queryParams = new URLSearchParams(window.location.search);
      const tempToken = queryParams.get('token');
      if (tempToken) {
        console.log("Received google token : ", tempToken);
        setToken(tempToken);
      }
    }
  }
  checkToken();
  }, []);

  console.log("item: ", item)

  return (
      <div className="applet-content-holder" style={{ backgroundColor: status === "on" ? "#0066FF" : "#565656" }}>
        <div className='applet-content-container'>
          <img alt="logo" className="applet-logo" src={`${process.env.PUBLIC_URL}/servicesLogo/${item.trigger ? item.trigger.service : ''}.png`}></img>
          {item.actions.map((item, index) => (
            <img alt="logo" className="applet-logo" src={`${process.env.PUBLIC_URL}/servicesLogo/${item.service}.png`}></img>
          ))}
        </div>
        <div className="applet-description">
          <div>des description</div>
        </div>
        <button className={status === "on" ? "applet-status-on" : "applet-status-off"} onClick={toogleStatus}>
          <div className={`applet-status-ball ${status === "on" ? 'translated': ''}`}>
          </div>
        </button>
      </div>
  );
}

export default function Applets() {
  const [searchInput, setSearchInput] = useState('');
  const [areas, setAreas] = useState<postService[]>([]);

  useEffect(() => {
    const getApplets = async () => {
      let token = localStorage.getItem('userToken');
      const response = await axios.get('http://localhost:8080/areas', { headers: { Authorization: `Bearer ${token}` } });
      if (response.status == 200) {
        setAreas(response.data)
      } else {
        console.log("cannot get areas, resonse: ", response.status)
      }
    }
    getApplets()
  }, [])

  return (
    <div className="applets-container">
      <div className="applets-msg-holder">
        <p className="applets-msg">My Applets</p>
      </div>

      <div className="applets-searchbar-holder">
        <Input onChange={(e) => setSearchInput(e.target.value)} placeholder='Search' type='searchInput' value={searchInput} icon={`${process.env.PUBLIC_URL}/search.png`} />
      </div>
      <div className="applets-holder">
        {areas.length > 0 ? '' : 'No areas created for now'}
        {areas.map((item, index) => (
          <Applet key={index} item={item} onoff="off" />
        ))}
      </div>
    </div>
  );
}
