import React, {Component} from 'react';

import PazYSalvo from "./PazYSalvo";
import CertificadoRenta from "./CertificadoRenta";
import CertificadoDeuda from "./CertificadoDeuda";
import Auth from "../../models/Auth";

class DocumentoPDF extends Component {

  component_to_show = (id) => {
    switch (id) {
      case "CertificadoRenta":
        return (
          <CertificadoRenta
            year={2017}
          />
        );

      case "PazYSalvo":
        return (
          <PazYSalvo/>
        );

      case "CertificadoDeuda":
        return (
          <CertificadoDeuda/>
        );

      default:
        return (<div/>);
    }
  };

  element = () => {
    let id = localStorage.getItem("PDFNavigation");
    return (
      <div className="bg-black-80 w-100 pv5">

          <a className="btn btn-primary btn-block btn-modal"  href="#" id={id} label={"Descargar en PDF"}>descargarpdf</a>
        <div className="scroll">
          {this.component_to_show(id)}
        </div>
      </div>
    );
  };

  render() {
    return Auth.authenticationRequired(this.element());
  }
}

export default DocumentoPDF;
