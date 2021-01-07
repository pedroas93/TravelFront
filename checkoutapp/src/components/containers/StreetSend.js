import React, { useState } from 'react';
import Api from '../../services/api'

export default function StreetSend(props) {
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [colony, setColony] = useState();
    const [postalcode, setPostalcode] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [muni, setMuni] = useState('');
    const [street, setStreet] = useState('');
    const [typeColony, setTypeColony] = useState('input')

    const handleForm = (item) => {
        if (/^(([^<>()[\],;:\s@"]+([^<>()[\],;:\s@"]+)*)|(".+"))@(([^<>()[\],;:\s@"]+)+[^<>()[\],;:\s@"]{2,})$/i.test(email)) {
            const data = {
                name: name,
                lastName: lastname,
                email: email,
                number: number,
                colony: colony,
                postalCode: postalcode,
                state: state,
                city: city,
                muni: muni,
                street: street
            }
            Api._postContact(data).then(response => {
            })
        } else {
            alert("La dirección de email es incorrecta!.");
        }
    };

    const handleChange = (item) => {
        setPostalcode(item)
        if (item.length > 3) {
            Api._getPostalCodes(item).then(data => {
                setCity(data.city);
                setState(data.state);
                setMuni(data.town)
                setColony(data.colonies);
                if (data.colonies && data.colonies.length > 1) {
                    setTypeColony('selectBox')
                } else {
                    setTypeColony('input')
                }
            })
        }
    };

    return (
        <section>
            <div className='addressSend'>
                <h1 className='tittleInitial'>
                    DIRECCIÓN DE ENVÍO
                </h1>
                <div className='lineTittle'></div>
                <div className='containerButtons'>
                    <div className="input-container">
                        <i className="fa fa-user icon"></i>
                        <input className="input-field" type="text" placeholder="Nombre" name="name" onChange={event => setName(event.target.value)} />
                    </div>
                    <div className="input-container">
                        <i className="fa fa-user icon"></i>
                        <input className="input-field" type="text" placeholder="Apellidos" name="lastname" onChange={event => setLastname(event.target.value)} />
                    </div>
                    <div className="input-container">
                        <i className="fa fa-envelope icon"></i>
                        <input className="input-field" type="text" placeholder="Correo Electroónico" name="email" value={email} onChange={event => setEmail(event.target.value)} />
                    </div>
                    <div className="input-container">
                        <i className="fa fa-phone icon"></i>
                        <input className="input-field" type="text" placeholder="Número de teléfono" name="number" value={number} onChange={event => setNumber(event.target.value)} />
                    </div>
                    {typeColony === 'input' &&
                        <div className="input-container">
                            <i className="fa  fa-map-marker icon"></i>
                            <input className="input-field" type="text" placeholder="Colonia" name="colony" value={colony} onChange={event => setColony(event.target.value)} />
                        </div>
                    }
                    {typeColony === 'selectBox' &&
                        <div className="input-container">
                            <i className="fa fa-map-marker icon"></i>
                            {/* <input className="input-field" type="selectBox" placeholder="Colonia" name="colony" value={colony} onChange={event => setColony(event.target.value)} /> */}
                            <select>
                                {colony && colony.map(state => {
                                    return <option value={state} key={state}>{state}</option>;
                                })}
                            </select>
                        </div>
                    }
                    <div className="input-container">
                        <i className="fa fa-map-marker icon"></i>
                        <input className="input-field" type="text" placeholder="Código postal" name="postalcode" onChange={event => handleChange(event.target.value)} />
                    </div>
                    <div className="input-container">
                        <i className="fa fa-map-marker icon"></i>
                        <input className="input-field" type="text" placeholder="Estado/Región" name="state" value={state} onChange={event => setState(event.target.value)} />
                    </div>
                    <div className="input-container">
                        <i className="fa fa-map-marker icon"></i>
                        <input className="input-field" type="text" placeholder="Ciudad" name="city" value={city} onChange={event => setCity(event.target.value)} />
                    </div>
                    <div className="input-container">
                        <i className="fa fa-map-marker icon"></i>
                        <input className="input-field" type="text" placeholder="Delegación o municipio" name="muni" value={muni} onChange={event => setMuni(event.target.value)} />
                    </div>
                    <div className="input-container">
                        <i className="fa fa-map-marker icon"></i>
                        <input className="input-field" type="text" placeholder="Calle" name="street" value={street} onChange={event => setStreet(event.target.value)} />
                    </div>

                    <button className="btn">Libreta de direcciones</button>
                    <button onClick={handleForm} className="btn">Guardar</button>
                </div>
                <div className="bottomCheck">
                    <label className="container">
                        <input type="checkbox" checked="checked" />
                        <span className="checkmark"></span>
                        Utilizar como dirección de facturación
                    </label>
                </div>
            </div>
        </section>
    );
}