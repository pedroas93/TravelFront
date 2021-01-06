import React, {Component} from 'react';
import HeaderPrivate from '../PrivateViews/HeaderPrivate';
import MenuList from './MenuList';
import Footer from '../PublicViews/Footer';
import Logger from "../../models/Logger";
import Auth from "../../models/Auth";
import settings from "../../settings";
import FetchResponses from "../../models/FetchResponses";
import {Messages, translateTransaction} from "../../models/Messages";
import Error from "../PublicViews/Error";
import BarLoader from 'react-spinners/BarLoader';
import Pagination from "react-js-pagination";
// redux
import {connect} from 'react-redux';
import {SetMenuManager} from "../PrivateViews/Menu_Actions";
import TransactionCollapse from "../PrivateViews/TransactionCollapse";

class Transactions extends Component {
  constructor(props) {
    super(props);

    let now = new Date();
    let options = {year: 'numeric', month: '2-digit', day: '2-digit'};
    let date = now.toLocaleDateString('es-CO', options).replace('/', '-').replace('/', '-');
    date = `${date.substring(6, 10)}-${date.substring(3, 5)}-${date.substring(0, 2)}`;
    this.state = {
      loading: false,
      transactions: [],
      open: false,
      error_message: Messages.errorTryLater,
      status: "All",
      last_url: '',
      use_filter: false,
      filter: 'user',
      filter_value: '',
      min_date: date,
      max_date: date,
      use_min_date: true,
      use_max_date: true,
      text_filters: 'Ver más filtros',
      // pagination
      transactions_show: [],
      active_page: 1,
      items_per_page: 10,
      range_pages: 5,
    };
    this.pdf_window = null;
    Logger.setLogger(this.constructor.name);
  }

  componentDidMount() {
    //Cambia el estado del menu
    this.props.SetMenuManager(["", "", "", "submit", "", ""]);
    localStorage.setItem("menu", JSON.stringify(["", "", "", "submit", "", ""]));
  }

  downloadTransactionsPDF = () => {
    this.setState({loading: true});
    let last_url = this.state.last_url;

    if (last_url.indexOf('?') > 0) {
      last_url = last_url + '&file=PDF'
    } else {
      last_url = last_url + '?file=PDF'
    }

    this.pdf_window = window.open('', '_blank');

    fetch(last_url, {
      method: "GET",
      headers: settings.headers_auth(Auth.getSessionToken()),
    })
      .then(FetchResponses.processResponse)
      .then(response => {
        if (response.url_certificate) {
          this.pdf_window.document.write(Messages.loadingDocument);
          this.pdf_window.location.href = response.url_certificate;
        } else {
          this.pdf_window.close();
          let open = true;
          let error_message = 'Aún no cuenta con transacciones.';
          this.setState({open, error_message})
        }
        this.setState({loading: false});
      })
      .catch(error => {
        Logger.error(error);
        this.pdf_window.close();
        this.setState({
          open: true,
          error_message: Messages.errorTryLater,
          loading: false,
        });
      })
  };

  consultTransactions = () => {
    let status = this.state.status;
    let url = settings.backend.list_transactions;
    let use_filter = this.state.use_filter;
    let filter = this.state.filter;
    let filter_value = this.state.filter_value;
    let min_date = this.state.min_date;
    let max_date = this.state.max_date;
    let use_min_date = this.state.use_min_date;
    let use_max_date = this.state.use_max_date;

    if (status !== "All") {
      url = `${url}?status=${status}`;
    }

    if (use_filter) {
      if (!filter_value || filter_value.length < 4) {
        let error_message = `${this.getPlaceholderFilter(filter)} para la busqueda.`;
        let open = true;
        this.setState({open, error_message});
        return
      }

      if (url.indexOf('?') > 0) {
        url = `${url}&${filter}=${filter_value}`;
      } else {
        url = `${url}?${filter}=${filter_value}`;
      }
    }

    if (use_min_date) {
      if (min_date) {
        const formated_min_date = `${min_date.substring(8, 10)}-${min_date.substring(5, 7)}-${min_date.substring(2, 4)}`;
        if (url.indexOf('?') > 0) {
          url = `${url}&min_date=${formated_min_date}`;
        } else {
          url = `${url}?min_date=${formated_min_date}`;
        }
      } else {
        this.setState({
          open: true,
          error_message: Messages.invalidDate,
          loading: false,
        });
        return
      }
    }

    if (use_max_date) {
      if (max_date) {
        const formated_max_date = `${max_date.substring(8, 10)}-${max_date.substring(5, 7)}-${max_date.substring(2, 4)}`;
        if (url.indexOf('?') > 0) {
          url = `${url}&max_date=${formated_max_date}`;
        } else {
          url = `${url}?max_date=${formated_max_date}`;
        }
      } else {
        this.setState({
          open: true,
          error_message: Messages.invalidDate,
          loading: false,
        });
        return
      }
    }

    this.setState({loading: true, last_url: url});
    fetch(url, {
      method: "GET",
      headers: settings.headers_auth(Auth.getSessionToken()),
    })
      .then(FetchResponses.processResponse)
      .then(response => {
        Logger.info(response);
        let transactions = [];
        let transactions_show = [];
        let active_page = 1;
        let items_per_page = this.state.items_per_page;
        let star_item = active_page * items_per_page - items_per_page;
        let finish_item = active_page * items_per_page;
        if (response.transactions_length > 0) {
          transactions = response.transactions;
          transactions_show = response.transactions.slice(star_item, finish_item);
        }
        this.setState({loading: false, transactions, transactions_show, active_page})
      })
      .catch(error => {
        Logger.error(error);
        this.setState({
          open: true,
          error_message: Messages.errorTryLater,
          loading: false,
        });
      })
  };

  handleChange = event => {
    if (event.target.type === 'checkbox') {
      this.setState({
        [event.target.id]: event.target.checked,
      });
    } else {
      this.setState({
        [event.target.id]: event.target.value,
      });
    }
  };

  handleClose = () => {
    this.setState({open: false});
  };

  finalContent = () => {
    if (this.state.loading) {
      return (
        <div className="alert alert-warning">
          <div className="row justify-content-center">
            <BarLoader
              sizeUnit='%'
              height={5}
              width={500}
              color='#ff0000'
              loading={this.state.loading}
            /></div>
        </div>
      );
    } else if (this.state.transactions.length > 0) {
      return this.transactions();
    } else {
      return (
        <div className="alert alert-warning">
          <div className="row justify-content-center">
            <h3>Sin resultados.</h3>
          </div>
        </div>
      );
    }
  };

  formatPaidDateTransaction = (paid_date) => {
    if (paid_date) {
      return (
        <div>{paid_date.substring(0, 10)}<br/>{paid_date.substring(11, 19)}</div>
      );
    } else {
      return '';
    }
  };

  changeTextFilters = event => {
    event.preventDefault();
    let use_filter = !this.state.use_filter;
    let text_filters = 'Ver más filtros';

    if (use_filter) {
      text_filters = 'Ver menos filtros';
    }
    this.setState({text_filters, use_filter});
  };

  handlePageChange = active_page => {
    let items_per_page = this.state.items_per_page;
    let star_item = active_page * items_per_page - items_per_page;
    let finish_item = active_page * items_per_page;
    let transactions_show = this.state.transactions.slice(star_item, finish_item);
    this.setState({active_page, transactions_show})
  };

  getPlaceholderFilter = filter => {
    let placeholders = {
      'user': 'Ingresa una cédula',
      'transaction_id': 'Ingresa un id de transacción',
      'trazability_code': 'Ingresa un código de rastreo de PSE',
    };
    return placeholders[filter]
  };

  filters = () => (
    <div className="row panel justify-content-center align-items-center text-center">

      {/* Filters by value*/}
      <div className="col-12">

        <div className="row justify-content-center align-items-center">
          <div className="col-12">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text min-width-historial">Estado</span>
              </div>
              <select className="form-control" id="status"
                      onChange={this.handleChange}
                      value={this.state.status}>
                <option value="All">Todas</option>
                <option value="Approved">Aprobadas</option>
                <option value="Fail">Fallidas / Rechazadas</option>
                <option value="Error">Error</option>
                <option value="Pending">Pendientes</option>
              </select>
            </div>
          </div>

          {/*Date Filter*/}
          <div className="col-12 col-sm-6">
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text min-width-historial text-right">
                  <input type="checkbox" aria-label="Checkbox for following text input" id="use_min_date"
                         onChange={this.handleChange} checked={this.state.use_min_date}/>&nbsp;&nbsp;
                  <label htmlFor="use_min_date">Desde</label>
                </div>
              </div>
              <input type="date" className="form-control" id="min_date" value={this.state.min_date}
                     onChange={this.handleChange} disabled={!this.state.use_min_date}/>
            </div>
          </div>

          <div className="col-12 col-sm-6">
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text min-width-historial text-right">
                  <input type="checkbox" aria-label="Checkbox for following text input" id="use_max_date"
                         onChange={this.handleChange} checked={this.state.use_max_date}/>&nbsp;&nbsp;
                  <label htmlFor="use_max_date">Hasta</label>
                </div>
              </div>
              <input type="date" className="form-control" id="max_date" value={this.state.max_date}
                     onChange={this.handleChange} disabled={!this.state.use_max_date}/>
            </div>
          </div>
        </div>

        {/*Custom Filters*/}
        <div className="row justify-content-center align-items-center">
          <div className="col-12 text-filters">
            <a href="#" onClick={this.changeTextFilters}>{this.state.text_filters}</a>
          </div>
          <div className={'input-group col-12 col-sm-6 ' + (this.state.use_filter ? "" : "hidden")}>
            <div className="input-group-prepend">
              <span className="input-group-text min-width-historial">Filtrar por</span>
            </div>
            <select className="form-control" id="filter" onChange={this.handleChange} value={this.state.filter}>
              <option value="user">Cédula</option>
              <option value="transaction_id">ID Transacción</option>
              <option value="trazability_code"># De Rastreo</option>
            </select>
          </div>

          <div className={'col-12 col-sm-6 ' + (this.state.use_filter ? "" : "hidden")}>
            <input className="form-control" id="filter_value" onChange={this.handleChange}
                   value={this.state.filter_value} placeholder={this.getPlaceholderFilter(this.state.filter)}/>
          </div>
        </div>
      </div>

      {/*Consult / Download buttons*/}
      <div className="col-12">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-6">
            <button className="btn btn-primary btn-block" onClick={this.consultTransactions}
                    disabled={this.state.loading}>
              Consultar
            </button>
          </div>
          <div className={'col-12 col-sm-6 ' + (this.state.transactions.length === 0 ? "hidden" : "")}>
            <button className="btn btn-primary btn-block" onClick={this.downloadTransactionsPDF}
                    disabled={this.state.loading || this.state.transactions.length === 0}>
              <span className="icon dripicons-download"/>
              Descargar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  transactions = () => (
    <React.Fragment>

      <div className="row">
        <div className="col-12">
          <div className="alert alert-info">
            <h5 className="d-flex justify-content-between">
              Total Transacciones: <strong>{this.state.transactions.length}</strong>
            </h5>
          </div>
        </div>
      </div>

      {/*Show collapse in mobile*/}
      <div className="d-md-none">
        {this.state.transactions_show.map((transaction) => {
          return (
            <TransactionCollapse key={transaction.transaction_id} transaction={transaction}/>
          )
        })}
      </div>

      {/*Show table in desktop*/}
      <div className="d-none d-md-block">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
            <tr>
              <th scope="col" className="text-center">Fecha de<br/>Creación</th>
              <th scope="col" className="text-center">Cédula</th>
              <th scope="col" className="text-center">ID</th>
              <th scope="col" className="text-center">Estado de<br/>Pago</th>
              <th scope="col" className="text-center">Respuesta<br/>PSE</th>
              <th scope="col" className="text-center">Factura</th>
              <th scope="col" className="text-center">Fecha de<br/>Pago</th>
              <th scope="col" className="text-center">Valor <br/>Pagado</th>
              <th scope="col" className="text-center">Número de<br/>Rastreo</th>
            </tr>
            </thead>
            <tbody>
            {this.state.transactions_show.map(transaction => {
              return (
                <tr key={transaction.transaction_id}>
                  <td className="text-center">{this.formatPaidDateTransaction(transaction.created)}</td>
                  <td className="text-center">{transaction.user.fiscal_number}</td>
                  <td className="text-center">{transaction.transaction_id}</td>
                  <td className="text-center">
                    {translateTransaction(transaction.status, transaction.response_gateway)}
                  </td>
                  <td className="text-center">{transaction.response_gateway}</td>
                  <td className="text-center">{transaction.invoices.map(invoice => {
                    return (
                      <div key={Math.random()}>{invoice.invoice}</div>
                    );
                  })}
                  </td>
                  <td className="text-center">{this.formatPaidDateTransaction(transaction.paid_date)}</td>
                  <td className="text-center">
                    $ {(transaction.total_amount).toLocaleString('de-DE', {maximumFractionDigits: 0})}
                  </td>
                  <td className="text-center">{transaction.trazability_code}</td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        hideDisabled
        activePage={this.state.active_page}
        itemsCountPerPage={this.state.items_per_page}
        totalItemsCount={this.state.transactions.length}
        pageRangeDisplayed={this.state.range_pages}
        onChange={this.handlePageChange}
        itemClass="page-item"
        linkClass="page-link"
        innerClass={`justify-content-center pagination ${this.state.transactions.length <= this.state.items_per_page ? 'hidden' : ''}`}
      />
    </React.Fragment>
  );

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
              <div className="col-lg-10 col-xl-9">
                <h1><span className="icon dripicons-card"/>Pagos</h1>
              </div>
            </div>


            <div className="row justify-content-center">
              <div className="col-lg-10 col-xl-9 panel">
                {this.filters()}
                {this.finalContent()}
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
  );

  render() {
    return Auth.authenticationRequired(this.element());
  }
}

const mapStateToProps = state => ({
  menu: state.menu.menu
});

export default connect(mapStateToProps, {SetMenuManager})(Transactions);
