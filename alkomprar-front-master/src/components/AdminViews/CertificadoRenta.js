import React from "react";
import "antd/dist/antd.css";


export default class CertificadoRenta extends React.Component {

  state = { textCertificate: 2017 };


  certificateSelect = (certificate) => {
    certificate.preventDefault();
    if (this.state.textCertificate !== "") {
      this.props.certificateSelect("Certificado Renta", this.state.textCertificate);
    }
  }

  handleChangeTextCertificate = (textCertificate) => {
    this.setState({ textCertificate: textCertificate.target.value });
  }


  render() {
    return (
      <div className="panel">
        <h1>Certificado de Renta</h1>
        <form onSubmit={this.certificateSelect}>
          <div className="row">
            <div className="col col-lg-7">
              <select value={this.state.value} className="form-control" onChange={this.handleChangeTextCertificate} required>
              {
                (() => {
                  let options =[];
                  for(let i=(new Date()).getFullYear() -1; i>= 2017 ; i--){
                    options.push(
                      <option value={i} key={i}>{i}</option>
                    )
                  }
                  return options;
                })()
              }
              </select>
            </div>
            <div className="col col-lg-3">
              <button className="btn btn-primary btn-sm" id="Certificado Renta" type="submit">Descargar</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}