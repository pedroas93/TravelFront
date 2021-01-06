import React, {Component} from "react";
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

// redux
import {connect} from 'react-redux';
import {SetMenuManager} from '../PrivateViews/Menu_Actions';

class MenuList extends Component {
  changueStateManager = () => {
    this.props.SetMenuManager(["submit", "", "", "", "", ""]);
    localStorage.setItem("menu", JSON.stringify(["submit", "", "", "", "", ""]));
  };
  changueStateCertificates = () => {
    this.props.SetMenuManager(["", "submit", "", "", "", ""]);
    localStorage.setItem("menu", JSON.stringify(["", "submit", "", "", "", ""]));
  };
  changueStateAdminUser = () => {
    this.props.SetMenuManager(["", "", "submit", "", "", ""]);
    localStorage.setItem("menu", JSON.stringify(["", "", "submit", "", "", ""]));

  };
  changueStateAdminTransactions = () => {
    this.props.SetMenuManager(["", "", "", "submit", "", ""]);
    localStorage.setItem("menu", JSON.stringify(["", "", "", "submit", "", ""]));

  };
  changueStateAdminConciliation = () => {
    this.props.SetMenuManager(["", "", "", "", "submit", ""]);
    localStorage.setItem("menu", JSON.stringify(["", "", "", "", "submit", ""]));

  };
  render() {
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
            <span className="icon dripicons-user-group"/>
            <b>Usuarios</b>
          </Link>
        </li>
        <li className={this.props.disabled ? "disabled" : "enabled"}>
          <Link className={this.props.menu[3]} onClick={this.changueStateAdminTransactions} id="transactions"
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
}

MenuList.propTypes = {
  disabled: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  menu: state.menu.menu
})


export default connect(mapStateToProps, {SetMenuManager})(MenuList);
