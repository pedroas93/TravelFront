import React, {Component} from 'react';
import HeaderPrivate from './HeaderPrivate';
import MenuList from './MenuList';
import Footer from '../PublicViews/Footer';
import Logger from "../../models/Logger";
import Auth from "../../models/Auth";

// redux
import{connect} from 'react-redux';
import{SetMenuCss} from './Menu_Actions';

class FacturasPago extends Component {
  constructor(props) {
    super(props);

    Logger.setLogger(this.constructor.name);
  }

  componentDidMount() {
    //Cambia el estado del menu
    this.props.SetMenuCss(["","","submit","","",""]);
    localStorage.setItem("menu",  JSON.stringify(["","","submit","","",""]));
  }

  element = (
    <div className="container-fluid">
      <div className="sidebar">
        <MenuList/>
      </div>
      <div className="row">
        <div className="col private-wrapper">
          <HeaderPrivate/>

          <div className="wrapper">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <h1><span className="icon dripicons-article"/>Facturas</h1>
              </div>
            </div>

            {/* Facturas */}
            <form>
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="panel">
                    <div className="row justify-content-center">
                      <div className="col col-md-3">
                        <h4 className="labelpay">Tipo de Cliente:</h4>
                      </div>
                      <div className="col col-md-4">
                        <select className="form-control" id="departamento">
                          <option>Persona Natural</option>
                          <option>Persona Jurídica</option>
                        </select>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col col-md-3">
                        <h4 className="labelpay">Nombre de Producto:</h4>
                      </div>
                      <div className="col col-md-4">
                        <p className="payfield">Pago Cuota</p>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col col-md-3">
                        <h4 className="labelpay">Fecha de Pago:</h4>
                      </div>
                      <div className="col col-md-4">
                        <p className="payfield">14/sep/2018</p>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col col-md-3">
                        <h4 className="labelpay">Saldo a pagar:</h4>
                      </div>
                      <div className="col col-md-4">
                        <p className="payfield">$1'988.000</p>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col col-md-3">
                        <h4 className="labelpay">Descripcion del pago:</h4>
                      </div>
                      <div className="col col-md-4">
                        <p className="payfield">Cuota</p>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col col-md-3">
                        <h4 className="labelpay">Nombre de Producto:</h4>
                      </div>
                      <div className="col col-md-4">
                        <p className="payfield">Pago Cuota</p>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col col-md-3">
                        <h4 className="labelpay">Banco:</h4>
                      </div>
                      <div className="col col-md-4">
                        <select className="form-control" id="banco">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col col-md-3">
                        <h4 className="labelpay">Valor a Pagar:</h4>
                      </div>
                      <div className="col col-md-4">
                        <p className="payfield">$300.000</p>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-md-4 offset-md-3">
                        <button type="submit" className="btn btn-primary">Pagar</button>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col">
                        <p className="text-center copytext"><strong>Recuerde que su pago se verá reflejado en la obligación al siguiente día
                          hábil.</strong></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </form>
          </div>
          <Footer/>
        </div>
      </div>
    </div>
  );

  render() {
    Logger.info("Rendering FacturasPago");
    return Auth.authenticationRequired(this.element);
  }
}

const mapStateToProps = state =>({
  menu : state.menu.menu
})

export default connect(mapStateToProps,{SetMenuCss}) (FacturasPago);
