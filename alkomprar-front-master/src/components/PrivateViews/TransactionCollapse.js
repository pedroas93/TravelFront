import React, {Component} from "react";
import {translateTransaction} from "../../models/Messages";
import {Link} from "react-router-dom";
import Auth from '../../models/Auth';

class TransactionCollapse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text_collapse: 'Ver más',
      class_names: 'hidden',
      show_all: false,
      NIT: '890.900.943-1',
      icon_show: 'dripicons-chevron-down',
    };
  };

  changeTextCollapse = event => {
    let text_collapse = 'Ver más';
    if (event.target.parentElement.className !== 'collapsed') {
      text_collapse = 'Ver menos'
    }
    this.setState({text_collapse});
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

  detailsTransactions = transaction => {
    if (!Auth.isAdmin()) {
      return (
        <div className="col-12 text-filters">
          <Link to={`/transaccion/${transaction.transaction_id}`}>Ver detalles de la transacción</Link>
        </div>
      )
    }
    return null;
  };

  title = transaction => {
    if (!Auth.isAdmin()) {
      return this.formatPaidDateTransaction(transaction.created, false);
    } else {
      return `${transaction.created.substring(0, 10)} || ${transaction.user.fiscal_number}`;
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
          <tr className={`${this.state.class_names} tr-animated`}>
            <td className="text-left focus-td align-middle">Entidad<br/>bancaria</td>
            <td className="text-center align-middle">
              {transaction.extra_properties.bankname}
            </td>
          </tr>
          <tr className={`${this.state.class_names} tr-animated`}>
            <td className="text-left focus-td align-middle">Ticket</td>
            <td className="text-center align-middle">
              {transaction.extra_properties.ticket_id}
            </td>
          </tr>
          <tr className={`${this.state.class_names} tr-animated`}>
            <td className="text-left focus-td align-middle">Número de<br/>rastreo</td>
            <td className="text-center align-middle">{transaction.trazability_code}</td>
          </tr>
        </React.Fragment>
      );
    }
  };

  handleFields = event => {
    event.preventDefault();
    let show_all = !this.state.show_all;
    let class_names = 'hidden';
    let icon_show = 'dripicons-chevron-down';
    if (show_all) {
      icon_show = 'dripicons-chevron-up';
      class_names = '';
    }
    this.setState({show_all, icon_show, class_names})
  };

  render() {
    let transaction = this.props.transaction;

    return (
      <div className="panel">

        <p className="d-md-none panel-title d-flex justify-content-between">
          {this.title(transaction)}
          <u className="collapsed" data-toggle="collapse" href={`#transaction${transaction.transaction_id}`}
             role="button"
             aria-expanded="false"
             aria-controls="collapseExample"
             onClick={this.changeTextCollapse}>
            <span className="text_collapse">{this.state.text_collapse}</span>
          </u>
        </p>

        <div className="invoices-content collapse" id={`transaction${transaction.transaction_id}`}>

          {this.detailsTransactions(transaction)}

          <div className="table-responsive">
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
                <td className="text-left focus-td align-middle">Respuesta<br/>PSE</td>
                <td className="text-center align-middle">
                  {transaction.response_gateway}
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
              <tr className={`${this.state.class_names} tr-animated`}>
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

              <tr className={`${this.state.class_names} tr-animated`}>
                <td className="text-left focus-td align-middle">Razón<br/>social</td>
                <td className="text-center align-middle">COLOMBIANA DE <br/>COMERCIO SA</td>
              </tr>
              <tr className={`${this.state.class_names} tr-animated`}>
                <td className="text-left focus-td align-middle">NIT</td>
                <td className="text-center align-middle">{this.state.NIT}</td>
              </tr>
              </tbody>
            </table>
          </div>

          <div className="col">
            <div className="row justify-content-center">
              <div className="col-2">
                <button className="btn btn-circle" onClick={this.handleFields}>
                  <span className={`icon btn-circle-text ${this.state.icon_show}`}/>
                </button>
              </div>
            </div>
          </div>


        </div>
      </div>
    )
  }
}

export default TransactionCollapse;
