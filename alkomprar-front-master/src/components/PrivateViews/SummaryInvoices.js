import {Link} from "react-router-dom";
import React, {Component} from "react";
import Logger from "../../models/Logger";

class SummaryInvoices extends Component {

  constructor(props) {
    super(props);
    Logger.setLogger(this.constructor.name);
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="panel">
            <h4>Facturas</h4>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                <tr>
                  <th className="text-left-important" scope="col">Fecha</th>
                  <th className="text-left-important" scope="col">Factura</th>
                  <th className="text-left-important" scope="col">Cuota</th>
                </tr>
                </thead>
                <tbody>
                {this.props.invoices.map((invoice) => {
                  return (
                    <tr key={`tr-invoice${invoice.invoice}`}>
                      <td>{invoice.date}</td>
                      <td>{invoice.invoice}</td>
                      <td>$ {invoice.quota.toLocaleString('de-DE', {maximumFractionDigits: 0})}</td>
                    </tr>
                  )
                })}
                </tbody>
              </table>
            </div>
            <Link to="/facturas" className={`btn btn-primary btn-block ${this.props.loading ? "disabled" : ""}`}>
              Ver Todo
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default SummaryInvoices;
