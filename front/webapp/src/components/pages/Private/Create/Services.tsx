import { Button } from '../../../Button';
import React, { useEffect, useState } from 'react';
import './Services.css';
import axios from 'axios';
import { ServiceOAuthConstants } from '../../../../interfaces/serviceConnect';
import { getServiceAuthorizeByName } from '../../../../interfaces/serviceConnect';
import { servicesAuthorize } from '../../../../interfaces/serviceConnect';

interface ServicesProps {
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

interface ServiceProps<T> {
    serviceInfos: T;
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const Service: React.FC<ServiceProps<any>> = ({ serviceInfos, setCurrentPage }) => {
    const [serviceOAuthConstants, setServiceOAuthConstants] = useState<ServiceOAuthConstants | null>(null);
    let initialName = serviceInfos.name;
    const upperName = initialName[0].toUpperCase() + initialName.slice(1);
    const image = require(`../../../../../public/servicesLogo/${initialName}.png`);

    useEffect(() => {

        async function fetchServiceOAuthConstants() {
            let serviceAuthorize = getServiceAuthorizeByName(initialName)
            if (serviceAuthorize) {
                const token = localStorage.getItem('userToken');
                const headers = {
                    Authorization: `Bearer ${token}`
                };

                try {
                    const response = await axios.get(`http://localhost:8080/connect/get${upperName}OAuthConstants`, { headers: headers});
                    if (response.status === 200) {
                        setServiceOAuthConstants(response.data);
                    }
                } catch (error) {
                    console.error("Error fetching Service OAuth constants:", error);
                }
            }
        }

        fetchServiceOAuthConstants();
    }, []);

    const selectArea = async () => {
        let serviceAuthorize = getServiceAuthorizeByName(initialName)
        if (serviceOAuthConstants) {
            if (serviceAuthorize) {
                const serviceURL = new URL(serviceAuthorize);
                serviceURL.searchParams.append("client_id", serviceOAuthConstants.clientId);
                serviceURL.searchParams.append("response_type", "code");
                serviceURL.searchParams.append("redirect_uri", serviceOAuthConstants.redirectUri);
                serviceURL.searchParams.append("scope", serviceOAuthConstants.scopes.join(" "));
                serviceURL.searchParams.append("state", serviceOAuthConstants.oAuthSessionId);
                localStorage.setItem('selectedService', initialName)
                window.location.href = serviceURL.href;
            } else {
                console.log("cannot get ", initialName, ' in array')
            }
        } else {
            setCurrentPage(initialName)
        }
    }

    return (
        <button className='selection-button' onClick={selectArea}>
            <div className="service-content-holder" style={{ backgroundColor: serviceInfos.color }}>
                <div className="service-logo-holder">
                    <img alt="logo" className="service-logo" src={image}></img>
                </div>
                <div className="service-description">
                    <div>{upperName}</div>
                </div>
            </div>
        </button>
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