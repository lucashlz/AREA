import React, { useEffect, useState } from 'react';
import './Applets.css';
import { Button } from '../Button';
import { Navigate, redirect } from 'react-router-dom';

interface AppletProps {
  logo_paths: string[];
  applet_desc: string;
  onoff: string;
}

const Applet: React.FC<AppletProps> = ({ logo_paths, applet_desc, onoff }) => {
  const [status, setStatus] = useState(onoff);
  const toogleStatus = () => {
    status === "on" ? setStatus("off") : setStatus("on") 
  }
  return (
    <>
      <div className="applet-content-holder" style={{ backgroundColor: status === "on" ? "#0066FF" : "#565656" }}>
        <div className='applet-content-container'>
          {logo_paths.map((item, index) => (
            <div className="applet-logo-holder" key={index}>
              <img alt="logo" className="applet-logo" src={item}></img>
            </div>
          ))}
        </div>
        <div className="applet-description">
          <div>{applet_desc}</div>
        </div>
        <button className={status === "on" ? "applet-status-on" : "applet-status-off"} onClick={toogleStatus}>
          <div className={`applet-status-ball ${status === "on" ? 'translated': ''}`}>
          </div>
        </button>
      </div>
    </>
  );
}

export default function Applets() {
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className="applets-container">
      <div className="applets-msg-holder">
        <p className="applets-msg">My Applets</p>
      </div>

      <div className="applets-searchbar-holder">
        <img className="applets-searchbar-image" src={`${process.env.PUBLIC_URL}/search.png`}></img>
        <input
            type="searchInput"
            className='input'
            placeholder='Search'
            value={searchInput}
            required
            onChange={(e) => setSearchInput(e.target.value)}
          />
      </div>
      <div className="applets-holder">
        <Applet logo_paths={[`${process.env.PUBLIC_URL}/search.png`, `${process.env.PUBLIC_URL}/search.png`]} applet_desc="Une description vraiiiiiiment" onoff="off" />
      </div>
    </div>
  );
}
