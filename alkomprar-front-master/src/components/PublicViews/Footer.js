import React, {Component} from 'react';
import Logger from "../../models/Logger";
import settings from "../../settings";
import FetchResponses from "../../models/FetchResponses";
//redux
import {connect} from "react-redux";
import {setDataLandingTotal} from "./landing_Actions";
import LogoCredito from "../../images/logo-cred20min.png";
import {BackTop} from "antd";


class Footer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      landing: [],
      stateLanding: false
    };
    Logger.setLogger(this.constructor.name)
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

  successResponse = (response) => {
    this.props.setDataLandingTotal(response);
    localStorage.setItem("footer", JSON.stringify(response.modules));
    this.setState({
      landing: response.modules,
    })
  };

  element = () => (
    <footer>
      <BackTop visibilityHeight={300}/>
      <div className="container">
        <div className="d-flex justify-content-between">
          <div className="col-7">
            <ul className="socialShare">
              <h5 className="text-center">Síguenos</h5>
              {this.state.landing.map(land => {
                if (land.module_type === "Contacto" && land.redirect_link !== null) {
                  let social = land.title;
                  let icon = "";

                  if (social.indexOf("Twitter") >= 0) {
                    icon = "twitterIcon";
                  }
                  if (social.indexOf("Facebook") >= 0) {
                    icon = "facebookIcon";
                  }
                  if (social.indexOf("Instagram") >= 0) {
                    icon = "instagramIcon";
                  }
                  if (social.indexOf("Youtube") >= 0) {
                    icon = "youtubeIcon";
                  }
                  return <li key={Math.random()}>
                    <a href={land.redirect_link} target="_blank" className={icon}>{land.title}</a>
                  </li>
                }
              })}

            </ul>
          </div>
          <div className="col-5 text-center align-self-center">
            <img alt="logoCredito20Min" src={LogoCredito} className="img-responsive logoCredito20Min"/>
          </div>

        </div>

        <div className="row">
          <div className="col-lg-12 text-center">
            <p className="text-center">Colombiana de Comercio S.A. NIT 890.900.943-1 SERVICIO AL CLIENTE:</p>
            <p className="text-center"><a href="/faq">Preguntas frecuentes</a></p>
            {this.state.landing.map(land => {
              if (land.module_type === "Contacto" && land.content !== null && land.title.indexOf("Medellín") >= 0) {
                return <p key={Math.random()} className="text-center">{land.title}: <a
                  href={`tel:${land.content}`}>{land.content}</a></p>
              }
              if (land.module_type === "Contacto" && land.content !== null && land.title.indexOf("Nacional") >= 0) {
                return <p key={Math.random()} className="text-center">{land.title}: <a
                  href={`tel:${land.content}`}>{land.content}</a></p>
              }
            })}
            <p className="text-center"> Email:
              <a href="mailto:alkomprar.serviciocliente@corbeta.com.co">alkomprar.serviciocliente@corbeta.com.co</a></p>
          </div>
        </div>
      </div>
    </footer>
  );

  render() {
    return this.element();
  }
}

const mapStateToProps = state => ({
  landing: state
});
export default connect(mapStateToProps, {setDataLandingTotal})(Footer);
