import React, {Component} from 'react';
import HeaderPrivate from './HeaderPrivate';
import MenuList from './MenuList';
import Footer from '../PublicViews/Footer';
import Auth from "../../models/Auth";
import CambiarContrasena from './CambiarContrasena'
import settings from "../../settings";
import FetchResponses from "../../models/FetchResponses";
import Error from '../PublicViews/Error';
import Logger from "../../models/Logger";
import {BackMessages, Messages, translateDetails} from "../../models/Messages";
import TerminosCondiciones from "../PublicViews/TerminosCondiciones";
import InputMask from 'react-input-mask';
import {Affix, Alert} from 'antd';
// redux
import {connect} from 'react-redux';
import {SetPerfil} from './Perfil_Actions';
import {SetMenuCss} from './Menu_Actions';

class Perfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      full_name: "",
      fiscal_number: "",
      email: "",
      phone: "",
      home_phone: "",
      address: {
        state: "",
        city: "",
        street: "",
      },
      error_message: "",
      openChangePassword: false,
      pending_information: false,
      open: false,
      states: [],
      cities: [],
      open_TC: false,
      requiredValues: Messages.requiredValues,
    };
    Logger.setLogger(this.constructor.name);
  }

  componentDidMount() {
    //Cambia el estado del menu
    this.props.SetMenuCss(["", "submit", "", "", "", ""]);
    localStorage.setItem("menu", JSON.stringify(["", "submit", "", "", "", ""]));
    // Consult States List
    fetch(settings.backend.states, {
      method: "GET",
      headers: settings.headers_auth(Auth.getSessionToken())
    })
      .then(FetchResponses.processResponse)
      .then(this.successStatesResponse)
      .catch(FetchResponses.errorResponse);

    // Consult User Information
    fetch(settings.backend.dataResponse, {
      method: "GET",
      headers: settings.headers_auth(Auth.getSessionToken())
    })
      .then(FetchResponses.processResponse)
      .then(this.successDataResponse)
      .catch(this.failureDataResponse);
  }

  successStatesResponse = response => {
    let states = response.states.map(state => {
      return state.state
    });
    this.setState({states});
  };

  successDataResponse = response => {
    let full_name = `${response.first_name} ${response.last_name}`.toUpperCase();
    let {fiscal_number, email, phone, home_phone, address, pending_information} = response;
    home_phone = home_phone ? home_phone : "";
    this.setState({
      full_name,
      fiscal_number,
      email,
      phone,
      home_phone,
      pending_information,
    });
    if (address !== null) {
      if (address.state) {
        this.consulCities(address.state);
      }
      this.setState({
        address,
      });
    }
    if (pending_information) {
      this.setState({
        open: true,
        requiredValues: Messages.requiredValues,
        error_message: Messages.requiredValues,
      })

    }
    Auth.setLastUserData(response);
    // this.props.SetPerfil(this.state);
  };

  validate_data = () => {
    return this.state.email !== "" && this.state.phone !== "" && this.state.state !== "" && this.state.city !== "" && this.state.street !== "" && this.state.additional_address_info !== "";
  };

  changeDataConfirmation = event => {
    event.preventDefault();
    if (this.state.address.state.indexOf("ESCOGE") === 0 || this.state.address.city.indexOf("ESCOGE") === 0) {
      this.setState({
        open: true,
        error_message: Messages.requiredValues
      });
    } else {
      if (this.validate_data()) {
        let {email, phone, home_phone, address} = this.state;
        const data = {
          email,
          phone,
          home_phone,
          address,
        };
        fetch(settings.backend.dataResponse, {
          method: "POST",
          body: JSON.stringify(data),
          headers: settings.headers_auth(Auth.getSessionToken())
        })
          .then(FetchResponses.processResponse)
          .then(this.successChangeDataConfirmation)
          .catch(this.failureChangeDataConfirmation)
      } else {
        this.setState({
          // open: true,
          requiredValues: Messages.requiredValues,
        });
      }
    }
  };

  successChangeDataConfirmation = response => {
    let open = true;
    let pending_information = response.pending_information;
    let error_message = response.fiscal_number ? Messages.successUpdate : translateDetails(response.detail);
    this.setState({
      open,
      error_message,
      pending_information,
    });
  };

  failureChangeDataConfirmation = response => {
    let open = true;
    let error_message = translateDetails(response.detail);
    this.setState({open, error_message});
  };

  consulCities = state => {
    fetch(settings.backend.cities(state), {
      method: "GET",
      headers: settings.headers_auth(Auth.getSessionToken())
    })
      .then(FetchResponses.processResponse)
      .then(this.successCitiesResponse)
      .catch(FetchResponses.errorResponse);
  };

  successCitiesResponse = response => {
    let cities = response.cities;
    this.setState({cities});
  };


  handleChange = event => {

    if (event.target.id === "address.state") {
      this.consulCities(event.target.value);
    }

    if (event.target.id.search("address") === 0) {
      let key_address = event.target.id.substring(8);
      let address = Object.assign(this.state.address, {[key_address]: event.target.value});
      if (key_address === "state") {
        address = {
          state: address.state,
          street: address.street,
        }
      }
      this.setState({
        address
      });
    } else {
      this.setState({
        [event.target.id]: event.target.value
      });
    }

  };

  failureDataResponse = () => {
    this.setState({
      open: true,
      error_message: Messages.errorTryLater,
    });
  };

  changePassword = event => {
    event.preventDefault();
    this.setState({openChangePassword: true});
  };

  handleClose = () => {
    if (this.state.error_message === Messages.successUpdate) {
      window.location.replace("/resumen")
    }
    this.setState({open: false});
  };

  passwordClose = () => {
    this.setState({openChangePassword: false});
  };

  handleClickOpen = () => {
    this.setState({
      open_TC: true,
    });
  };

  handleClose_TC = () => {
    this.setState({open_TC: false});
  };

  alertPendingInformation = () => {
    if (this.state.pending_information) {
      return (
        <Affix offsetTop={70}>
          <Alert type="error" message={this.state.requiredValues} showIcon/>
        </Affix>
      );
    }
  };

  element = () => {
    return (
      <div className="container-fluid">
        <div className="sidebar">
          <MenuList disabled={this.state.pending_information}/>
        </div>
        <div className="row">
          <div className="col private-wrapper">
            <HeaderPrivate menu_list={this.state.pending_information}/>

            <div className="wrapper">
              <div className="row justify-content-center">
                <div className="col-lg-10 col-xl-8">
                  <h1><span className="icon dripicons-user"/>Perfil</h1>
                </div>
              </div>

              {/* perfil */}
              <div className="row justify-content-center">
                <div className="col-lg-10 col-xl-8">
                  <div className="panel">
                    <div className="row justify-content-center">
                      <div className="col-md-5">
                        <div className="form-group">
                          <label htmlFor="name">Nombre Completo</label>
                          <h4>{this.state.full_name}</h4>
                        </div>
                      </div>
                      <div className="col-md-5 offset-md-1">
                        <div className="form-group">
                          <label htmlFor="cedula">Cédula</label>
                          <h4>{this.state.fiscal_number}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <form onSubmit={this.changeDataConfirmation}>
                <div className="row justify-content-center">
                  <div className="col-lg-10 col-xl-8">
                    <div className="panel">
                      {this.alertPendingInformation()}
                      <div className="row justify-content-center">
                        <div className="col-md-11">
                          <p>Los datos marcados con (*), son obligatorios</p>
                        </div>
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
                                       value={this.state.phone.replace(/\D|\-/, '')} required
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
                                       value={this.state.home_phone.replace(/\D|\-/, '')}
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
                              <option value='' key=''>ESCOGE UN DEPARTAMENTO</option>
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
                              <option value='' key=''>ESCOGE UNA CIUDAD</option>
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
                        <div className="col-10 col-md-6">
                          <div className="form-group">
                            <input type="checkbox" className="form-check-input" id="AceptoPolitica" required/>
                            <label className="form-check-label" htmlFor="AceptoPolitica">He leído y acepto la
                              <a href="#" onClick={this.handleClickOpen}> política de privacidad de datos</a>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="row justify-content-center">

                        {/*<div className="col-12">*/}

                        <div className="col-12 col-sm-6 col-md-5 col-lg-4">
                          <button type="submit" className="btn btn-primary btn-block">Guardar</button>
                        </div>

                        <div className="col-12 col-sm-6 offset-md-1 col-md-5 offset-lg-3 col-lg-4">
                          <button onClick={this.changePassword} className="btn btn-primary btn-block">Cambiar
                            Contraseña
                          </button>
                          <CambiarContrasena
                            openChangePasword={this.state.openChangePassword}
                            passwordClose={this.passwordClose}
                          />
                        </div>

                        {/*</div>*/}

                      </div>

                    </div>
                  </div>
                </div>

              </form>
            </div>
            <Footer/>
          </div>
        </div>
        <Error
          open={this.state.open}
          error_message={this.state.error_message}
          handleClose={this.handleClose}
        />
        <TerminosCondiciones
          open_TC={this.state.open_TC}
          TC_messaje={this.state.TC_messaje}
          handleClose_TC={this.handleClose_TC}
        />
      </div>
    );
  };

  render() {
    return Auth.authenticationRequired(this.element());
  }
}

const mapStateToProps = state => ({
  perfil: state.perfil.perfilInformation,
  menu: state.menu.menu
});


export default connect(mapStateToProps, {SetPerfil, SetMenuCss})(Perfil);
