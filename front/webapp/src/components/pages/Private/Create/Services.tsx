import { Button } from '../../../Button';
import React, { useEffect, useState } from 'react';
import './Services.css';
import axios from 'axios';

interface ServicesProps {
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

interface ServiceProps<T> {
    serviceInfos: T;
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const Service: React.FC<ServiceProps<any>> = ({ serviceInfos, setCurrentPage }) => {
    let initialName = serviceInfos.name
    const upperName = initialName[0].toUpperCase() + initialName.slice(1);
    const image = require(`../../../../../public/servicesLogo/${initialName}.png`)
    let token = localStorage.getItem('userToken');

    const selectArea = async () => {
        console.log(`http://localhost:8080/connect/${initialName}`)
        try {
            const response = await fetch(`http://localhost:8080/connect/${initialName}`, { headers: {Authorization: `Bearer ${token}`}});
            if (response.status == 200) {
                console.log("everything fine")
            } else {
                console.log("everything not fine, code: ", response.status)
            }
        } catch (error) {
            console.error("Error connecting to: ", initialName);
        }
    }

    return (
        <a href={`http://localhost:8080/connect/${initialName}?token=${token}`}>
            <button className='selection-button'>
                <div className="service-content-holder" style={{ backgroundColor: serviceInfos.color }}>
                    <div className="service-logo-holder">
                        <img alt="logo" className="service-logo" src={image}></img>
                    </div>
                    <div className="service-description">
                        <div>{upperName}</div>
                    </div>
                </div>
            </button>
        </a>
    );
}

const Services: React.FC<ServicesProps> = ({ setCurrentPage }) => {
    const [searchInput, setSearchInput] = useState('');
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            let token = localStorage.getItem('userToken');
            try {
                const response = await axios.get('http://localhost:8080/about/about.json', { headers: { Authorization: `Bearer ${token}` } });
                if (response.data) {
                    setServices(response.data.server.services)
                }
            } catch (error) {
                console.error("Error while fetching areas");
            }
        }

        fetchData();
    }, []);

    return (
        <div>
            <div className='cancel-bar'>
                <button className='back-button' onClick={() => {setCurrentPage("create")}}>
                    Cancel
                </button>
                <div className='service-txt'>Choose a service</div>
            </div>
            <div className='thin-line'></div>
            <div className="services-container">
                <div className="top-searchbar-holder">
                    <img className="top-searchbar-image" src={`${process.env.PUBLIC_URL}/search.png`}></img>
                    <input
                        type="searchInput"
                        className='input'
                        placeholder='Search'
                        value={searchInput}
                        required
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>
                <div className="services-holder">
                    {services.map((service, index) => (
                        <Service
                            key={index}
                            serviceInfos={service}
                            setCurrentPage={setCurrentPage}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Services