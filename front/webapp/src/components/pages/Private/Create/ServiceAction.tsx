import './ServiceAction.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../../../Button';
import { Color } from '@mui/material';
import { AboutDotJson } from '../../../../interfaces/aboutDotJson';
import { ActionReaction } from '../../../../interfaces/aboutDotJson';
import { Service } from '../../../../interfaces/aboutDotJson';
import { PostArea } from "../../../../interfaces/postArea";
import { ActionReactionParameters } from '../../../../interfaces/aboutDotJson';
import { json } from 'stream/consumers';
import { Navigate } from 'react-router-dom';

interface ServiceActionsProps {
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>
    currentPage: string
}

interface ServiceActionProps {
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>
    actionInfos: ActionReaction
    color: string
    currentPage: string
    selectedArea: PostArea
    setMode: React.Dispatch<React.SetStateAction<actionReactionInfos | undefined>>
}

interface actionReactionInfos {
    infos: ActionReaction
    type: string
}

export function getBetterNames(name: string) {
    let name_length = name.length
    let betterName = ''

    for (let i = 0; i < name_length; i++)
        betterName += (name[i] == '_' ? " " : name[i]);
    betterName = betterName[0]?.toUpperCase() + betterName.slice(1)

    return (betterName)
}

const ServiceAction: React.FC<ServiceActionProps> = ({ setMode, color, selectedArea, actionInfos, setCurrentPage, currentPage }) => {
    let clearname = ''
    let name_length = actionInfos.name.length
    let whatami = ''

    const handleSelectionClick = () => {
        if (selectedArea.actionName.length > 0) {
            selectedArea.reactionName = actionInfos.name;
            selectedArea.reactionService = currentPage;
            whatami = 'reaction'
        } else {
            selectedArea.actionService = currentPage
            selectedArea.actionName = actionInfos.name
            whatami = 'action'
        }
    
        localStorage.setItem('selectedArea', JSON.stringify(selectedArea))

        if (selectedArea) {
            if (selectedArea.actionParameters.length != actionInfos.parameters.length ||
                selectedArea.reactionParameters.length != actionInfos.parameters.length) {
                setMode({infos: actionInfos, type: whatami})
            } else {
                setCurrentPage("create")
            }
        }
    }

    return (
        <button className='selection-action-button' onClick={() => {handleSelectionClick()}}>
            <div className="service-actions-content-holder" style={{ backgroundColor: color }}>
                <div className="service-action-name">
                    <div>{clearname}</div>
                </div>
                <div className="service-action-description">
                    <div>{actionInfos.description}</div>
                </div>
            </div>
        </button>
    );
}

const ServiceActions: React.FC<ServiceActionsProps> = ({ setCurrentPage, currentPage }) => {
    const [services, setServices] = useState<Service | undefined>();
    const [selectedArea, setSelectedArea] = useState<PostArea | undefined>()
    const [mode, setMode] = useState<actionReactionInfos | undefined>()

    let token = localStorage.getItem('userToken');

    const handleInputChange = (index: number, value: string, name: string) => {
        if (mode?.type == "action" && selectedArea) {
          selectedArea.actionParameters[index] = {name: name, input: value};
        }
        if (mode?.type == "reaction" && selectedArea) {
          selectedArea.reactionParameters[index] = {name: name, input: value};
        }
    }

    const createArea = async (toPost: PostArea, setCurrentPage: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            const response = await axios.post('http://localhost:8080/areas', toPost, { headers: { Authorization: `Bearer ${token}` } });
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
        const fetchData = async () => {
            let currArea: PostArea = JSON.parse(localStorage.getItem('selectedArea') || 'null') || {
                actionService: '',
                reactionService: '',
                actionName: '',
                reactionName: '',
                actionParameters: [],
                reactionParameters: [],
            };
            setSelectedArea(currArea)

            try {
                const response = await axios.get('http://localhost:8080/about/about.json', { headers: { Authorization: `Bearer ${token}` } });
                if (response.data) {
                    let service = response.data.server.services;
                    const currentService = service.find((service: Service) => service.name === currentPage);
                    setServices(currentService);
                    console.log(service)
                }
            } catch (error) {
                console.error("Error while fetching areas");
            }
        }
        fetchData();
    }, []);

    if (!services)
        return null

    let uppername = services.name[0]?.toUpperCase() + services.name.slice(1)

    return (
        <div className="container">
            <div>
                <div className='cancel-bar' style={{ backgroundColor: services.color }}>
                    <button className='back-button' style={{ color: 'white' }} onClick={() => { setCurrentPage("services") }}>
                        Back
                    </button>
                    <div className='service-txt' style={{ color: 'white' }}>
                        <div>{selectedArea && selectedArea.actionName.length == 0 ? "Choose a trigger" : "Choose a reaction"}</div>
                    </div>
                </div>
                <div className='thin-line' style={{ backgroundColor: 'white', opacity: 0.5 }}></div>
                <div className='service-infos' style={{ backgroundColor: services.color }}>
                    <div className="service-actions-presentation-holder">
                        <div className="service-logo-holder">
                            <img
                                alt="logo"
                                className="service-logo"
                                src={services.name !== 'none' ? require(`../../../../../public/servicesLogo/${services.name}.png`) : ''}
                            />
                        </div>
                        <div className="service-description">
                            <div>{uppername}</div>
                        </div>
                    </div>
                </div>
            </div>
            {mode ? (
                <div className='action-parameters'>
                    <div className='action-parameters-name'>{getBetterNames(mode.infos.name)}</div>
                    {mode.infos.parameters.map((item, index) => (
                        <>
                        <input
                            type="searchInput"
                            className={'input'}
                            placeholder={item.input} 
                            required
                            key={index}
                            style={{marginTop: '2%'}}
                            onChange={(e) => handleInputChange(index, e.target.value, item.name)}
                        />

                        </>
                    ))}
                    <button className='add-action-btn' style={{marginLeft: 0, marginTop: '10%', border: '1px solid'}} onClick={() => { if (selectedArea){createArea(selectedArea, setCurrentPage)} }}>
                        Add
                    </button>
                </div>
            ) :
                <div className="services-actions-holder">
                    {selectedArea ? (selectedArea.actionName.length > 0 ? (
                        services.reactions.map((item, index) => (
                        <ServiceAction setMode={setMode} key={index} selectedArea={selectedArea} color={services.color} actionInfos={item} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
                        ))
                    ) : (
                        services.actions.map((item, index) => (
                        <ServiceAction setMode={setMode} key={index} selectedArea={selectedArea} color={services.color} actionInfos={item} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
                        ))
                    )) : ''}
                </div>
            }
        </div>
    );
}

export default ServiceActions