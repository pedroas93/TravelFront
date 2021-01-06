import React, {Component} from "react";
import Auth from "../../models/Auth";
import PublicHeader from "./PublicHeader";
import Footer from "./Footer";


class AttentionLines extends Component {
  constructor(props) {
    super(props);
  }

  element = () => (
    <React.Fragment>
      <PublicHeader/>

      <div className="container-image-complete">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <img alt="image-complete1" className="image-complete"
                 src="https://alkomprar.s3.amazonaws.com/paginas/08.png"/>
          </div>
        </div>
      </div>

      <div className="container mt-3 mb-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 private-wrapper">

            <div className="row justify-content-center">
              <div className="col-12 col-md-8">
                <h1 className="mb-5">
                  Líneas de Atención
                </h1>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-12 col-md-8">
                <h2 className="mb-5">
                  Servicio al cliente
                </h2>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-12 col-md-8">
                <h3>
                  <span className="icon dripicons-phone"/>
                  Medellín: <a href={`tel:(034) 604 2323`}>(034) 604 2323</a>
                </h3>
              </div>

              <div className="col-12 col-md-8">
                <h3>
                  <span className="icon dripicons-phone"/>
                  Línea gratuita nacional: <a href={`tel:018000 94 6000`}>018000 94 6000</a>
                </h3>
              </div>
            </div>


          </div>
        </div>
      </div>
      <Footer/>
    </React.Fragment>
  );

  render() {
    return Auth.notAuthenticationRequired(this.element());
  }

}

export default AttentionLines;