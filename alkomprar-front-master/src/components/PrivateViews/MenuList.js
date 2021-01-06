import React, {Component} from "react";
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Auth from "../../models/Auth";


// redux
import {connect} from 'react-redux';
import {SetMenuCss} from './Menu_Actions';

class MenuList extends Component {

  render() {
    if (Auth.isAdmin()) {
      return (
        <ul className="submenu">
          <li className={this.props.disabled ? "disabled" : "enabled"}>
            <Link className={this.props.menu[0]} onClick={this.changueStateManager} id="manager" to="/manager">
              <span className="icon dripicons-toggles"/>
              <b>Manager</b>
            </Link>
          </li>
          <li className={this.props.disabled ? "disabled" : "enabled"}>
            <Link className={this.props.menu[1]} onClick={this.changueStateCertificates} id="certificates"
                  to="/certificates">
              <span className="icon dripicons-copy"/>
              <b>Certificados</b>
            </Link>
          </li>
          <li className={this.props.disabled ? "disabled" : "enabled"}>
            <Link className={this.props.menu[2]} onClick={this.changueStateAdminUser} id="AdminUser" to="/adminuser">
              <span className="icon dripicons-user"/>
              <b>Usuarios</b>
            </Link>
          </li>
          <li className={this.props.disabled ? "disabled" : "enabled"}>
            <Link className={this.props.menu[3]} onClick={this.changueStateAdminTransactions} id="/pagos"
                  to="/pagos">
              <span className="icon dripicons-card"/>
              <b>Pagos</b>
            </Link>
          </li>
          <li className={this.props.disabled ? "disabled" : "enabled"}>
            <Link className={this.props.menu[4]} onClick={this.changueStateAdminConciliation} id="transactions"
                  to="/conciliacion">
              <span className="icon dripicons-graph-line"/>
              <b>Conciliacion</b>
            </Link>
          </li>
        </ul>
      );
    }
    return (
      <ul className="submenu">
        <li className={this.props.disabled ? "disabled" : "enabled"}>
          <Link className={this.props.menu[0]} id="resumen" to="/resumen">
            <span className="icon dripicons-copy"/>
            <b>Resumen</b>
          </Link>
        </li>
        <li className={this.props.disabled ? "disabled" : "enabled"}>
          <Link className={this.props.menu[2]} to="/facturas">
            <span className="icon dripicons-article"/>
            <b>Pagar Facturas</b>
          </Link>
        </li>
        <li className={this.props.disabled ? "disabled" : "enabled"}>
          <Link className={this.props.menu[3]} to="/historial">
            <span className="icon dripicons-card"/>
            <b>Historial de Pagos</b>
          </Link>
        </li>
        <li className={this.props.disabled ? "disabled" : "enabled"}>
          <Link className={this.props.menu[4]} to="/puntos">
            <span className="icon dripicons-location"/>
            <b>Puntos de venta</b>
          </Link>
        </li>
        <li className={this.props.disabled ? "disabled" : "enabled"}>
          <Link className={this.props.menu[5]} to="/documentos">
            <span className="icon dripicons-blog"/>
            <b>Documentos certificados</b>
          </Link>
        </li>
        <li className={this.props.disabled ? "disabled" : "enabled"}>
          <Link className={this.props.menu[1]} to="/perfil">
            <span className="icon dripicons-user"/>
            <b>Perfil</b>
          </Link>
        </li>
      </ul>
    );
  }
}

MenuList.propTypes = {
  disabled: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  menu: state.menu.menu
})


export default connect(mapStateToProps, {SetMenuCss})(MenuList);
