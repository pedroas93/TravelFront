import React, {Component} from "react";
import {Link} from "react-router-dom";
import HeaderLogo from "./HeaderLogo";
import Footer from "./Footer";
import Logger from "../../models/Logger";
import settings from "../../settings";
import FetchResponses from "../../models/FetchResponses";
import Error from "./Error";
import ConfirmarContrasena from "./ConfirmarContrasena";
import ReCaptcha from "./ReCaptcha";
import {Messages, translateDetails} from "../../models/Messages";

class RecuperarClave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: props.match.params.uid,
      token: props.match.params.token,
      new_password1: "",
      new_password2: "",
      fiscal_number: "",
      error_message: "",
      messageDataChanguePassword: "Digita el código que te enviamos a tu email/celular",
      open: false,
      openConfirmarContrasena: false,
      recaptchaRef: React.createRef(),
      userExists: false,
      captcha_value: "",
      captcha_checked: false,
      is_valid_user: false
    };
    Logger.setLogger(this.constructor.name);
  }

  handleClose = () => {
    this.setState({open: false});
  };

  handleChange = event => {
    this.setState({[event.target.id]: event.target.value});
  };

  reCaptchaOnChange = value => {
    if (value) {
      this.setState({
        captcha_value: value,
        captcha_checked: true,
        is_valid_user: true
      });
    }
  };

  successConsultClient = response => {
    this.setState({
      is_valid_user: true
    });
  };

  validateFiscalNumber = () => {
    return (
      this.state.fiscal_number.length >= 4 &&
      this.state.fiscal_number.length <= 13
    );
  };

  showCaptcha = () => {
    return this.validateFiscalNumber() && !this.state.captcha_checked;
  };

  passwordClose = () => {
    this.setState({
      openConfirmarContrasena: false,
      is_valid_user: false,
      captcha_checked: false,
      captcha_value: "",
      recaptchaRef: React.createRef(),
    });
    window.grecaptcha.reset();
  };

  handleSubmit = event => {
    event.preventDefault();
    const data = {
      fiscal_number: this.state.fiscal_number,
      recaptcha_token: this.state.captcha_value
    };
    fetch(settings.backend.password_reset, {
      method: "POST",
      body: JSON.stringify(data),
      headers: settings.headers_super_auth
    })
      .then(FetchResponses.processResponse)
      .then(response => {
        console.log(response)
        this.setState({
          openConfirmarContrasena: true,
        });
      })
      .catch(response => {
        let error_message = translateDetails(response.detail);
        this.state.recaptchaRef.current.reset();
        this.setState({
          open: true,
          captcha_value: "",
          fiscal_number: "",
          captcha_checked: true,
          is_valid_user: false,
          openConfirmarContrasena: false,
          error_message,
        });
      });
  };

  render() {
    return (
      <div className="gradient-bk">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col col-lg-5">
              <HeaderLogo/>
              <form onSubmit={this.handleSubmit}>
                <div className="whitePanel login">
                  <h1>Recuperar Clave</h1>

                  <div className="form-group">
                    <span className="icon dripicons-user-id"/>
                    <input
                      type="text"
                      className="form-control"
                      id="fiscal_number"
                      placeholder="Ingresa tu Cédula"
                      value={this.state.fiscal_number}
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <ReCaptcha recaptchaRef={this.state.recaptchaRef} reCaptchaOnChange={this.reCaptchaOnChange}
                             hidden={!this.showCaptcha()}/>
                  <div className="form-group">
                    <Link to="/">Volver a Ingreso</Link>
                  </div>
                  <Error
                    open={this.state.open}
                    error_message={this.state.error_message}
                    handleClose={this.handleClose}
                  />
                  <ConfirmarContrasena
                    title={this.state.messageDataChanguePassword}
                    openConfirmarContrasena={this.state.openConfirmarContrasena}
                    passwordClose={this.passwordClose}
                    handleSubmit={this.handleSubmit}
                    fiscal_number={this.state.fiscal_number}
                  />
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={!this.state.is_valid_user}
                    >
                      Recuperar Clave
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default RecuperarClave;
