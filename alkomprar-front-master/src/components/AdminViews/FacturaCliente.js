import React from "react";
import "antd/dist/antd.css";


export default class FacturaCliente extends React.Component {

  state = {open: false};


  certificateSelect = (certificate) =>{
    this.props.certificateSelect( certificate.target.id);
  }
  render() {
    return (
        <div className="panel facturas">
          <h1>Certificado de Facturas</h1>
              <div className="col col-lg-3">
                <button className="btn btn-primary btn-sm"  id="Certificado Factura"  onClick={this.certificateSelect}>Descargar</button>
              </div>
          </div>
    );
  }
}