import React, { Component } from 'react';
import HeaderPrivate from './HeaderPrivate';
import MenuList from './MenuList';
import Footer from '../PublicViews/Footer';
import Logger from "../../models/Logger";
import Auth from "../../models/Auth";
import PayInvoice from './PayInvoice';
import settings from "../../settings";
import FetchResponses from "../../models/FetchResponses";
import Error from '../PublicViews/Error';
import { Messages, translateDetails, translatePSEResponse } from "../../models/Messages";
import pse_button from '../../images/pse_button.png';
import BarLoader from 'react-spinners/BarLoader';
// redux
import { connect } from 'react-redux';
import { SetMenuCss } from './Menu_Actions';

class Facturas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoices: [],
      total_mora: 0,
      total_quotas: 0,
      total_discount: 0,
      loading: true,
      person_type: "N",
      banks: [],
      bank_code: 0,
      show: false,
      invoices_to_pay: [],
      sales_person: '',
    };
    Logger.setLogger(this.constructor.name);
  }

  componentDidMount() {
    //Cambia el estado del menu
    this.props.SetMenuCss(["", "", "submit", "", "", ""]);
    localStorage.setItem("menu", JSON.stringify(["", "", "submit", "", "", ""]));

    this.setState({
      loading: true,
    });

    fetch(settings.backend.invoices, {
      method: "GET",
      headers: settings.headers_auth(Auth.getSessionToken())
    })
      .then(FetchResponses.processResponse)
      .then(this.successDataResponse)
      .catch(this.failureDataResponse);

    fetch(settings.backend.banks, {
      method: "GET",
      headers: settings.headers_auth(Auth.getSessionToken())
    })
      .then(FetchResponses.processResponse)
      .then(response => {
        if (!response.error) {
          let banks = response.banks;
          this.setState({ banks });
        }
      })
      .catch(FetchResponses.errorResponse);
  }

  successDataResponse = response => {
    if (response.detail) {
      let translate = translateDetails(response.detail);
      this.setState({
        open: true,
        error_message: translate,
        loading: false,
      })
    }
    if (response.total_invoices) {
      let sales_person = response.sales_person;
      let invoices = [...response.invoices].map(invoice => {
        let quotas = []
        quotas = [...invoice.quotas].map(quota => {
          return Object.assign(quota, { selected: false })
        });
        invoice.quotas = quotas.sort((a, b) => a.num_quota - b.num_quota);
        return invoice;
      });
      let total_mora = 0;
      invoices.forEach(function (valor) {
        total_mora += valor.mora;
      });
      this.manageMoraInterest(total_mora);
      let invoices_to_pay = [];
      invoices.forEach(invoice => {
        let invoice_to_pay = {
          invoice: invoice.invoice,
          interests_mora: invoice.mora,
          amount_without_mora: 0,
        };
        invoices_to_pay.push(invoice_to_pay)
      });
      this.setState({
        invoices,
        invoices_to_pay,
        sales_person,
        loading: false,
      });
    } else {
      this.setState({
        loading: false,
      })
    }
  };

  manageInvoice = (invoice_num, amount_without_mora) => {
    amount_without_mora = (amount_without_mora < 0) ? 0 : amount_without_mora;
    let invoices_to_pay = [...this.state.invoices_to_pay].map(invoice => {
      if (invoice.invoice === invoice_num) {
        invoice.amount_without_mora = parseInt(amount_without_mora);
      }
      return invoice;
    });
    this.setState({ invoices_to_pay });
  };

  failureDataResponse = response => {
    let translate = translateDetails(response.detail);
    this.setState({
      open: true,
      error_message: translate,
      loading: false,
    })
  };

  handleChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.id]: event.target.value,
    })
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  manageMoraInterest = mora => {
    this.setState({
      total_mora: parseInt(mora),
    });
  };

  addTotalQuotas = value => {
    this.setState({
      total_quotas: this.state.total_quotas + value
    });
  };

  addTotalDiscount = value => {
    this.setState({
      total_discount: this.state.total_discount - value
    });
  };

  payInvoices = event => {
    event.preventDefault();
    this.setState({ loading: true });
    let bankname = '';
    this.state.banks.forEach(bank => {
      if (bank.code === this.state.bank_code) {
        bankname = bank.name;
      }
    });
    let invoices = this.state.invoices_to_pay,
      total_amount = (this.state.total_quotas + this.state.total_discount) + this.state.total_mora,
      sales_person = this.state.sales_person,
      payment_method = "PSE",
      extra_properties = {
        bankcode: this.state.bank_code,
        bankname: bankname,
        sales_person: sales_person,
      };

    let data = {
      invoices,
      total_amount,
      payment_method,
      extra_properties,
    };
    if (total_amount > 0) {

      fetch(settings.backend.pay_invoices, {
        method: "POST",
        headers: settings.headers_auth(Auth.getSessionToken()),
        body: JSON.stringify(data),
      }).then(FetchResponses.processResponse)
        .then(response => {
          if (response.payment_method === "PSE" && response.status !== "Fail") {
            window.location.replace(response.extra_properties.bank_url);
          } else if (response.payment_method === "PSE" && response.status === "Fail") {
            this.setState({
              loading: false,
              open: true,
              error_message: translatePSEResponse(response.response_gateway),
            });
          } else {
            this.setState({
              loading: false,
              open: true,
              error_message: translatePSEResponse(Messages.errorTryLater),
            });
          }
        })
        .catch(error => {
          this.setState({
            loading: false,
            open: true,
            error_message: Messages.errorInPay,
          });
        });
    } else {
      this.setState({
        loading: false,
        open: true,
        error_message: 'Por favor seleccione una cuota para pagar',
      });
    }
  };

  has_invoices = () => {
    if (this.state.loading) {
      return (
        <BarLoader
          sizeUnit='%'
          height={5}
          width={500}
          color='#ff0000'
          loading={this.state.loading}
        />
      );
    } else if (this.state.invoices.length > 0) {
      return (
        <React.Fragment>
          <div className="col-12 text-center d-none d-md-block">
            <div>
              <h3>Pago de Facturas</h3>
            </div>
            <div>
              <h3>
                Total a Pagar:
                <strong> $ {((this.state.total_quotas + this.state.total_discount) + this.state.total_mora).toLocaleString('de-DE', { maximumFractionDigits: 0 })} </strong>
                con Débito Bancario PSE.
              </h3>
            </div>
          </div>
          <div className="col-12 d-md-none">
            <div className="text-left">
              <p><strong>Pago de Facturas</strong></p>
            </div>
            <div className="d-flex justify-content-between">
              <span>Total a Pagar:</span>
              <strong> $ {((this.state.total_quotas + this.state.total_discount) + this.state.total_mora).toLocaleString('de-DE', { maximumFractionDigits: 0 })} </strong>
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <h3>No cuenta con cuotas pendientes de pago.</h3>
      );
    }
  };

  can_pay = () => {
    if (this.state.invoices.length > 0) {
      return (
        <React.Fragment>
          <div className="d-none d-md-block">
            <div className="row justify-content-center">
              <img src={pse_button} alt="PSE" className="img-responsive center-block" />
            </div>
          </div>

          <div className="d-block d-md-none">
            <div className="row align-items-center mobile-pse-logo">
              <img src={pse_button} alt="PSE" className="img-responsive center-block" />
              <h3>Débito bancario PSE</h3>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="person_type">Tipo de Persona</label>
                <select className="form-control" id="person_type" value={this.state.person_type}
                  onChange={this.handleChange} required>
                  <option value="N">NATURAL</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="bank_code">Banco</label>
                <select className="form-control" id="bank_code" required onChange={this.handleChange}>
                  {this.state.banks.map(bank => {
                    return <option value={bank.code} key={bank.name}>{bank.name.toUpperCase()}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="col-md-6 align-self-center">
              <button type="submit" className="btn btn-primary btn-block"
                disabled={this.state.loading || parseInt(this.state.bank_code) === 0}>
                Pagar PSE
              </button>
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return null;
    }
  };

  element = () => (
    <div className="container-fluid">
      <div className="sidebar">
        <MenuList disabled={this.state.loading} />
      </div>
      <div className="row">
        <div className="col private-wrapper">
          <HeaderPrivate menu_list={this.state.loading} />

          <div className="wrapper">
            <div className="row justify-content-center">
              <div className="col-lg-10 col-xl-8">
                <h1><span className="icon dripicons-article" />Facturas</h1>
                <h3>
                  <small>Puedes pagar varias facturas al mismo tiempo.</small>
                </h3>
                <p className="d-none d-md-block">
                  Haciendo click en los numeros de las facturas, puedes ocultar o ver el detalle de las cuotas.
                  Selecciona las casillas de las cuotas que deseas pagar de tus facturas.
                </p>

                <p className="d-block d-md-none">
                  Haciendo click en ‘Ver más’ puedes ver el detalle de las cuotas. Selecciona las casillas de las cuotas
                  que deseas pagar de tus facturas.
                </p>

                <p>
                  Adicional recuerda que las cuotas que están sin vencer no incluyen los intereses de financiación pactados en el plan de pagos.
                </p>
              </div>
            </div>

            {/* Facturas */}
            <form onSubmit={this.payInvoices}>
              <div className="row justify-content-center">
                <div className="col-lg-10 col-xl-8 panel">

                  <div className="">
                    {this.state.invoices.map((invoice) => {
                      return (
                        <PayInvoice key={invoice.invoice} invoice={invoice} addTotalQuotas={this.addTotalQuotas}
                          addTotalDiscount={this.addTotalDiscount} manageInvoice={this.manageInvoice} />
                      )
                    })}
                    <div className="alert alert-warning">
                      <div className="row justify-content-center">
                        {this.has_invoices()}
                      </div>
                    </div>
                    {this.can_pay()}
                  </div>
                </div>
              </div>
            </form>
          </div>
          <Footer />
        </div>
      </div>
      <Error
        open={this.state.open}
        error_message={this.state.error_message}
        handleClose={this.handleClose}
      />
    </div>
  );

  render() {
    return Auth.authenticationRequired(this.element());
  }
}

const mapStateToProps = state => ({
  menu: state.menu.menu
});

export default connect(mapStateToProps, { SetMenuCss })(Facturas);
