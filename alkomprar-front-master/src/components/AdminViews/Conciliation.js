import React, {Component} from 'react';
import HeaderPrivate from '../PrivateViews/HeaderPrivate';
import MenuList from './MenuList';
import Footer from '../PublicViews/Footer';
import Logger from "../../models/Logger";
import Auth from "../../models/Auth";
import settings from "../../settings";
import {Messages} from "../../models/Messages";
import Error from "../PublicViews/Error";
// redux
import {connect} from 'react-redux';
import {SetMenuManager} from "../PrivateViews/Menu_Actions";

class Conciliation extends Component {
  getAvailableMonths = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  constructor(props) {
    super(props);
    const now = new Date();
    let day = now.getDate();
    let month = now.getMonth();
    let year = now.getFullYear();
    let available_days = this.getAvailableDays(month, year);
    let available_months = this.getAvailableMonths;
    let available_years = this.getAvailableYears(year);

    this.state = {
      loading: false,
      open: false,
      error_message: Messages.errorTryLater,
      day,
      month,
      year,
      available_days,
      available_months,
      available_years,
    };
    Logger.setLogger(this.constructor.name);
  }

  bisiesto = year => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  getMaxDays = (month, year) => {
    const max_days = {
      0: 31,
      1: this.bisiesto(year) ? 29 : 28,
      2: 31,
      3: 30,
      4: 31,
      5: 30,
      6: 31,
      7: 31,
      8: 30,
      9: 31,
      10: 30,
      11: 31,
    };
    return max_days[month]
  };

  getAvailableDays = (month, year) => {
    let available_days = [];
    let max_days = this.getMaxDays(month, year);
    for (let i = 1; i <= max_days; i++) {
      available_days.push(i);
    }
    return available_days;
  };

  getAvailableYears = (current_year) => {
    let available_years = [];
    for (let i = 2017; i <= current_year + 10; i++) {
      available_years.push(i);
    }
    return available_years;
  };

  componentDidMount() {
    //Cambia el estado del menu
    this.props.SetMenuManager(["", "", "", "", "submit", ""]);
    localStorage.setItem("menu", JSON.stringify(["", "", "", "", "submit", ""]));
  }

  downloadTransactionsCSV = () => {
    const day = parseInt(this.state.day);
    const month = parseInt(this.state.month);
    const year = parseInt(this.state.year);
    let url = settings.backend.conciliation_file;

    let report_date = new Date(year, month, day);
    let options = {year: '2-digit', month: '2-digit', day: '2-digit'};
    const formated_date = report_date.toLocaleDateString(undefined, options).replace('/', '-').replace('/', '-');

    url = `${url}?min_date=${formated_date}&max_date=${formated_date}`;

    fetch(url, {
      method: "GET",
      headers: settings.headers_auth(Auth.getSessionToken()),
    })
      .then(response => {
        if (response.status === 401 && Auth.isAuthenticated()) {
          alert(Messages.sessionExpired);
          Auth.logoutUser();
        }
        if (response.status >= 200 && response.status < 300) {
          // const json_response = response.json();
          return Promise.resolve(response.text());
        } else {
          // const json_response = response.json();
          return response.then(Promise.reject.bind(Promise));
        }
      })
      .then(response => {
        if (response) {
          let csv = 'data:text/csv;charset=utf-8,' + response;
          let contenido = encodeURI(csv);
          let link = document.createElement('a');
          link.setAttribute('href', contenido);
          link.setAttribute('download', 'report.csv');
          link.click()
        }
        this.setState({
          loading: false,
        });
      })
      .catch(error => {
        this.setState({
          open: true,
          error_message: Messages.errorTryLater,
          loading: false,
        });
      })
  }
  ;

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
    }, () => {
      this.updateDays();
    });
  };

  updateDays = () => {
    let month = this.state.month;
    let year = this.state.year;
    let available_days = this.getAvailableDays(month, year);
    let day = (this.state.day < available_days[available_days.length - 1]) ? this.state.day : available_days[available_days.length - 1];
    this.setState({available_days, day});
  };

  handleClose = () => {
    this.setState({open: false});
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
                  <div className="col-lg-10">
                    <h1><span className="icon dripicons-graph-line"/>Conciliación</h1>
                  </div>
                </div>


                <div className="row justify-content-center">
                  <div className="col-lg-12">
                    <div className="panel">

                      <div className="col-12">
                        <div className="alert alert-info">
                          <span className="icon dripicons-information"/>
                          Proporcione una fecha correcta para generar el archivo de conciliación
                        </div>
                      </div>

                      <div className="row justify-content-center">
                        <div className="col-12 col-sm-12 col-md-5 col-lg-4">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text min-width-historial">Día</span>
                            </div>
                            <select className="form-control" id="day"
                                    onChange={this.handleChange}
                                    value={this.state.day}>
                              {this.state.available_days.map(day => {
                                return <option value={day} key={day}>{day}</option>
                              })}
                            </select>
                          </div>
                        </div>

                        <div className="col-12 col-sm-12 col-md-5 col-lg-4">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text min-width-historial">Mes</span>
                            </div>
                            <select className="form-control" id="month"
                                    onChange={this.handleChange}
                                    value={this.state.month}>
                              {this.state.available_months.map((month, position) => {
                                return <option value={position} key={month}>{month}</option>
                              })}
                            </select>
                          </div>
                        </div>

                        <div className="col-12 col-sm-12 col-md-5 col-lg-4">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text min-width-historial">Año</span>
                            </div>
                            <select className="form-control" id="year"
                                    onChange={this.handleChange}
                                    value={this.state.year}>
                              {this.state.available_years.map((year) => {
                                return <option value={year} key={year}>{year}</option>
                              })}
                            </select>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="row justify-content-center">
                            <button className="btn btn-primary" onClick={this.downloadTransactionsCSV}
                                    disabled={this.loading}>
                              <span className="icon dripicons-download">Descargar Archivo</span>
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
  menu: state.menu.menu
})

export default connect(mapStateToProps, {SetMenuManager})(Conciliation);
