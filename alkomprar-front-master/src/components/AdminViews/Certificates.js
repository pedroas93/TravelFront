import React, {Component} from 'react';
import FetchResponses from "../../models/FetchResponses";
import Auth from "../../models/Auth";
import MenuList from './MenuList';
import Footer from '../PublicViews/Footer';
import HeaderPrivate from '../PrivateViews/HeaderPrivate';
import {Messages, translateDetails} from "../../models/Messages";
// redux
import {connect} from 'react-redux';
import settings from '../../settings';
import Logger from '../../models/Logger';
import Error from '../PublicViews/Error';
import {SetMenuManager} from '../PrivateViews/Menu_Actions';
import {Modal} from "antd";

class Certificates extends Component {
  info = Modal.info;

  constructor(props) {
    super(props);
    let available_years = [];
    const last_year = (new Date()).getFullYear() - 1;
    for (let i = last_year; i >= 2017; i--) {
      available_years.push(i);
    }
    this.state = {
      fiscal_number: '',
      last_fiscal_number: '',
      loading: false,
      year: last_year,
      available_years,
      open: false,
      error_message: Messages.errorTryLater,
      invoices: [],
      payment_plan_invoice: '',
      peace_salve_invoice: 'General',
    };
    Logger.setLogger(this.constructor.name);
  }

  hasInvoices = () => {
    const invoices = this.state.invoices;
    return (invoices.length > 0)
  };

  componentDidMount() {
    //Cambia el estado del menu
    this.props.SetMenuManager(["", "", "", "", "", "submit"]);
    localStorage.setItem("menu", JSON.stringify(["", "", "", "", "", "submit"]));
  }

  handleChange = event => {
    this.setState({[event.target.id]: event.target.value});
  };

  consultCertificate = url => {
    fetch(url, {
      method: "GET",
      headers: settings.headers_auth(Auth.getSessionToken()),
    })
      .then(FetchResponses.processResponse)
      .then(this.successResponse)
      .catch(this.errorResponse);
  };

  consultRentCert = event => {
    event.preventDefault();
    const year = this.state.year;
    const user = this.state.fiscal_number;
    this.setState({loading: true});
    this.consultCertificate(settings.backend.admin_rent_cert(user, year));
  };

  consultPaymentPlanCert = event => {
    event.preventDefault();
    const payment_plan_invoice = this.state.payment_plan_invoice;
    const user = this.state.fiscal_number;
    this.setState({loading: true});
    this.consultCertificate(settings.backend.admin_payment_plan_cert(user, payment_plan_invoice));
  };

  consultPeaceCert = () => {
    // event.preventDefault();
    const peace_salve_invoice = this.state.peace_salve_invoice;
    const user = this.state.fiscal_number;
    this.setState({loading: true});
    let url = settings.backend.admin_peace_salve_cert(user);
    if (peace_salve_invoice !== 'General') {
      url = url + peace_salve_invoice + '/';
    }
    this.consultCertificate(url);
  };

  consultDebtCert = event => {
    event.preventDefault();
    const user = this.state.fiscal_number;
    this.setState({loading: true});
    this.consultCertificate(settings.backend.admin_debt_cert(user));
  };

  consultInvoices = () => {
    let fiscal_number = this.state.fiscal_number;
    if (fiscal_number.length < 4) {
      let open = true;
      let loading = false;
      let error_message = Messages.errorTryLater;
      this.setState({open, error_message, loading});
      return
    }

    let loading = true;
    this.setState({loading, last_fiscal_number: fiscal_number});

    fetch(settings.backend.admin_all_invoices(fiscal_number), {
      method: "GET",
      headers: settings.headers_auth(Auth.getSessionToken()),
    })
      .then(FetchResponses.processResponse)
      .then(response => {
        let loading = false;
        if (!response.detail && response) {
          this.setState({loading});
          let invoices = [];
          response.forEach(invoice => {
            invoices.push(invoice.INVOICE);
          });
          let payment_plan_invoice = invoices[0];
          this.setState({invoices, payment_plan_invoice});
        } else if (response.detail) {
          let invoices = [];
          let open = true;
          let error_message = translateDetails(response.detail);
          this.setState({open, error_message, invoices, loading})
        }
      })
      .catch(error => {
        let open = true;
        let loading = false;
        let error_message = Messages.errorTryLater;
        this.setState({open, error_message, loading});
      });
  };

  successResponse = response => {
    this.setState({loading: false});
    if (response.url_certificate) {
      let link = document.createElement('a');
      link.setAttribute('href', response.url_certificate);
      link.setAttribute('target', '_blank');
      link.click();
    } else {
      let open = true;
      let error_message = translateDetails(response.detail);
      this.setState({open, error_message})
    }
  };

  errorResponse = error => {
    let open = true;
    let loading = false;
    let error_message = Messages.errorTryLater;
    this.setState({open, error_message, loading});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  firtsOptionPlanInvoice = () => {
    if (!this.hasInvoices()) {
      return (<option value={null} key={null}>Sin facturas</option>);
    }
  };

  firtsOptionPeaceInvoice = () => {
    if (this.hasInvoices()) {
      return (<option value='General' key='General'>General</option>);
    } else {
      return (<option value={null} key={null}>Sin facturas</option>);
    }
  };

  showConfirmPeaceSalve = () => {
    let _this = this;
    this.info({
      title: 'Alkomprar te informa.',
      content: Messages.infoCertPeaceSalve,
      okText: 'Descargar paz y salvo',
      onOk() {
        _this.consultPeaceCert();
      },
    });
  };


  element = () => (
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
                <div className="row">
                  <div className="col-12">
                    <h1>
                      <span className="icon dripicons-blog"/>
                      Documentos y Certificados
                    </h1>
                  </div>
                </div>

                {/* Documentos */}
                <div className="row justify-content-center">
                  <div className="col-12">

                    <div className="panel usuario">

                      <div className="row align-items-center">

                        <div className="col-12">
                          <div className="alert alert-info">
                            <span className="icon dripicons-information"/>
                            Proporcione una cédula, para diligenciar los certificados.
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <input className="form-control" id="fiscal_number" value={this.state.fiscal_number}
                                 onChange={this.handleChange} placeholder="Cédula"/>
                        </div>
                        <div className="col-12 col-md-6">
                          <button onClick={this.consultInvoices} className="btn btn-primary btn-block"
                                  disabled={this.state.fiscal_number.length < 5 ||
                                  this.state.fiscal_number === this.state.last_fiscal_number || this.state.loading}>
                            Consultar
                          </button>
                        </div>

                      </div>

                      <hr/>

                      <h2>Certificados:</h2>

                      <div className="row justify-content-center align-items-center text-center">

                        <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                          <div className="panel">
                            <hr/>
                            <h3>Paz y Salvo</h3>
                            <div className="row">
                              {/*<div className="col-12">*/}
                              {/*<select id='peace_salve_invoice' value={this.state.peace_salve_invoice}*/}
                              {/*className="form-control"*/}
                              {/*onChange={this.handleChange}*/}
                              {/*required>*/}
                              {/*{this.firtsOptionPeaceInvoice()}*/}
                              {/*{*/}
                              {/*this.state.invoices.map(invoice => {*/}
                              {/*return (<option value={invoice} key={invoice}>{invoice}</option>);*/}
                              {/*})*/}
                              {/*}*/}
                              {/*</select>*/}
                              {/*</div>*/}
                              <div className="col-12">
                                <button onClick={this.showConfirmPeaceSalve} className="btn btn-primary btn-block"
                                        disabled={this.state.fiscal_number.length < 5 ||
                                        this.state.fiscal_number !== this.state.last_fiscal_number ||
                                        this.state.loading}>
                                  Descargar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                          <div className="panel">
                            <hr/>
                            <h3>De Deuda</h3>
                            <div className="row">
                              <div className="col-12">
                                <button onClick={this.consultDebtCert} className="btn btn-primary btn-block"
                                        disabled={this.state.fiscal_number.length < 5 ||
                                        this.state.fiscal_number !== this.state.last_fiscal_number ||
                                        this.state.loading}>
                                  Descargar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                          <div className="panel">
                            <hr/>
                            <h3>De Renta</h3>
                            <div className="row">
                              <div className="col-12">
                                <select id='year' value={this.state.year} className="form-control"
                                        onChange={this.handleChange}>
                                  {
                                    this.state.available_years.map(year => {
                                      return (<option value={year} key={year}>{year}</option>);
                                    })
                                  }
                                </select>
                              </div>
                              <div className="col-12">
                                <button onClick={this.consultRentCert} className="btn btn-primary btn-block"
                                        disabled={this.state.fiscal_number.length < 5 ||
                                        this.state.fiscal_number !== this.state.last_fiscal_number ||
                                        this.state.loading}>
                                  Descargar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                          <div className="panel">
                            <hr/>
                            <h3>Plan de Pagos</h3>
                            <div className="row">
                              <div className="col-12">
                                <select id='payment_plan_invoice' value={this.state.payment_plan_invoice}
                                        className="form-control"
                                        onChange={this.handleChange}>
                                  {this.firtsOptionPlanInvoice()}
                                  {
                                    this.state.invoices.map(invoice => {
                                      return (<option value={invoice} key={invoice}>{invoice}</option>);
                                    })
                                  }
                                </select>
                              </div>
                              <div className="col-12">
                                <button onClick={this.consultPaymentPlanCert} className="btn btn-primary btn-block"
                                        disabled={!this.hasInvoices() || this.state.fiscal_number.length < 5 ||
                                        this.state.fiscal_number !== this.state.last_fiscal_number ||
                                        this.state.loading}>
                                  Descargar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

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
  ;

  render() {
    return Auth.authenticationRequired(this.element());
  }
}


const mapStateToProps = state => ({
  props: state
});

export default connect(mapStateToProps, {SetMenuManager})(Certificates);