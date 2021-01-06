import React, {Component} from "react";
import Logger from "../../models/Logger";

class PayInvoice extends Component {
  constructor(props) {
    super(props);
    let quotas = [...this.props.invoice.quotas].sort();
    let total_pay = this.props.invoice.mora;
    let invoice = this.props.invoice.invoice;
    this.state = {
      invoice,
      quotas,
      total_pay,
      max: total_pay,
      total: 0,
      text_collapse: 'Ver más',
      checked_all: false,
    };
    Logger.setLogger(this.constructor.name)
  };

  handleChange = event => {
    this.props.addTotalDiscount(this.state.total_pay - this.props.invoice.mora);
    let quota_id = event.target.id;
    let quotas = [];
    let total = 0;

    if (quota_id === 'checked_all') {
      if (event.target.checked) {
        quotas = [...this.state.quotas].map(quota => {
          quota.selected = true;
          return quota
        });
      } else {
        quotas = [...this.state.quotas].map(quota => {
          quota.selected = false;
          return quota
        });
      }
    } else {
      if (event.target.checked) {
        quotas = [...this.state.quotas].map(quota => {
          if (quota.num_quota <= quota_id) {
            quota.selected = true
          }
          return quota
        });
      } else {
        quotas = [...this.state.quotas].map(quota => {
          if (quota.num_quota >= quota_id) {
            quota.selected = false
          }
          return quota
        });
      }
    }

    let checked_all = true;
    quotas.forEach(quota => {
      if (quota.selected) {
        total += quota.quota_value;
      } else {
        checked_all = false;
      }
    });

    this.setState({
      quotas,
      total,
      total_pay: this.props.invoice.mora + total,
      max: this.props.invoice.mora + total,
      checked_all,
    });
    this.props.addTotalQuotas(total);
    this.props.manageInvoice(this.state.invoice, total);
  };

  handleTotalPay = event => {
    let total_pay = event.target.value;
    this.props.manageInvoice(this.state.invoice, total_pay - this.props.invoice.mora);
    if (total_pay) {
      this.props.addTotalDiscount(this.state.total_pay - this.props.invoice.mora);
      this.setState({
        [event.target.id]: parseInt(event.target.value)
      });
      this.props.addTotalQuotas(total_pay - this.props.invoice.mora);
    }
  };

  changeTextCollapse = event => {
    let text_collapse = 'Ver más';
    if (event.target.parentElement.className !== 'collapsed') {
      text_collapse = 'Ver menos'
    }
    this.setState({text_collapse});
  };


  render() {
    return (
      <div className="panel">

        <div className="">

          <h2 className="d-none d-md-block">
            <u className="collapsed" data-toggle="collapse" href={`#invoice${this.props.invoice.invoice}`} role="button"
               aria-expanded="false"
               aria-controls="collapseExample"
               onClick={this.changeTextCollapse}>
              Factura <strong>{this.props.invoice.invoice}</strong>
            </u>
          </h2>

          <p className="d-md-none panel-title d-flex justify-content-between">
            Factura {this.props.invoice.invoice}
            <u className="collapsed" data-toggle="collapse" href={`#invoice${this.props.invoice.invoice}`} role="button"
               aria-expanded="false"
               aria-controls="collapseExample"
               onClick={this.changeTextCollapse}>
              <span className="text_collapse">{this.state.text_collapse}</span>
            </u>
          </p>

        </div>

        <div className="invoices-content collapse" id={`invoice${this.props.invoice.invoice}`}>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
              <tr>
                <th className="text-center" scope="col">Cuota</th>


                <th className="text-center d-none d-md-table-cell" scope="col">Fecha de <br/> vencimiento</th>
                <th className="text-center d-md-none" scope="col">Fecha</th>

                <th className="text-center d-none d-md-table-cell" scope="col">Valor Cuota</th>
                <th className="text-center d-md-none" scope="col">Valor</th>

                <th className="text-center d-none d-md-table-cell" scope="col">Días de <br/>Mora</th>
                <th className="text-center d-md-none" scope="col">Días Mora</th>

                <th className="text-center d-none d-md-table-cell" scope="col">Seleccionar <br/> para Pago</th>
                <th className="text-center d-md-none" scope="col">
                  <input type="checkbox" className="check-input" id="checked_all" checked={this.state.checked_all} onChange={this.handleChange}/>
                </th>

              </tr>
              </thead>
              <tbody>
              {this.state.quotas.map((quota) => {
                return (
                  <tr key={`${quota.num_quota}-${quota.invoice.toLocaleString('de-DE', {maximumFractionDigits: 0})}`}>
                    <td className="text-center">{quota.num_quota}</td>
                    <td className="text-center">{quota.exp_date}</td>
                    <td
                      className="text-center">$ {quota.quota_value.toLocaleString('de-DE', {maximumFractionDigits: 0})}</td>
                    <td className="text-center">{quota.date_mora}</td>
                    <td className="text-center">
                      <input type="checkbox" className="check-input" id={quota.num_quota} value={quota.quota_value}
                             checked={quota.selected}
                             onChange={this.handleChange}/>
                    </td>
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>

          <div className="align-items-center alert alert-info table-mobile">

            <div className="row">
              <div className="col-12">
                <div className="row align-items-center">
                  <div className="col-7 text-left">
                    <span>INTERESES DE MORA:</span>
                  </div>
                  <div className="col-5 text-left interest-mora">
                    <span className="padding-price">$</span>
                    <span className="padding-price">
                      {this.props.invoice.mora.toLocaleString('de-DE', {maximumFractionDigits: 0})}
                    </span>
                  </div>
                </div>

                <div className="row align-items-center">
                  <div className="col-7 text-left">
                    <strong>VALOR A PAGAR:</strong>
                  </div>
                  <div className="col-5 text-left">
                    <div className="input-group input-table no-padding">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input className="form-control" type="number" id="total_pay" value={this.state.total_pay}
                             min={this.props.invoice.mora}
                             max={this.state.max} onChange={this.handleTotalPay}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default PayInvoice;
