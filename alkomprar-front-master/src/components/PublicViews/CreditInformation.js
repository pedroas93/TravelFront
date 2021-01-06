import React, {Component} from "react";
import Auth from "../../models/Auth";
import PublicHeader from "./PublicHeader";
import Footer from "./Footer";


class CreditInformation extends Component {
  constructor(props) {
    super(props);
  }

  element = () => (
    <React.Fragment>
      <PublicHeader/>

      <div className="container-image-complete">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <img alt="image-complete1" className="image-complete" src="https://alkomprar.s3.amazonaws.com/paginas/07.png"/>
          </div>
        </div>
      </div>

      <div className="container mt-3 mb-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 private-wrapper">

            <div className="row justify-content-center">
              <div className="col-12 col-md-8">
                <h1>
                  Información de crédito
                </h1>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-12 text-center">
                <img alt="image-complete2" src="https://alkomprar.s3.amazonaws.com/paginas/09.png"/>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-12 col-md-8">
                <ul>
                  <li>No te cobramos cuota de manejo</li>
                  <li>Estudiamos tu crédito solo presentando tu cédula*</li>
                  <li>La cuota expresada es la cuota cobrada</li>
                  <li>Periodos de pago quincenales y mensuales</li>
                  <li>Tú eliges a cuantas cuotas quieres sacar el crédito*</li>
                  <li>Puedes pagas tus cuotas en todos los Alkosto y K-Tronix, donde haya presencia del "Kredito en 20 minutos"</li>
                  <li>En caso de fallecer el titular de la obligación, la deuda quedará condonada</li>
                </ul>
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

export default CreditInformation;