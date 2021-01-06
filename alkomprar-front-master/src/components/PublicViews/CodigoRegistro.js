import React, {Component} from 'react';
import Logger from "../../models/Logger";
import settings from "../../settings";
import FetchResponses from "../../models/FetchResponses";
import {Redirect} from "react-router-dom";
import Error from './Error';
import {Messages, translateDetails} from "../../models/Messages";
import "antd/dist/antd.css";
import {Modal} from "antd";
import {isMobile} from 'react-device-detect';
import InputPassword from "./InputPassword";
import BarLoader from 'react-spinners/BarLoader';
import InputMask from "react-input-mask";


class CodigoRegistro extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      password_1: "",
      password_2: "",
      redirect_login: false,
      error_message: "",
      open: false,
      is_valid_code: false
    };
    Logger.setLogger(this.constructor.name);
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    }, () => {
      if (this.state.token !== "" && this.state.password_1 !== "" && this.state.password_2 !== "") {
        this.setState({
          is_valid_code: true
        });
      } else {
        this.setState({
          is_valid_code: false
        });
      }
    });
  };

  successRegister = response => {
    this.setState({
      open: true,
      error_message: Messages.userRegisterSuccessfully,
    });
  };

  failureRegister = error => {
    Logger.error(error);
    this.setState({
      open: true,
      error_message: translateDetails(error.detail),
      token: "",
      password_1: "",
      password_2: "",
      is_valid_code: false
    })
  };

  validate_data = () => {
    return this.state.token.length >= 6 && this.state.token.length <= 12;
  };

  validate_password = () => {
    return this.state.password_1 === this.state.password_2;
  };

  handleClose = () => {
    if (this.state.error_message === Messages.userRegisterSuccessfully) {
      window.location.replace("/login")
    }
    this.setState({open: false});
  };

  registerUser = event => {
    event.preventDefault();
    if (this.validate_data() && this.validate_password() && this.state.password_1.length >= 8) {

      const data = {
        token: this.state.token,
        password_1: this.state.password_1,
        password_2: this.state.password_2,
        fiscal_number: this.props.fiscal_number,
      };
      Logger.warn("I send this to register: " + JSON.stringify(data));

      fetch(settings.backend.register, {
        method: "POST",
        body: JSON.stringify(data),
        headers: settings.headers_super_auth
      })
        .then(FetchResponses.processResponse)
        .then(this.successRegister)
        .catch(this.failureRegister)
    }

    if (!this.validate_password()) {
      this.setState({
        open: true,
        error_message: Messages.passwordsDoesNotMatch,
      });
    }

    if (!this.validate_data()) {
      this.setState({
        open: true,
        error_message: Messages.invalidOTP,
      });
    }

    if (this.state.password_1.length < 8) {
      this.setState({
        open: true,
        error_message: Messages.passwordLenght,
      });
    }
  };

  registerClose = event => {
    event.preventDefault();
    this.setState({
      token: "",
      password_1: "",
      password_2: "",
      is_valid_code: false,
    });
    this.props.registerClose();
  };

  validStyle = () => {

    if (isMobile) {
      return {top: 10}
    }
  };

  preRegisterUser = event => {
    this.setState({
      token: "",
      password_1: "",
      password_2: "",
      is_valid_code: false,
    });
    this.props.preRegisterUser(event);
    event.preventDefault();
  };

  render() {
    if (this.state.redirect_login) {
      return <Redirect to={"/login"}/>
    }
    if (!this.props.openCodigoRegistro) {
      return null
    }
    let style = this.validStyle();
    return (
      <div>
        <Modal
          visible={this.props.openCodigoRegistro}
          onCancel={this.registerClose}
          maskClosable={false}
          footer={null}
          style={style}
          title={"Digita el código que te enviamos a tu email/celular"}
        >
          <form onSubmit={this.registerUser} className="whitePanel">
            <div className="form-group">
              <InputMask className="form-control" id="token" type="text" placeholder="Ingresa aquí tu código de confirmación"
                         value={this.state.token.replace(/\D|\-/, '')} required maxLength={6} minLength={6}
                         onChange={this.handleChange}/>
            </div>
            <div className="form-group">
              <InputPassword className="form-control" id="password_1" placeholder="Asigna una contraseña" required
                             value={this.state.password_1} onChange={this.handleChange} minLength={8}/>
            </div>
            <div className="form-group">
              <InputPassword className="form-control" id="password_2" placeholder="Confirma la contraseña"
                             required
                             value={this.state.password_2} onChange={this.handleChange} minLength={8}/>
            </div>

            <div className="row justify-content-center">
              <div className="col-12 col-sm-6">
                <button className="btn btn-primary btn-block btn-modal margin-codigos" type="submit"
                        disabled={!this.state.is_valid_code}>
                  Aceptar
                </button>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col text-center">
                <a className="link_action" href="#" onClick={this.preRegisterUser}>
                  Reenviar código
                </a>
              </div>
            </div>
            <div className="row justify-content-center">
              <BarLoader
                sizeUnit='%'
                height={5}
                width={500}
                color='#ff0000'
                loading={this.props.loading}
              />
            </div>

            <Error
              open={this.state.open}
              error_message={this.state.error_message}
              handleClose={this.handleClose}
            />
          </form>
        </Modal>
      </div>
    );
  }
}

export default CodigoRegistro;
