import React, {Component} from 'react';
import Footer from './Footer';
import Carrusel from './Carrusel';
import Auth from "../../models/Auth";
import Logger from "../../models/Logger";
import settings from "../../settings";
import FetchResponses from "../../models/FetchResponses";
import {Link} from "react-router-dom";
import AlkomprarLogo from "../../images/logo-alkomprar-header.png";
//redux
import {connect} from "react-redux";
import {setDataLandingTotal} from "./landing_Actions";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      landing: []
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
      })

  };

  successResponse = (response) => {
    this.props.setDataLandingTotal(response);
    localStorage.setItem("footer", JSON.stringify(response.modules));
    this.setState({
      landing: this.props.landing.modules
    })
  };

  element = () => (
    <div>
      <div className="hero-section">
        <div className="container">
          <div className="row">
            <div className="col-auto text-left">
              <Link className="btn btn-primary btn-top" to="/login">
                Ingreso Cuenta
              </Link>
            </div>

            <div className="d-none d-sm-block col header-unlogued mb-2 mt-2">
              <img alt="AlkomprarLogo" src={AlkomprarLogo} className="img-responsive alkomprar-logo"/>
            </div>

            <div className="d-sm-none col-12 header-unlogued mt-2">
              <img alt="AlkomprarLogo" src={AlkomprarLogo} className="img-responsive alkomprar-logo"/>
            </div>
          </div>
        </div>
        <Carrusel/>
      </div>
      <div className="content-section">
        <div className="container">
          <div className="row justify-content-center">

            {this.state.landing.map(land => {
              if (land.module_type === "LandingModule") {
                let drip = "icon icon " + land.extra_properties.dripicon + " text-center";
                if (typeof (land.extra_properties) === 'string') {
                  land.extra_properties = JSON.parse(land.extra_properties);
                  drip = "icon icon " + land.extra_properties.dripicon + " text-center";
                }

                if (land.redirect_link.indexOf("http://localhost") >= 0) {
                  let http = "http://localhost";
                  let replace = "";
                  land.redirect_link = land.redirect_link.replace(http, replace);
                }

                return <div key={Math.random()} className="col-12 col-md-6">
                  <div className="landing-white-panel d-flex flex-column justify-content-between">
                    <div className={drip}/>
                    <h2 className="text-center">{land.title}</h2>
                    <p className="text-center">{land.content}</p>
                    <div className="text-center">
                      <a className="btn btn-primary btn-block" href={land.redirect_link}>
                        {land.extra_properties.button}
                      </a>
                    </div>
                  </div>
                </div>
              }
              return null;
            })}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );

  render() {
    Logger.info("Rendering Landing");
    return Auth.notAuthenticationRequired(this.element());
  }
}

const mapStateToProps = state => ({
  landing: state.landing.landing,
});

export default connect(mapStateToProps, {setDataLandingTotal})(Landing);
