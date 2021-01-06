import React from "react";
import "antd/dist/antd.css";


export default class CertificadoDeuda extends React.Component {

  state = { textCertificate: ""};


  certificateSelect = (certificate) =>{
    certificate.preventDefault();
    // if(this.state.textCertificate !== ""){
    this.props.certificateSelect( "Certificado Deuda", this.state.textCertificate);
    // }
  }

  handleChangeTextCertificate = (textCertificate) =>{
    this.setState({textCertificate: textCertificate.target.value});
  }

  render() {
    return (
        <div className="panel">
          <div className=" facturas">
            <h1>Certificado de deuda</h1>
            <form>
              <div className="row">
                {/*<div className="col col-lg-7">*/}
                {/*<input type="text" className="form-control" onChange={this.handleChangeTextCertificate} required*/}
                              {/*placeholder="código de Factura"/>*/}
                {/*</div>*/}
                <div className="col col-lg-3">
                  <button onClick={this.certificateSelect} className="btn btn-primary btn-sm" id="Certificado Deuda" type="submit">Descargar</button>
                </div>
              </div>
            </form>
          </div>
        </div>
    );
  }
}