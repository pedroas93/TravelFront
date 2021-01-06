import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import HeaderLogo from './HeaderLogo';
import Footer from './Footer';
import Logger from "../../models/Logger";
import Auth from "../../models/Auth";
import settings from "../../settings";
import FetchResponses from "../../models/FetchResponses";
import TerminosCondiciones from "./TerminosCondiciones";
import CodigoRegistro from "./CodigoRegistro";
import Error from './Error';
import {BackMessages, Messages, translateDetails} from '../../models/Messages';
import ReCaptcha from "./ReCaptcha";

class Registro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fiscal_number: "",
      first_name: "",
      last_name: "",
      email: "",
      showEmail: "",
      phone: "",
      captcha_value: "",
      captcha_checked: false,
      recaptchaRef: React.createRef(),
      is_valid_user: false,
      is_valid_fiscal_number: false,
      show_terminos: false,
      openCodigoRegistro: false,
      error_message: "",
      open: false,
      TC_messaje: "",
      open_TC: false,
      datosOriginales: false,
      loading: true,
    };
    Logger.setLogger(this.constructor.name);
  }

  handleChange = event => {
    if (event.target.id !== "showEmail") {
      this.setState({
        [event.target.id]: event.target.value
      });
    } else {
      if (event.target.value.indexOf("*")) {
        this.setState({
          [event.target.id]: event.target.value
        })
      }
      if (event.target.value.indexOf("*") !== 3) {
        this.setState({
          email: event.target.value
        });
      } else {
        this.setState({
          [event.target.id]: event.target.value
        })
      }
    }
  };

  validateFiscalNumber = () => {
    return this.state.fiscal_number.length >= 4 && this.state.fiscal_number.length <= 13;
  };

  showCaptcha = () => {
    return this.validateFiscalNumber() && !this.state.captcha_checked;
  };

  reCaptchaOnChange = value => {
    if (value) {
      this.setState({
        captcha_value: value,
        captcha_checked: true,
      });
      this.consultClient();
    }
  };

  successConsultClient = response => {
    Logger.trace("Consult Client success: " + JSON.stringify(response));
    let {fiscal_number, first_name, last_name, email, phone} = response;
    let showEmail = "";

    if (fiscal_number) {
      if (email && email !== 'sincorreo@sincorreo.com') {
        let arraySubChar = response.email.split("@");
        let newArrayChar = arraySubChar[0];
        let finalChar = "";
        for (let i = 0; i < arraySubChar[0].length; i++) {
          if (i >= 3) {
            finalChar = finalChar + "*"
          } else {
            finalChar = finalChar + newArrayChar[i];
          }
        }
        showEmail = finalChar + "@" + arraySubChar[1];
      } else {
        email = "";
      }
      this.setState({
        fiscal_number,
        first_name,
        last_name,
        email,
        phone,
        showEmail,
        is_valid_user: true,
      });
      Auth.setLastUserData(response);
    } else {
      this.failureConsultClient(response);
    }
  };

  failureConsultClient = (response) => {
    Logger.trace("Reset captcha");
    this.state.recaptchaRef.current.reset();
    let error_message = response.detail === BackMessages.userAlreadyExists ? Messages.userAlreadyExists : Messages.userDoesNotExists;
    this.setState({
      captcha_value: "",
      captcha_checked: false,
      open: true,
      error_message
    });
  };

  consultClient = () => {
    Logger.trace("Consult client with fiscal number: " + this.state.fiscal_number);
    const data = {
      fiscal_number: this.state.fiscal_number,
      recaptcha_token: this.state.captcha_value,
      "all_data": false,
    };
    fetch(settings.backend.consult_user, {
      method: "POST",
      body: JSON.stringify(data),
      headers: settings.headers_super_auth
    })
      .then(FetchResponses.processResponse)
      .then(this.successConsultClient)
      .catch(this.failureConsultClient)
  };

  successPreRegisterClient = response => {
    this.setState({loading: false});
    if (!response.mail_sent && !response.sms_sent) {
      let open = true;
      let error_message = translateDetails(response.detail);
      this.setState({open, error_message});
      return
    }
    Logger.trace("PreRegister success: " + JSON.stringify(response));
    this.setState({openCodigoRegistro: true})
  };

  failurePreRegisterClient = (response) => {
    this.setState({loading: false});
    let open = true;
    let error_message = translateDetails(response.detail);
    this.setState({open, error_message});
  };

  preRegisterUser = event => {
    event.preventDefault();
    let {fiscal_number, first_name, last_name, email, phone} = this.state;
    const data = {
      fiscal_number,
      first_name,
      last_name,
      email,
      phone,
    };
    this.setState({loading: true});
    fetch(settings.backend.pre_register, {
      method: "POST",
      body: JSON.stringify(data),
      headers: settings.headers_super_auth
    })
      .then(FetchResponses.processResponse)
      .then(this.successPreRegisterClient)
      .catch(this.failurePreRegisterClient)
  };

  handleClickOpen = () => {
    this.setState({
      open_TC: true,
    });
  };

  registerClose = () => {
    this.setState({openCodigoRegistro: false});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleClose_TC = () => {
    this.setState({open_TC: false});
  };

  element = () => {
    return (
      <div className="gradient-bk">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col col-lg-9 col-xl-8">
              <HeaderLogo/>
              <div className="whitePanel register">

                <div className="row">
                  <div className="col-md-6">
                    <div style={{minHeight: 330}}>
                      <form onSubmit={this.preRegisterUser}>

                        <h1>Regístrate con nosotros</h1>

                        <div className="form-group">
                          <span className="icon dripicons-user-id"/>
                          <input type="text"
                                 className="form-control "
                                 id="fiscal_number"
                                 placeholder="Ingresa tu Cédula"
                                 required minLength={4}
                                 maxLength={13} autoFocus autoComplete="off" readOnly={this.state.is_valid_user}
                                 value={this.state.fiscal_number}
                                 onChange={this.handleChange}/>
                        </div>

                        <ReCaptcha 
                        recaptchaRef={this.state.recaptchaRef} 
                        reCaptchaOnChange={this.reCaptchaOnChange}
                        hidden={!this.showCaptcha()}/>

                        <div className="form-group">
                          <span className="icon dripicons-user" hidden={!this.state.is_valid_user}/>
                          <input
                            type="text"
                            className="form-control "
                            id="full_name"
                            placeholder="Nombre Completo"
                            required
                            readOnly
                            value={this.state.first_name + " " + this.state.last_name}
                            hidden={!this.state.is_valid_user}/>
                        </div>

                        <div className="form-group">
                          <span className="icon dripicons-mail" hidden={!this.state.is_valid_user}/>
                          <input type="email" className="form-control" id="showEmail" placeholder="Ingresa tu correo aquí"
                                 required
                                 value={this.state.showEmail} onChange={this.handleChange}
                                 hidden={!this.state.is_valid_user}/>
                        </div>

                        <div className="form-group">
                          <span className="icon dripicons-phone" hidden={!this.state.is_valid_user}/>
                          <input type="phone" pattern="[0-9]*" className="form-control" id="phone"
                                 placeholder="Ingresa tu celular"
                                 required
                                 value={this.state.phone} onChange={this.handleChange}
                                 hidden={!this.state.is_valid_user}/>
                        </div>

                        <div className="form-group form-check" hidden={!this.state.is_valid_user}>
                          <input type="checkbox" className="form-check-input" id="AceptoPolitica" required/>
                          <label className="form-check-label" htmlFor="AceptoPolitica">He leído y acepto la
                            <a href="#" onClick={this.handleClickOpen}> política de privacidad de datos</a>
                          </label>
                        </div>

                        <div className="text-center">
                          <button type="submit" className="btn btn-primary btn-lg"
                                  disabled={!this.state.is_valid_user}>Regístrate
                          </button>
                        </div>
                      </form>

                      <TerminosCondiciones
                        open_TC={this.state.open_TC}
                        TC_messaje={this.state.TC_messaje}
                        handleClose_TC={this.handleClose_TC}
                      />

                      <CodigoRegistro
                        openCodigoRegistro={this.state.openCodigoRegistro}
                        registerClose={this.registerClose}
                        preRegisterUser={this.preRegisterUser}
                        loading={this.state.loading}
                        fiscal_number={this.state.fiscal_number}
                      />

                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="text-right">
                      <Link to="/">
                        Volver a Inicio
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
        <Error
          open={this.state.open}
          error_message={this.state.error_message}
          handleClose={this.handleClose}
        />
      </div>
    );
  };

  render() {
    return Auth.notAuthenticationRequired(this.element());
  }
}

export default Registro;
