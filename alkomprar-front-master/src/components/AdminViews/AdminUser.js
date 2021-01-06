import React from "react";
import "antd/dist/antd.css";
import InputMask from 'react-input-mask';
import settings from "../../settings";
import Auth from "../../models/Auth";
import Logger from "../../models/Logger";
import FetchResponses from "../../models/FetchResponses";
import MenuList from './MenuList';
import Footer from '../PublicViews/Footer';
import {Messages, translateDetails} from "../../models/Messages";
import HeaderPrivate from '../PrivateViews/HeaderPrivate';
import Error from "../PublicViews/Error";
import BarLoader from 'react-spinners/BarLoader';
// redux
import {connect} from 'react-redux';
import {SetMenuManager} from '../PrivateViews/Menu_Actions';

class AdminUser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      cedula: "",
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
      pending_information: true,
      states: [],
      cities: [],
      requiredValues: "",
      error_message_pop: "",
      loading: false,
      transactions: [],
      status: "",
      has_transactions: false,
      is_valid_user: false,
    };
  }

  componentDidMount() {
    this.props.SetMenuManager(["", "", "submit", "", "", ""]);
    localStorage.setItem("menu", JSON.stringify(["", "", "submit", "", "", ""]));
  }

  handleChangeIC = (cedula) => {
    if (cedula.target.value.length >= 5) {
      this.setState({cedula: cedula.target.value, is_valid_user: true});
    } else {
        this.setState({cedula: cedula.target.value, is_valid_user: false});
    }
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

  searchUser = (event) => {
    event.preventDefault();
    this.setState({loading: true});
    fetch(settings.backend.states, {
      method: "GET",
      headers: settings.headers_auth(Auth.getSessionToken())
    })
      .then(FetchResponses.processResponse)
      .then(this.successStatesResponse)
      .catch(this.setState({loading: true}),
        FetchResponses.errorResponse);

    fetch(settings.backend.list_user + "?fiscal_number=" + this.state.cedula, {
      method: "GET",
      headers: settings.headers_auth(Auth.getSessionToken()),
    })
      .then(FetchResponses.processResponse)
      .then(response => {
        this.setState({
          loading: false,
          transactions: [],
          status: response.status
        });
        Logger.info(response);
        if (response !== "User does not exists.") {
          let transactions = response;

          let address;
          if (response.address) {
            address = {
              street: response.address.street,
              city: response.address.city,
              state: response.address.state,
            }
          } else {

            address = {
              street: "",
              city: "",
              state: "",
            }
          }

          if (address.state !== "") {
            this.consulCities(address.state);
          }

          if (response.home_phone === null) {
            response.home_phone = "";
          }
          if (response.address !== null) {
            this.setState({
              first_name: response.first_name,
              fiscal_number: response.fiscal_number,
              last_name: response.last_name,
              address: address,
              home_phone: response.home_phone,
              phone: response.phone,
              email: response.email,
              full_name: `${response.first_name} ${response.last_name}`.toUpperCase(),
              transactions
            });
          } else {
            this.setState({
              address: address,
              first_name: response.first_name,
              fiscal_number: response.fiscal_number,
              last_name: response.last_name,
              home_phone: response.home_phone,
              phone: response.phone,
              email: response.email,
              full_name: `${response.first_name} ${response.last_name}`.toUpperCase(),
              transactions
            });
          }

        }

      })
      .catch(error => {
        this.setState({loading: false});
        Logger.error(error);
        if (error.fiscal_number) {
          this.setState({
            open: true,
            error_message: Messages.minNumberOfFiscalNumber,
            loading: false,
          });
        } else if (error.detail === "User does not exists.") {
          this.setState({
            open: true,
            error_message: Messages.userDoesNotRegister,
            loading: false,
          });
        } else {
          this.setState({
            open: true,
            error_message: Messages.errorTryLater,
            loading: false,
          });
        }
      })
  };

  successStatesResponse = response => {
    this.setState({loading: false});
    let states = response.states.map(state => {
      return state.state
    });
    this.setState({states});
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

  userEnable = event => {
    event.preventDefault();
    if (this.state.cedula !== "") {
      const data = {
        fiscal_number: this.state.cedula.trim().replace(/\_| /g, ''),
        active: true,
      };

      fetch(settings.backend.enable, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: settings.headers_auth(Auth.getSessionToken())
      }).then(FetchResponses.processResponse)
        .then(data => {
          if (data.detail) {
            this.setState({
              open: true,
              error_message: translateDetails(data.detail),
              loading: false,
            });
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
        })
        .catch(data => {
          if (data.detail) {
            this.setState({
              open: true,
              error_message: translateDetails(data.detail),
              loading: false,
            });
          }
        })
    } else {
      this.handleCloseError("Ingresa la cedula para continuar")
    }
  };

  userDisable = event => {
    event.preventDefault();
    if (this.state.cedula !== "") {
      //   this.props.certificateSelect( "Certificado Deuda", this.state.textCertificate);

      const data = {
        fiscal_number: this.state.cedula.trim().replace(/\_| /g, ''),
        active: false,
      };
      fetch(settings.backend.enable, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: settings.headers_auth(Auth.getSessionToken())
      }).then(FetchResponses.processResponse)
        .then(data => {
          if (data.detail) {
            // let translate = translateDetails(data.detail);
            this.setState({
              open: true,
              error_message: translateDetails(data.detail),
              loading: false,
            });
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
        })
        .catch(data => {
          if (data.detail) {
            let translate = translateDetails(data.detail);
            this.handleCloseError(translate)
          } else {
            this.handleCloseError("Se ha producido un error, intentalo nuevamente")
          }
        })
    } else {
      this.handleCloseError("Ingresa la cedula para continuar")
    }
  };

  validate_data = () => {
    return this.state.email !== "" && this.state.phone !== "" && this.state.state !== "" && this.state.city !== "" && this.state.street !== "" && this.state.additional_address_info !== "";
  };

  handleCloseError = (error_message_pop = "") => {
    this.setState({error_message_pop: error_message_pop});
  };

  changeDataConfirmation = (event) => {
    event.preventDefault();
    if (this.state.address.state.indexOf("ESCOGE") === 0 || this.state.address.city.indexOf("ESCOGE") === 0) {
      this.setState({
        open: true,
        error_message: Messages.requiredValues
      });
    } else {
      if (this.validate_data()) {
        let {email, phone, home_phone, address, first_name, last_name, fiscal_number} = this.state;
        const data = {
          email,
          phone,
          home_phone,
          address,
          first_name,
          last_name,
          fiscal_number
        };

        fetch(settings.backend.list_user + "?fiscal_number=" + this.state.cedula, {
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

  handleClose = () => {
    if (this.state.error_message === Messages.successUpdate) {
      window.location.replace("/adminuser")
    }
    this.setState({open: false});
  };
  successChangeDataConfirmation = response => {
    let open = true;
    let error_message = response.fiscal_number ? Messages.successUpdate : translateDetails(response.detail);
    let pending_information = response.pending_information;
    this.setState({
      open,
      error_message,
      pending_information,
    });
  };

  finalContent = () => {
    if (this.state.loading) {
      return (
        <div className="alert alert-warning">
          <div className="row justify-content-center">
            <BarLoader
              sizeUnit='%'
              height={5}
              width={500}
              color='#ff0000'
              loading={this.state.loading}
            /></div>
        </div>
      );
    } else if (this.state.transactions.first_name) {

      return (<div>
          <form onSubmit={this.changeDataConfirmation}>
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
                             value={this.state.home_phone.replace(/\D|\-/, '')}
                             type="text" placeholder="Teléfono"
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
                <label htmlFor="street">(*) Dirección</label>
                <input className="form-control" id="address.street" type="text" placeholder="Dirección"
                       value={this.state.address.street}
                       required onChange={this.handleChange}/>
              </div>
            </div>

            <div className="row justify-content-center">

              <div className="col-12 col-sm-6 col-md-5 col-lg-4">
                <button type="submit" className="btn btn-primary btn-block">Guardar</button>
              </div>

              <div className="col-12 col-sm-6 offset-md-1 col-md-5 offset-lg-3 col-lg-4">
                {this.state.status === "ACTIVE" ?
                  <button className="btn btn-primary btn-block" id="boton deshabilitar usuario"
                          onClick={this.userDisable}>Bloquear</button> :
                  <button className="btn btn-primary btn-block" id="boton habilitar usuario"
                          onClick={this.userEnable}>Des-Bloquear</button>}
              </div>

            </div>

          </form>
        </div>

      )
    } else if (this.state.transactions.length === 0) {
      return (
        <div className="alert alert-warning">
          <div className="row justify-content-center">
            <h3>Sin resultados.</h3>
          </div>
        </div>
      );
    } else {
      return (
        <div className="alert alert-warning">
          <div className="row justify-content-center">
            <h3>Digite la cedula del usuario.</h3>
          </div>
        </div>
      );
    }
  };

  element = () => {
    return (
      <>
        <div className="container-fluid">
          <div className="sidebar">
            <MenuList disabled={this.state.loading}/>
          </div>

          <div className="row">
            <div className="col private-wrapper">
              <HeaderPrivate menu_list={this.state.loading}/>

              <div className="wrapper">
                <div className="row justify-content-center">
                  <div className="col-lg-10 col-xl-8">
                    <h1><span className="icon dripicons-user-group"/>Editar usuarios</h1>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-lg-10 col-xl-8">
                    <div className="panel">


                      <div className="col-lg-12">
                        <div className="row align-items-center">
                          <div className="col-12 col-md-6">
                            <InputMask className="form-control" id="ceudla" type="text" placeholder="Cedula"
                                       value={this.state.cedula.replace(/\D|\-/, '')} required minLength={5}
                                       maxLength={13}
                                       onChange={this.handleChangeIC}/>
                          </div>
                          <div className="col-12 col-md-6">
                            <button onClick={this.searchUser} className="btn btn-primary btn-block"
                                    disabled={!this.state.is_valid_user}>
                              Buscar usuario
                            </button>
                          </div>
                        </div>

                      </div>
                      <br/>
                      <br/>
                      {this.finalContent()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer/>
        </div>

        <Error
          open={this.state.open}
          error_message={this.state.error_message}
          handleClose={this.handleClose}
        />
      </>
    );
  };

  render() {
    return Auth.authenticationRequired(this.element());
  }
}

const mapStateToProps = state => ({
  menu: state.menu.menu
});

export default connect(mapStateToProps, {SetMenuManager})(AdminUser);