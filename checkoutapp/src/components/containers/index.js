import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';

// import '../../../App.scss';
import Api from '../../services/api'

export default function Index(props) {

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
    const [subtotal, setSubtotal] = useState(0);
    const [typeColony, setTypeColony] = useState('input')
    const [product, setProduct] = useState([]);

    const handleForm = (item) => {
        if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
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
            Api._postContact().then(response => {
                alert("Los datos fueron guardados correctamente es correcta!.");
            })
        } else {
            alert("La dirección de email es incorrecta!.");
        }
    };

    const handleChange = (item) => {
        if (item.length > 3) {
            Api._getPostalCodes(item).then(data => {
                setCity(data.city);
                setState(data.state);
                setMuni(data.town)
                setColony(data.colonies);
                console.log('WHAT IS THISSSS-----> ', data.colonies)
                if (data.colonies && data.colonies.length > 1) {
                    setTypeColony('selectBox')
                } else {
                    setTypeColony('input')
                }
            })
        }
    };

    useEffect(() => {
        Api._getProducts().then(data => {
            let newSubtotal = Number(subtotal)
            data.forEach(element => {
                newSubtotal += Number(element.price);
            });
            setSubtotal(newSubtotal);
            setProduct(data)
        })
    }, []);

    return (
        <section className='check-section '>
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
                <label class="container">
                    <input type="checkbox" checked="checked" />
                    <span class="checkmark"></span>
                    Utilizar como dirección de facturación
                </label>
            </div>

            <div>
                <div className='ContainerlTittleResume'>
                    <h1 className='tittleInitial'>
                        RESUMEN DE LA ORDEN
                    </h1>
                </div>
                {product && product.map(productItem => {
                    return (
                        <div className="productList">
                            <img width="100" height="100" src={productItem.image} />
                            <p>
                                {productItem.name}
                            </p>
                            <p>
                                ${productItem.price}
                            </p>
                        </div>
                    )
                })}
                <div className="wrapper-btn">
                    <button className='btn-secundary'> Editar </button>
                </div>
                <div className='ContainerlTittleSubtotal'>
                    <h1 className='tittleInitial'>
                        SUBTOTAL
                    </h1>
                    <p className="subTotalPrice">
                        ${subtotal}
                    </p>
                </div>
                <div className='ContainerlTittleSubtotal'>
                    <h1 className='sendTotal'>
                        ENVÍO
                    </h1>
                    <h1 className='sendTotalPrice'>
                        A calcular
                    </h1>
                </div>
                <button type="submit" className="btn">TOTAL $13,974.00</button>

            </div>


        </section>
    );
}