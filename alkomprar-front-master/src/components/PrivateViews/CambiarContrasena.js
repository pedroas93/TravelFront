import React, {Component} from "react";
import Logger from "../../models/Logger";
import settings from "../../settings";
import FetchResponses from "../../models/FetchResponses";
import Auth from "../../models/Auth";
import Error from "../PublicViews/Error";
import "antd/dist/antd.css";
import {Modal} from "antd";
import {Messages, translateDetails} from "../../models/Messages";
import InputPassword from "../PublicViews/InputPassword";

class CambiarContrasena extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password_1: "",
      password_2: "",
      error_message: "",
      open: false
    };

    Logger.setLogger(this.constructor.name);
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  successChangePassword = response => {
    let open = true;
    let error_message = translateDetails(response.detail);
    this.setState({
      open,
      error_message,
    });
  };

  failureChangePassword = error => {
    Logger.error(error);
    this.setState({
      open: true,
      error_message: Messages.errorTryLater,
      password_1: "",
      password_2: "",
    });
  };

  validate_data = () => {
    return this.state.password_1 === this.state.password_2;
  };

  handleClose = () => {
    this.setState({open: false});
    if (this.state.error_message === Messages.successChangePassword) {
      Auth.logoutUser();
      this.passwordClose();
    }
  };

  changePassword = event => {
    event.preventDefault();
    event.stopPropagation();
    if (this.validate_data() && this.state.password_1.length >= 8) {
      const data = {
        password_1: this.state.password_1,
        password_2: this.state.password_2,
      };
      Logger.warn("I send this to register: " + JSON.stringify(data));
      fetch(settings.backend.changePassword, {
        method: "POST",
        body: JSON.stringify(data),
        headers: settings.headers_auth(Auth.getSessionToken())
      })
        .then(FetchResponses.processResponse)
        .then(this.successChangePassword)
        .catch(this.failureChangePassword);
    }
    if (!this.validate_data()) {
      this.setState({
        open: true,
        error_message: Messages.passwordsDoesNotMatch,
      });
    }

    if (this.state.password_1.length < 8) {
      this.setState({
        open: true,
        error_message: Messages.passwordLenght,
      });
    }

  };

  passwordClose = () => {
    this.setState({
      password_1: "",
      password_2: "",
    });
    this.props.passwordClose();
  };

  element = () => {
    return (
      
      <Modal
        visible={this.props.openChangePasword}
        footer={null}
        onCancel={this.passwordClose}
        maskClosable={false}
        title={"Digita la contraseña"}
        className="whitePanel"
      >
        <form onSubmit={this.changePassword}>
          <div>
            <div className="form-group">
              <InputPassword className="form-control" id="password_1" placeholder="Escribe tu nueva contraseña" required
                             value={this.state.password_1} onChange={this.handleChange}/>
            </div>

            <div className="form-group">
              <InputPassword className="form-control" id="password_2" placeholder="Confirma la nueva contraseña" required
                             value={this.state.password_2} onChange={this.handleChange}/>
            </div>

            <div className="row justify-content-center">
              <div className="col-12 col-sm-6">
                <div>
                  <button className="btn btn-primary btn-block btn-modal" type="submit" color="primary">Aceptar</button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <Error
          open={this.state.open}
          error_message={this.state.error_message}
          handleClose={this.handleClose}
        />
      </Modal>
    )
  };

  render() {
    if (this.props.openChangePasword) {
      return this.element();
    }
    return null;
  }
}

export default CambiarContrasena;
