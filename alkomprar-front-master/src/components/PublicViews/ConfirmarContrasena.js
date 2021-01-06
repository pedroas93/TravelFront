import React, {Component} from 'react';
import Logger from "../../models/Logger";
import settings from "../../settings";
import FetchResponses from "../../models/FetchResponses";
import {Redirect} from "react-router-dom";
import Error from './Error';
import {Modal} from "antd";
import {Messages, translateDetails} from "../../models/Messages";
import {isMobile} from 'react-device-detect';
import InputPassword from "./InputPassword";
import InputMask from "react-input-mask";


class ConfirmarContrasena extends Component {
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
    Logger.info("Success response: " + JSON.stringify(response));
    let open = true;
    let error_message = translateDetails(response.detail);
    this.setState({open, error_message});
  };

  failureRegister = error => {
    let open = true;
    let is_valid_code = false;
    let error_message = translateDetails(error.detail);
    this.setState({
      token: "",
      password_1: "",
      password_2: "",
      open,
      error_message,
      is_valid_code,
    })
  };

  handleClose = () => {
    if (this.state.error_message === Messages.successResetPassword) {
      this.setState({redirect_login: true});
    }
    this.setState({open: false});
  };

  validate_data = () => {
    return this.state.password_1 === this.state.password_2;
  };

  validate_token_length = () => {
    return this.state.token.length >= 6 && this.state.token.length <= 8;
  };


  registerClose = event => {
    event.preventDefault();
    this.setState({
      token: "",
      password_1: "",
      password_2: "",
      is_valid_code: false,
    });
    this.props.passwordClose();
  };

  changePassword = event => {
    event.preventDefault();
    event.stopPropagation();
    if (this.validate_data() && this.validate_token_length && this.state.password_1.length >= 8) {

      const data = {
        password_1: this.state.password_1,
        token: this.state.token,
        password_2: this.state.password_2,
        fiscal_number: this.props.fiscal_number,
      };
      Logger.warn("I send this to register: " + JSON.stringify(data));

      fetch(settings.backend.password_reset_confirm, {
        method: "POST",
        body: JSON.stringify(data),
        headers: settings.headers_super_auth
      })
        .then(FetchResponses.processResponse)
        .then(this.successRegister)
        .catch(this.failureRegister)
    } else if (!this.validate_data()) {
      this.setState({
        open: true,
        error_message: Messages.passwordsDoesNotMatch,
      });
    } else if (!this.validate_token_length()) {
      this.setState({
        open: true,
        error_message: Messages.invalidOTP,
      });
    } else if (this.state.password_1.length < 8) {
      this.setState({
        open: true,
        error_message: Messages.passwordLenght,
      });
    }
  };

  validStyle = () => {

    if (isMobile) {
      return {top: 10}
    }
  };

  render() {
    if (this.state.redirect_login) {
      return <Redirect to={"/login"}/>
    }
    if (!this.props.openConfirmarContrasena) {
      return null
    }
    let style = this.validStyle();
    return (

      <Modal
        visible={this.props.openConfirmarContrasena}
        onCancel={this.registerClose}
        maskClosable={false}
        footer={null}
        title={this.props.title}
        style={style}
      >
        <form onSubmit={this.changePassword} className="whitePanel">
          <div>
            <div className="form-group">
              <InputMask className="form-control" id="token" type="text" placeholder="Ingresa aquí tu código de confirmación"
                         value={this.state.token.replace(/\D|\-/, '')} required maxLength={6} minLength={6}
                         onChange={this.handleChange}/>
            </div>

            <div className="form-group">
              <InputPassword className="form-control" id="password_1" placeholder="Escribe una contraseña"
                             required minLength={8}
                             value={this.state.password_1} onChange={this.handleChange}/>
            </div>

            <div className="form-group">
              <InputPassword className="form-control" id="password_2" placeholder="Confirma la contraseña"
                             required minLength={8}
                             value={this.state.password_2} onChange={this.handleChange}/>
            </div>
            <div className="row justify-content-center">
              <div className="col-12 col-sm-6">
                <div>
                  <button className="btn btn-primary btn-block btn-modal" type="submit"
                          disabled={!this.state.is_valid_code}>
                    Aceptar
                  </button>
                </div>
              </div>
            </div>

          </div>
          <Error
            open={this.state.open}
            error_message={this.state.error_message}
            handleClose={this.handleClose}
          />
        </form>
      </Modal>
    );
  }
}

export default ConfirmarContrasena;