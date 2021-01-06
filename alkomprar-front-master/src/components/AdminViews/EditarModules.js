import React, {Component} from 'react';
import MenuList from './MenuList';
import Footer from '../PublicViews/Footer';
import Logger from "../../models/Logger";
import Auth from "../../models/Auth";
import settings from "../../settings";
import HeaderPrivate from '../PrivateViews/HeaderPrivate';
import FetchResponses from "../../models/FetchResponses";
// import {Messages} from "../../models/Messages";
// import Error from "../PublicViews/Error";
import { Upload, Icon, Modal, Collapse} from "antd";
// redux
import{connect} from 'react-redux';


class EditarModules extends Component {

    constructor(props) {
        super(props);
    
        // let last_user = JSON.parse(Auth.getLastUserData());
        this.state = {

        };
        Logger.setLogger(this.constructor.name);
    }


    componentDidMount() {

    }

    element = () => {
        return (
            <div className="container-fluid">


            <div className="sidebar">
                <MenuList disabled={this.state.pending_information}/>
            </div>

            <div className="row">
                <div className="col private-wrapper">
                    <HeaderPrivate menu_list={this.state.pending_information}/>
                </div>
            </div>


            <form onSubmit={this.changeDataConfirmation}>
                <div className="row justify-content-center">
                  <div className="col-lg-10">
                    <div className="panel">
                      <div className="textRequiredValues">
                      <p>{this.state.requiredValues}</p>
                      </div>
                      <div>
                        <p>Los datos marcados con (*), son obligatorios</p>
                      </div>
                      <div className="row justify-content-center">
                        <div className="col-md-5">
                          <div className="form-group">
                            <label htmlFor="email">(*) E-mail</label>
                            <input className="form-control" id="email" type="email" placeholder="E-mail"
                                   value={this.state.email} required
                                   onChange={this.handleChange}/>
                          </div>
                        </div>
                        <div className="col-md-5 offset-md-1">
                          <div className="form-group">
                            <label htmlFor="phone">(*)Celular</label>
                            <InputMask className="form-control" id="phone" type="text" placeholder="Celular"
                                   value={this.state.phone.replace(/\D|\-/,'')} required
                                   onChange={this.handleChange}/>
                          </div>
                        </div>
                      </div>
                      <div className="row justify-content-center">
                        <div className="col-md-5">
                          <div className="form-group">
                            <label htmlFor="home_phone">Teléfono</label>
                            <InputMask className="form-control" id="home_phone" 
                                   type="text" placeholder="Teléfono"
                                   value={this.state.home_phone.replace(/\D|\-/,'')}
                                   onChange={this.handleChange}
                                   />
                          </div>
                        </div>
                        <div className="col-md-5 offset-md-1">
                          <div className="form-group">
                            <label htmlFor="state">(*) Departamento</label>
                            <select className="form-control" id="address.state" placeholder="Departamento"
                                    value={this.state.address.state}
                                    required onChange={this.handleChange}>
                              {this.state.states.map(state => {
                                return <option value={state} key={state}>{state}</option>;
                              })}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row justify-content-center">
                        <div className="col-md-5">
                          <div className="form-group">
                            <label htmlFor="city">(*) Ciudad</label>
                            <select className="form-control" id="address.city" placeholder="Ciudad"
                                    value={this.state.address.city}
                                    required onChange={this.handleChange}>
                              {this.state.cities.map(city => {
                                return <option value={city.city_code}
                                               key={city.city_code}>{city.city_name.toUpperCase()}</option>;
                              })}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-5 offset-md-1">
                          <div className="form-group">
                            <label htmlFor="street">(*) Dirección</label>
                            <input className="form-control" id="address.street" type="text" placeholder="Dirección"
                                   value={this.state.address.street}
                                   required onChange={this.handleChange}/>
                          </div>
                        </div>
                      </div>

                      <div className="row justify-content-center">
                        <div className="col-md-5">
                          <div className="form-group">
                            <input type="checkbox" className="form-check-input" id="AceptoPolitica" required/>
                            <label className="form-check-label" htmlFor="AceptoPolitica">He leído y acepto la
                              <a href="#" onClick={this.handleClickOpen}> política de privacidad de datos</a>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="row justify-content-center">
                        <div className="col-md-12 offset-md-1">
                          <button type="submit" className="btn btn-primary">Guardar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </form>

              <Footer/>
            </div>
        );
    };
    render() {
      return Auth.authenticationRequired(this.element());
    }
  }
  
  const mapStateToProps = state =>({
    props : state
  })
  
  export default connect(mapStateToProps,{}) (Manager);
  