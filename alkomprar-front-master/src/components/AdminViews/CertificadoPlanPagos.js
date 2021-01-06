import React from "react";
import "antd/dist/antd.css";


export default class CertificadoPlanPagos extends React.Component {

  state = { textCertificate: "" };


  certificateSelect = (certificate) => {
    certificate.preventDefault();
    if (this.state.textCertificate !== "") {
      this.props.certificateSelect("Certificado Plan Pagos", this.state.textCertificate);
    }
  }

  handleChangeTextCertificate = (textCertificate) => {
    this.setState({ textCertificate: textCertificate.target.value });
  }

  render() {
    return (
      <div className="panel">
        <h1>Certificado Plan de Pagos</h1>
        <form onSubmit={this.certificateSelect}>
          <div className="row">
            <div className="col col-lg-6">
              <input type="text" className="form-control" onChange={this.handleChangeTextCertificate} required
                placeholder="código de Factura" />
            </div>
            <div className="col col-lg-6">
              <button className="btn btn-primary btn-sm" type="submit" >Descargar</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}