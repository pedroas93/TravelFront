import React from "react";
import "antd/dist/antd.css";


export default class CertificadoPazYSalvoModal extends React.Component {

  state = { textCertificate: ""};


  certificateSelect = (certificate) =>{
    if(this.state.textCertificate !== ""){
      this.props.certificateSelect( "Certificado Paz y Salvo 2", this.state.textCertificate);
    }
  }

  handleChangeTextCertificate = (textCertificate) =>{
    textCertificate.preventDefault();
    this.setState({textCertificate: textCertificate.target.value});
  }


  render() {
    return (
        <div className="panel">
          <h1>Certificado de Paz y salvo Por factura</h1>
            <form onSubmit={this.certificateSelect}>
              <div className="row">
                  <div className="col col-lg-6">
                  <input type="text" className="form-control" onChange={this.handleChangeTextCertificate} required
                                  placeholder="código de Factura"/>
                  </div>
                  <div className="col col-lg-6">
                    <button className="btn btn-primary btn-sm" id="Certificado Paz y Salvo 2"  type="submit" >Descargar</button>
                  </div>
              </div>
            </form>        
      </div>
    );
  }
}