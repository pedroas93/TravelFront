import React, {Component} from "react";
import Auth from "../../models/Auth";
import Footer from "./Footer";
import PublicHeader from "./PublicHeader";
import InfoModuleList from "./InfoModuleList";
import settings from "../../settings";
import FetchResponses from "../../models/FetchResponses";


class Information extends Component {
  constructor(props) {
    super(props);
    let modules = [];
    this.state = {
      modules,
      information: [],
    }
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
    let modules = [];
    response.modules.forEach(element => {
      if (element.module_type === "Information") {
        modules = [...modules, element]
      }
    });
    console.log('----------->', modules);
    modules.sort(function (a, b) {
      return (a.extra_properties.position - b.extra_properties.position)
    })
    this.setState({
      information: response.modules,
      modules,
    })
  };

  element = () => (
    <React.Fragment>
      <PublicHeader/>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 private-wrapper">

          {/*Title and text*/}
          <div className="row justify-content-center">
            <div className="col-11 col-lg-10 col-xl-8">
              <h3>
                <span className="icon dripicons-copy"/>
                Información de interés
              </h3>
              <h5 className="text-justify">
                Para entender todas tus necesidades sin importar donde te encuentres, en Alkomprar te ofrecemos este
                espacio para que resuelvas todas tus inquietudes.
              </h5>
            </div>
          </div>

          <InfoModuleList modules={this.state.modules}/>

          <Footer/>
        </div>
      </div>
    </React.Fragment>
  );

  render() {
    return Auth.notAuthenticationRequired(this.element());
  }
}

export default Information;
