import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import HeaderLogo from "./HeaderLogo";
import Footer from "./Footer";
import Logger from "../../models/Logger";
import Auth from "../../models/Auth";
import settings from "../../settings";
import FetchResponses from "../../models/FetchResponses";
import Error from "./Error";
import {Messages, translateDetails} from "../../models/Messages";
import InputPassword from "./InputPassword";
// redux
import {connect} from 'react-redux';
import {SetPerfil} from '../PrivateViews/Perfil_Actions';
import {setDataLandingTotal} from "./landing_Actions";

class Login extends Component {
  constructor(props) {
    super(props);

    const last_user = Auth.getLastUserData();
    this.state = {
      fiscal_number: last_user ? JSON.parse(last_user).fiscal_number : "",
      password: "",
      error_message: "",
      pending_information: false,
      open: false,
      full_name: "",
      email: "",
      phone: "",
      home_phone: "",
      landing: [],
      loading: false,
    };
    Logger.setLogger(this.constructor.name);
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  componentDidMount = () => {
    fetch(settings.backend.list_front_modules, {
      method: 'GET',
      headers: settings.headers_super_auth
    }).then(FetchResponses.processResponse)
      .then(this.successResponse)
      .catch(error => {
        Logger.error(error);
      })
  };

  successResponse = response => {
    this.props.setDataLandingTotal(response);
    localStorage.setItem("footer", JSON.stringify(response.modules));
    this.setState({
      landing: this.props.landing
    })
  };

  handleClose = () => {
    this.setState({open: false});
  };

  successLogin = response => {
    Logger.warn("Success Login: " + JSON.stringify(response));
    Auth.loginUser(response.token, response.is_admin);
    Auth.setLastUserData(this.state);
    this.setState({
      pending_information: response.pending_information,
      loading: false,
    });
    if (response.pending_information) {
      localStorage.setItem("menu", JSON.stringify(["", "submit", "", "", "", ""]));
    } else {
      localStorage.setItem("menu", JSON.stringify(["submit", "", "", "", "", ""]));
    }

    // Consult User Information
    fetch(settings.backend.dataResponse, {
      method: "GET",
      headers: settings.headers_auth(Auth.getSessionToken())
    })
      .then(FetchResponses.processResponse)
      .then(this.successDataResponse)
      .catch(this.failureDataResponse);
  };

  failureDataResponse = () => {
    this.setState({
      open: true,
      error_message: Messages.errorTryLater,
    });
  };

  successDataResponse = response => {
    let full_name = `${response.first_name} ${response.last_name}`.toUpperCase();
    let first_name = response.first_name;
    let last_name = response.last_name;
    let {fiscal_number, email, phone, home_phone} = response;
    let name_avatar = (first_name.charAt(0) + last_name.charAt(0)).toUpperCase();
    Auth.setLastUserData(response);
    let object = {first_name, full_name, name_avatar, last_name, fiscal_number, email, phone, home_phone};
    this.props.SetPerfil(object);
  };

  failureLogin = error => {
    Logger.error(error);
    Logger.info("Login Failed: " + JSON.stringify(error));
    let error_message = translateDetails(error.detail);
    this.setState({
      open: true,
      error_message,
      loading: false,
    });
  };

  login = event => {
    event.preventDefault();
    this.setState({loading: true});
    const data = {
      fiscal_number: this.state.fiscal_number,
      password: this.state.password
    };
    fetch(settings.backend.login, {
      method: "POST",
      body: JSON.stringify(data),
      headers: settings.headers_super_auth
    })
      .then(FetchResponses.processResponse)
      .then(this.successLogin)
      .catch(this.failureLogin);
  };

  validateFields = () => {
    return this.state.fiscal_number.length >= 4 && this.state.password.length >= 4 && !this.state.loading;
  };

  element = () => {
    Logger.info("Render element");
    return (
      <div className="gradient-bk">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col col-lg-5">
              <HeaderLogo/>
              <form onSubmit={this.login}>
                <div className="whitePanel login">
                  <h1>Ingreso clientes</h1>

                  <div className="form-group">
                    <span className="icon dripicons-user"/>
                    <input
                      type="text"
                      className="form-control"
                      id="fiscal_number"
                      placeholder="Ingresa tu Cédula"
                      required
                      onChange={this.handleChange}
                      value={this.state.fiscal_number}
                    />
                  </div>

                  <div className="form-group">
                    <span className="icon dripicons-lock"/>
                    <InputPassword
                      className="form-control"
                      id="password"
                      placeholder="Ingresa tu Contraseña"
                      required
                      onChange={this.handleChange}
                      value={this.state.password}
                    />
                  </div>

                  <div className="form-group">
                    <p>
                      <Link to="/recuperar-clave">
                        ¿Olvidaste tú contraseña?
                      </Link>
                    </p>
                    <p>
                      <Link to="/registro">
                        ¿Aún no tienes clave? Solicitala aquí
                      </Link>
                    </p>
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={!this.validateFields()}>
                      Ingresar
                    </button>
                  </div>
                </div>
              </form>
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
    if (this.state.pending_information) {
      Logger.info("Redirect to perfil");
      return <Redirect to={"/perfil"}/>
    }
    return Auth.notAuthenticationRequired(this.element());
  }
}

const mapStateToProps = state => ({
  perfil: state.perfil.perfilInformation,
  PDF: state.PDF.PDF
});

export default connect(mapStateToProps, {SetPerfil, setDataLandingTotal})(Login);
