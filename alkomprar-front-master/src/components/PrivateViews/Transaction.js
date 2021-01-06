import React, {Component} from 'react';
import Auth from "../../models/Auth";
import MenuList from "./MenuList";
import HeaderPrivate from "./HeaderPrivate";
import Footer from "../PublicViews/Footer";
import settings from "../../settings";
import FetchResponses from "../../models/FetchResponses";
import BarLoader from 'react-spinners/BarLoader';
import {Link} from 'react-router-dom';
import {translateTransaction} from "../../models/Messages";

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      transaction: {},
      NIT: '890.900.943-1',
      commerce_name: 'COLOMBIANA DE COMERCIO SA',
    }
  }

  componentDidMount() {
    fetch(settings.backend.details_transaction(this.props.match.params.id), {
      method: "GET",
      headers: settings.headers_auth(Auth.getSessionToken())
    })
      .then(FetchResponses.processResponse)
      .then(response => {
        if (response.transaction_id) {
          this.setState({
            loading: false,
            transaction: response,
          });
        } else {
          this.setState({loading: false});
        }
      })
      .catch(error => {
        this.setState({loading: false});
      });
  }

  return_option = () => {
    let transaction = this.state.transaction;
    if (transaction.status === 'Approved') {
      return (
        <div className="panel row">
          <div className="col text-left">
            <div>
              <Link to="/resumen">
                {"< IR A RESUMEN"}
              </Link>
            </div>
          </div>
          <div className="col text-right">
            <div>
              <Link to="/historial">
                {"IR A HISTORIAL DE PAGOS >"}
              </Link>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="panel row">
          <div className="col text-left">
            <div>
              <Link to="/facturas">
                {"< VOLVER A PAGAR FACTURAS"}
              </Link>
            </div>
          </div>
          <div className="col text-right">
            <div>
              <Link to="/historial">
                {"IR A HISTORIAL DE PAGOS >"}
              </Link>
            </div>
          </div>
        </div>
      );
    }
  };

  pending_message = () => {
    let transaction = this.state.transaction;
    if (transaction.status === 'Pending') {
      return (
        <div className="text-justify">
          <br/>
          En este momento su transacción con referencia <strong>{transaction.transaction_id}</strong> se encuentra
          PENDIENTE de recibir confirmación por parte de su entidad financiera, por favor espere unos minutos y vuelva a
          consultar más tarde para verificar si su pago fue
          confirmado de forma exitosa. Si desea mayor información sobre el estado actual de su operación puede
          comunicarse a a nuestra línea Medellín: (034) 604 2323 - Línea Gratuita Nacional: 018000 94 6000.' y preguntar
          por el estado de la transacción: <strong>{transaction.transaction_id}</strong>.
        </div>
      );
    }
  };

  formatPaidDateTransaction = (paid_date, with_hour = true) => {
    if (paid_date) {
      if (with_hour) {
        return (
          <div>{paid_date.substring(0, 10)}<br/>{paid_date.substring(11, 19)}</div>
        );
      } else {
        return (
          <div>{paid_date.substring(0, 10) + ' ' + paid_date.substring(11, 19)}</div>
        );
      }
    } else {
      return '';
    }
  };

  fiscal_number = transaction => {
    if (Auth.isAdmin()) {
      return (
        <tr>
          <td className="text-left focus-td align-middle">Cédula de<br/>cliente</td>
          <td className="text-center align-middle">
            {transaction.user.fiscal_number}
          </td>
        </tr>
      );
    }
  };

  pse_details = transaction => {
    if (transaction.payment_method === 'PSE') {
      return (
        <React.Fragment>
          <tr>
            <td className="text-left focus-td align-middle">Entidad<br/>bancaria</td>
            <td className="text-center align-middle">
              {transaction.extra_properties.bankname}
            </td>
          </tr>
          <tr>
            <td className="text-left focus-td align-middle">Ticket</td>
            <td className="text-center align-middle">
              {transaction.extra_properties.ticket_id}
            </td>
          </tr>
          <tr>
            <td className="text-left focus-td align-middle">Número de<br/>rastreo</td>
            <td className="text-center align-middle">{transaction.trazability_code}</td>
          </tr>
        </React.Fragment>
      );
    }
  };

  formatPaidDateTransaction = (paid_date, with_hour = true) => {
    if (paid_date) {
      if (with_hour) {
        return (
          <div>{paid_date.substring(0, 10)}<br/>{paid_date.substring(11, 19)}</div>
        );
      } else {
        return (
          <div>{paid_date.substring(0, 10) + ' ' + paid_date.substring(11, 19)}</div>
        );
      }
    } else {
      return '';
    }
  };

  table = () => {
    let transaction = this.state.transaction;
    if (this.state.loading) {
      return (
        <div className="col-12">
          <BarLoader
            sizeUnit={"%"}
            widthUnit={100}
            color='#ff0000'
          />
        </div>
      );
    } else if (transaction.transaction_id) {
      return (
        <div className="table-responsive">
          {/*Desktop*/}
          <div className="d-none d-md-block">
            <table className="table table-striped">
              <thead>
              <tr>
                <th scope="col">Fecha de<br/>creación</th>
                <th scope="col">Estado de<br/>Transacción</th>
                <th scope="col">Facturas</th>
                <th scope="col">Fecha de<br/>Pago</th>
                <th scope="col">ID</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td className="text-center">{this.formatPaidDateTransaction(transaction.created)}</td>
                <td className="text-center">
                  {translateTransaction(transaction.status, transaction.response_gateway)}
                </td>
                <td className="text-center">
                  {transaction.invoices.map(invoice => {
                    return (
                      <div>
                        {invoice.invoice}
                      </div>
                    );
                  })}
                </td>
                <td className="text-center">{this.formatPaidDateTransaction(transaction.paid_date)}</td>
                <td className="text-center">{transaction.transaction_id}</td>
              </tr>

              <tr>
                <td colSpan={6}/>
              </tr>

              <tr>
                <th scope="col">Concepto de Pago</th>
                <td colSpan={6}>Pago de obligaciones del cliente {transaction.user.fiscal_number}</td>
              </tr>

              <tr>
                <th scope="col">Ticket</th>
                <td colSpan={2} className="text-left">{`${transaction.extra_properties.ticket_id}`}</td>
                <td colSpan={4}/>
              </tr>

              <tr>
                <th scope="col">Número de rastreo</th>
                <td colSpan={2} className="text-left">{transaction.trazability_code}</td>
                <td colSpan={4}/>
              </tr>
              <tr>
                <th scope="col">Entidad Bancaria</th>
                <td colSpan={2}
                    className="text-left">{`${transaction.extra_properties.bankname}`.toUpperCase()}</td>
                <td colSpan={4}/>
              </tr>
              <tr>
                <th scope="col">Razón Social</th>
                <td colSpan={2} className="text-left">{this.state.commerce_name}</td>
                <td colSpan={4}/>
              </tr>

              <tr>
                <th scope="col">NIT</th>
                <td className="text-left">{this.state.NIT}</td>
                <td colSpan={1}/>
                <th scope="col" className="text-right">Monto de Pago</th>
                <td className="text-right">
                  <strong>
                    $ {(transaction.total_amount).toLocaleString('de-DE', {maximumFractionDigits: 0})}
                  </strong>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          {/*Mobile*/}
          <div className="d-md-none">
            <table className="table table-striped mobile-transaction-table">
              <tbody>
              <tr>
                <td className="text-left focus-td align-middle">Fecha de<br/>creación</td>
                <td className="text-center align-middle">
                  {this.formatPaidDateTransaction(transaction.created)}
                </td>
              </tr>

              {this.fiscal_number(transaction)}

              <tr>
                <td className="text-left focus-td align-middle">Transacción</td>
                <td className="text-center align-middle">{transaction.transaction_id}</td>
              </tr>
              <tr>
                <td className="text-left focus-td align-middle">Estado de<br/>pago</td>
                <td className="text-center align-middle">
                  {translateTransaction(transaction.status, transaction.response_gateway)}
                </td>
              </tr>
              <tr>
                <td className="text-left focus-td align-middle">Valor<br/>pagado</td>
                <td className="text-center align-middle">
                  $ {(transaction.total_amount).toLocaleString('de-DE', {maximumFractionDigits: 0})}
                </td>
              </tr>
              <tr>
                <td className="text-left focus-td align-middle">Fecha de<br/>pago</td>
                <td className="text-center align-middle">
                  {this.formatPaidDateTransaction(transaction.paid_date)}
                </td>
              </tr>
              <tr>
                <td className="text-left focus-td align-middle">Factura</td>
                <td className="text-center align-middle">
                  {transaction.invoices.map(invoice => {
                    return (
                      <div key={Math.random()}>{invoice.invoice}</div>
                    );
                  })}
                </td>
              </tr>

              {this.pse_details(transaction)}

              <tr>
                <td className="text-left focus-td align-middle">Razón<br/>social</td>
                <td className="text-center align-middle">COLOMBIANA DE <br/>COMERCIO SA</td>
              </tr>
              <tr>
                <td className="text-left focus-td align-middle">NIT</td>
                <td className="text-center align-middle">{this.state.NIT}</td>
              </tr>
              </tbody>
            </table>
          </div>
          {this.pending_message()}
        </div>
      );
    } else {
      return (
        <div className="col alert alert-warning">
          <div className="row justify-content-center text-center">
            <h3>No existe la transacción {this.props.match.params.id} para este usuario.</h3>
          </div>
        </div>
      );
    }
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
                <h1><span className="icon dripicons-card"/>Transacción</h1>
              </div>
            </div>

            <form>
              <div className="row justify-content-center">
                <div className="col-lg-10 col-xl-8">
                  {this.return_option()}
                  <div className="row panel align-content-center">
                    {this.table()}
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
    return (Auth.authenticationRequired(this.element()));
  }

}

export default Transaction;
