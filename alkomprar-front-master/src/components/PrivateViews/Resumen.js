import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import HeaderPrivate from './HeaderPrivate';
import MenuList from './MenuList';
import Footer from '../PublicViews/Footer';
import Logger from "../../models/Logger";
import Auth from "../../models/Auth";
import settings from "../../settings";
import FetchResponses from "../../models/FetchResponses";
import SummaryInvoices from "./SummaryInvoices";
import {Messages} from "../../models/Messages";
import Error from "../PublicViews/Error";
// redux
import {connect} from 'react-redux';
import {SetMenuCss} from './Menu_Actions';

class Resumen extends Component {
  constructor(props) {
    super(props);

    let last_user = JSON.parse(Auth.getLastUserData());
    this.state = {
      name_avatar: last_user && last_user.first_name ? (last_user.first_name.charAt(0) + last_user.last_name.charAt(0)).toUpperCase() : "_",
      full_name: last_user && last_user.first_name ? `${last_user.first_name} ${last_user.last_name}`.toUpperCase() : "_",
      fiscal_number: last_user && last_user.fiscal_number ? last_user.fiscal_number : "_",
      balance_text: "SALDO TOTAL MORA",
      to_pay: 0,
      quota_approved: 0,
      debt_balance: 0,
      quota_available: 0,
      invoices: [],
      loading: false,
    };
    Logger.setLogger(this.constructor.name);
  }

  componentDidMount() {
    //Cambia el estado del menu
    this.props.SetMenuCss(["submit", "", "", "", "", ""]);
    localStorage.setItem("menu", JSON.stringify(["submit", "", "", "", "", ""]));
    this.setState({
      loading: true
    });
    fetch(settings.backend.summary, {
      method: "GET",
      headers: settings.headers_auth(Auth.getSessionToken())
    })
      .then(FetchResponses.processResponse)
      .then(this.successDataResponse)
      .catch(this.failureDataResponse)
  }

  successDataResponse = response => {
    let full_name = (response.user.first_name + ' ' + response.user.last_name).toUpperCase();
    let name_avatar = (response.user.first_name.charAt(0) + response.user.last_name.charAt(0)).toUpperCase();
    let fiscal_numer = response.user.fiscal_number;
    let balance_text = 'SALDO TOTAL MORA';
    let to_pay = 0;
    let quota_approved = 0;
    let debt_balance = 0;
    let quota_available = 0;
    let invoices = [];

    if (response.total_balance) {
      balance_text = response.total_balance.mora > 0 ? "SALDO TOTAL MORA" : "TOTAL PROXIMAS CUOTAS";
      to_pay = response.total_balance.mora > 0 ? response.total_balance.mora : response.total_balance.next_quota;
    }
    if (response.summary) {
      quota_approved = response.summary.quota_approved;
      debt_balance = response.summary.debt_balance;
      quota_available = response.summary.quota_available;
    }
    if (response.invoices) {
      invoices = response.invoices;
    }

    let loading = false;
    this.setState({
      fiscal_numer,
      full_name,
      loading,
      balance_text,
      to_pay,
      name_avatar,
      quota_approved,
      debt_balance,
      quota_available,
      invoices
    })
  };

  handleClose = () => {
    this.setState({open: false});
  };

  failureDataResponse = error => {
    Logger.error(error);
    this.setState({
      open: true,
      error_message: Messages.errorTryLater,
      loading: false,
    });
  };

  element = () => {
    return (
      <div className="container-fluid">
        <div className="sidebar">
          <MenuList disabled={this.state.loading}/>
        </div>
        <div className="row">
          <div className="col private-wrapper">
            <HeaderPrivate menu_list={this.state.loading}/>

            <div className="wrapper">
              <div className="row justify-content-center">
                <div className="col-lg-10 col-xl-8">


                  <div className="panel usuario">
                    <div className="row">
                      <div className="col-12 col-md-5">

                        <div className="d-flex d-flex flex-column justify-content-between h-100">
                          <h3>PAGA AQUÍ LAS CUOTAS DE TU CRÉDITO</h3>
                          {/* <p>
                            <strong>
                              ${(this.state.to_pay).toLocaleString('de-DE', {maximumFractionDigits: 0})}
                            </strong>
                          </p> */}
                          <Link to="/facturas"
                                className={`btn btn-primary ${this.state.loading ? "disabled" : ""}`}>
                            Pagar
                          </Link>
                        </div>
                      </div>

                      <div className="col-12 d-sm-block d-md-none">
                        <hr/>
                      </div>

                      <div className="col-12 col-md-7 vertical-md">
                        <div className="d-flex flex-column justify-content-between h-100">
                          <h3>{this.state.full_name}</h3>
                          <p>{this.state.fiscal_number}</p>
                          <Link to="/perfil"
                                className={`btn btn-primary btn-block ${this.state.loading ? "disabled" : ""}`}>
                            Actualizar datos
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* resumen */}
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="panel facturas">
                        <h4>Resumen</h4>
                        <div className="row">
                          <div className="col-lg-4">
                            <h5>Cupo Aprobado</h5>
                            <p className="text-primary">
                              ${(this.state.quota_approved).toLocaleString('de-DE', {maximumFractionDigits: 0})}
                            </p>
                          </div>
                          <div className="col-lg-4">
                            <h5>Saldo Total Deuda</h5>
                            <p className="text-warning">
                              ${this.state.debt_balance.toLocaleString('de-DE', {maximumFractionDigits: 0})}
                            </p>
                          </div>
                          <div className="col-lg-4">
                            <h5>Cupo Disponible</h5>
                            <p className="text-success">
                              ${this.state.quota_available.toLocaleString('de-DE', {maximumFractionDigits: 0})}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* facturas */}
                  <SummaryInvoices invoices={this.state.invoices} loading={this.state.loading}/>

                </div>
              </div>
            </div>

            <Footer/>
          </div>
        </div>
        <Error
          open={this.state.open}
          error_message={this.state.error_message}
          handleClose={this.handleClose}
        />
      </div>
    )
  };

  render() {
    return Auth.authenticationRequired(this.element());
  }
}

const mapStateToProps = state => ({
  menu: state.menu.menu
});

export default connect(mapStateToProps, {SetMenuCss})(Resumen);
