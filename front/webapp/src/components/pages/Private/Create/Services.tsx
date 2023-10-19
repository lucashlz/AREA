import { Button } from '../../../Button';
import React, { useEffect, useState } from 'react';
import './Services.css';
import axios from 'axios';
import { ServiceOAuthConstants } from '../../../../interfaces/serviceConnect';
import { getServiceAuthorizeByName } from '../../../../interfaces/serviceConnect';
import { postService } from '../../../../interfaces/postArea';
import Input from '../../../Input';
import { TriggerReaction } from '../../../../interfaces/postArea';
import { getLocalSelectedArea } from '../../../../interfaces/postArea';

interface ServicesProps {
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

interface ServiceProps<T> {
    serviceInfos: T;
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const Service: React.FC<ServiceProps<any>> = ({ serviceInfos, setCurrentPage }) => {
    const [serviceOAuthConstants, setServiceOAuthConstants] = useState<ServiceOAuthConstants | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [selectedArea, setSelectedArea] = useState<postService>()
    let initialName = serviceInfos.name;
    const upperName = initialName[0].toUpperCase() + initialName.slice(1);
    const image = require(`../../../../../public/servicesLogo/${initialName}.png`);
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        const checkConnect = async () => {
            const response = await axios.get('http://localhost:8080/profile', { headers: { Authorization: `Bearer ${token}` } });
            if (response.status == 200) {
                if (response.data.connectServices.includes(initialName)) {
                    setIsConnected(true)
                }
            } else {
                console.error("Cannot get user datas")
            }
        }
        checkConnect()
        setSelectedArea(getLocalSelectedArea())
    }, [])

    useEffect(() => {
        if (!isConnected) {
            let serviceAuthorize = getServiceAuthorizeByName(initialName)

            if (serviceOAuthConstants) {
                if (serviceAuthorize) {
                    const serviceURL = new URL(serviceAuthorize);
                    serviceURL.searchParams.append("client_id", serviceOAuthConstants.clientId);
                    serviceURL.searchParams.append("response_type", "code");
                    serviceURL.searchParams.append("redirect_uri", serviceOAuthConstants.redirectUri);
                    serviceURL.searchParams.append("scope", serviceOAuthConstants.scopes.join(" "));
                    serviceURL.searchParams.append("state", serviceOAuthConstants.oAuthSessionId);

                    const popupWidth = 800;
                    const popupHeight = 600;

                    const popup = window.open(serviceURL.href, '_blank', `width=${popupWidth},height=${popupHeight},menubar=no,toolbar=no,location=no`);
                    if (popup) {
                        popup.focus();
                    }
                    setCurrentPage(initialName)
                } else {
                    console.error("cannot get ", initialName, ' in array')
                }
            }
        }
    }, [serviceOAuthConstants])

    if (selectedArea) {
        if (selectedArea.trigger.name.length == 0) {
            if (serviceInfos.triggers.length == 0)
                return <></>
        } else {
            if (serviceInfos.actions.length == 0)
                return <></>
        }
    }

    const getOAuthConstants = async () => {
        const headers = {
            Authorization: `Bearer ${token}`
        };

        try {
            const response = await axios.get(`http://localhost:8080/connect/get${upperName}OAuthConstants`, { headers: headers });
            if (response.status === 200) {
                setServiceOAuthConstants(response.data);
            }
        } catch (error) {
            console.error("Error fetching Service OAuth constants:", error);
        }
    }

    const selectArea = async () => {
        if (!isConnected) {
            if (!getServiceAuthorizeByName(initialName) || isConnected) {
                setCurrentPage(initialName)
            } else {
                await getOAuthConstants()
            }
        } else {
            setCurrentPage(initialName)
        }
    }

    return (
        <button className='selection-button' onClick={() => { selectArea() }}>
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
    const [services, setServices] = useState<TriggerReaction[]>([]);

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

    if (!services)
        return <></>

    return (
        <div>
            <div className='cancel-bar'>
                <button className='back-button' onClick={() => { setCurrentPage("create") }}>
                    Cancel
                </button>
                <div className='service-txt'>Choose a service</div>
            </div>
            <div className='thin-line'></div>
            <div className="services-container">
                <div className="applets-searchbar-holder" style={{marginTop: "3rem"}}>
                    <Input onChange={(e) => setSearchInput(e.target.value)} placeholder='Search' type='searchInput' value={searchInput} icon={`${process.env.PUBLIC_URL}/search.png`} />
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