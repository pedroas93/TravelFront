import React from "react";
import "antd/dist/antd.css";


export default class CertificadosTotalPazYSalvoModal extends React.Component {

  state = {open: false};


  certificateSelect = (certificate) =>{
    this.props.certificateSelect( certificate.target.id);
  }

  render() {
    return (
        <div className="panel">
          <h1>Certificados Paz y salvo en conjunto</h1>

              <div className="col col-lg-6">
                <button className="btn btn-primary btn-sm" id="Certificado Paz y Salvo 1"  onClick={this.certificateSelect} >Descargar</button>
              </div>
          </div>
    );
  }
}