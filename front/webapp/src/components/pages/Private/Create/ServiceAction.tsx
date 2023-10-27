import './ServiceAction.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { aboutService } from '../../../../interfaces/aboutDotJson';
import { postService } from "../../../../interfaces/postArea";
import { Navigate } from 'react-router-dom';
import { TriggerActions } from '../../../../interfaces/aboutDotJson';
import { getLocalSelectedArea } from '../../../../interfaces/postArea';
import { Ingredient } from '../../../../interfaces/aboutDotJson';
import Input from '../../../Input';
import { TriggerReactionParameters } from '../../../../interfaces/postArea';

interface ServiceActionsProps {
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>
    currentPage: string
}

interface ServiceActionProps {
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>
    actionInfos: TriggerActions
    color: string
    currentPage: string
    selectedArea: postService
    setMode: React.Dispatch<React.SetStateAction<actionReactionInfos | undefined>>
}

interface actionReactionInfos {
    infos: TriggerActions
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
    let whatami = ''

    const handleSelectionClick = () => {
        if (selectedArea.trigger && selectedArea.trigger.name.length > 0) {
            selectedArea.actions[selectedArea.actions.length - 1].service = currentPage
            selectedArea.actions[selectedArea.actions.length - 1].name = actionInfos.name
            whatami = 'actions'
        } else if (selectedArea.trigger) {
            selectedArea.trigger.name = actionInfos.name;
            selectedArea.trigger.service = currentPage;
            whatami = 'trigger'
        }

        if (actionInfos.parameters.length == 0)
            localStorage.setItem('selectedArea', JSON.stringify(selectedArea))

        if (selectedArea) {
            if (actionInfos.parameters.length != 0) {
                if (actionInfos.ingredients) {
                    localStorage.setItem('selectedIngredients', JSON.stringify(actionInfos.ingredients))
                }
                setMode({ infos: actionInfos, type: whatami })
            } else {
                if (actionInfos.ingredients) {
                    localStorage.setItem('selectedIngredients', JSON.stringify(actionInfos.ingredients))
                }
                setCurrentPage("create")
            }
        }
    }

    return (
        <button className='selection-action-button' onClick={() => { handleSelectionClick() }}>
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
    const [services, setServices] = useState<aboutService | undefined>();
    const [selectedArea, setSelectedArea] = useState<postService>()
    const [mode, setMode] = useState<actionReactionInfos | undefined>()
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [parametersInput, setParametersInput] = useState<string[]>(['']);
    const [parametersNames, setParametersNames] = useState<string[]>(['']);

    let token = localStorage.getItem('userToken');

    useEffect(() => {
        const fetchData = async () => {
            let area = getLocalSelectedArea()
            setSelectedArea(area)

            try {
                const response = await axios.get('http://localhost:8080/about/about.json', { headers: { Authorization: `Bearer ${token}` } });
                if (response.data) {
                    let service = response.data.server.services;
                    const currentService = service.find((service: aboutService) => service.name === currentPage);

                    setServices(currentService);
                }
            } catch (error) {
                console.error("Error while fetching areas");
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const getIngredients = () => {
            let localIngredients = localStorage.getItem('selectedIngredients')
            if (localIngredients)
                setIngredients(JSON.parse(localIngredients))
        }
        getIngredients();
    }, [mode]);

    const submitParams = () => {
        if (mode && selectedArea) {
            for (let i = 0; i < mode.infos.parameters.length - 1; i++) {
                if (mode.type === "trigger") {
                    selectedArea.trigger.parameters[i] = {name: parametersNames[i], input: parametersNames[i]}
                }
                if (mode.type === "actions") {
                    selectedArea.actions[selectedArea.actions.length - 1].parameters[i] = {name: parametersNames[i], input: parametersInput[i]}
                }
            }
        }
        localStorage.setItem('selectedArea', JSON.stringify(selectedArea));
        localStorage.removeItem('selectedIngredients');
        setCurrentPage("create")
    }

    const handleIngredientChange = (ingredientName: string, index: number) => {
        setParametersInput(prev => {
            const updatedInputs = [...prev];
            if (updatedInputs[index] == undefined) {
                updatedInputs[index] = `<${ingredientName}>`;
            } else
                updatedInputs[index] += `<${ingredientName}>`;
            return updatedInputs;
        });
    }

    const handleInputChange = (index: number, value: string, name: string) => {
        setParametersNames(prev => {
            const updatedNames = [...prev];
            updatedNames[index] = name;
            return updatedNames;
        });

        setParametersInput(prev => {
            const updatedInputs = [...prev];
            updatedInputs[index] = value;
            return updatedInputs;
        });
    }

    if (!services)
        return null

    let uppername = services.name[0]?.toUpperCase() + services.name.slice(1)

    return (
        <div className="container">
            <div>
                <div className='cancel-bar' style={{ backgroundColor: services.color }}>
                    <button className='back-button' style={{ color: 'white' }} onClick={() => {
                        if (mode && mode.infos.parameters.length > 0) {
                            if (mode.type == "trigger" && selectedArea) {
                                selectedArea.trigger = { name: '', service: '', parameters: [{ name: '', input: '' }] };
                                localStorage.removeItem('selectedIngredients');
                            }
                            if (mode.type == "actions" && selectedArea)
                                selectedArea.actions[selectedArea.actions.length - 1] = { name: '', service: '', parameters: [{ name: '', input: '' }] };
                            setMode(undefined);
                        } else {
                            setCurrentPage("services")
                        }
                    }}>
                        Back
                    </button>
                    <div className='service-txt' style={{ color: 'white' }}>
                        <div>{selectedArea?.trigger?.name?.length == 0 ? "Choose a trigger" : mode ? "Choose parameters" : "Choose an action"}</div>
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
            {mode && mode.infos.parameters.length > 0 ? (
                <div className='action-parameters'>
                    <form onSubmit={(e) => { e.preventDefault(); submitParams(); }}>
                        <div className='action-parameters-name'>{getBetterNames(mode.infos.name)}</div>
                        {mode.infos.parameters.map((item, index) => (
                            <div key={index}>
                                {selectedArea ?
                                    <Input
                                        onChange={(e) => handleInputChange(index, e.target.value, item.name)}
                                        placeholder={item.input}
                                        type='searchInput'
                                        value={parametersInput[index]}
                                        required={!item.optional}
                                    />
                                    : ''}
                                {selectedArea && mode.type === "actions" && ingredients.length > 0 ?
                                    <div>
                                        <select className='ingredient-pick'>
                                            <option key={-1} value={"Ingredients"} selected>{"Ingredients"}</option>
                                            {ingredients.map((ingredient, i) => (
                                                <option key={i} value={ingredient.description} onClick={() => { handleIngredientChange(ingredient.name, index) }}>{ingredient.description}</option>
                                            ))}
                                        </select>
                                    </div>
                                : ''}
                            </div>
                        ))}

                        <button type="submit" className='add-action-btn' style={{ marginLeft: 0, marginTop: '7%', height: '3.5rem', border: '1px solid' }}>
                            Add
                        </button>
                    </form>
                </div>
            ) :
                <div className="services-actions-holder">
                    {selectedArea && (selectedArea?.trigger?.name?.length > 0 ? (
                        services.actions.map((item, index) => (
                            <ServiceAction setMode={setMode} key={index} selectedArea={selectedArea} color={services.color} actionInfos={item} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                        ))
                    ) : (
                        services.triggers.map((item, index) => (
                            <ServiceAction setMode={setMode} key={index} selectedArea={selectedArea} color={services.color} actionInfos={item} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                        ))
                    ))}
                </div>
            }
        </div>
    );
}

export default ServiceActions