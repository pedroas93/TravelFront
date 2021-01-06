import React, {Component} from "react";
import {Link} from "react-router-dom";
import MenuButton from "./MenuButton";
import MenuOffCanvas from "./MenuOffCanvas";
import Auth from "../../models/Auth";
import settings from "../../settings";
import FetchResponses from "../../models/FetchResponses";
import PropTypes from "prop-types";
import AlkomprarLogo from "../../images/logo-alkomprar-header.png";
// import LogoCredito from '../../images/logo-cred20min.png';
// redux
import {connect} from 'react-redux';

class HeaderPrivate extends Component {
  constructor(props, context) {
    super(props, context);
    let name_avatar = this.get_avatar_name();

    if (name_avatar !== '') {

      this.state = {
        visible: false,
        name_avatar,
      };

    } else {

      this.state = {
        name_avatar: this.props.name_avatar,
        visible: false,
        cont: 1
      };
    }
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  get_avatar_name = () => {
    let last_user = JSON.parse(Auth.getLastUserData());
    return last_user ? (last_user.first_name.charAt(0) + last_user.last_name.charAt(0)).toUpperCase() : "";
  };


  shouldComponentUpdate = (next_props, next_state) => {
    if (this.props.perfil.name_avatar) {

      let nameAva = (next_props.perfil.first_name.charAt(0) + next_props.perfil.last_name.charAt(0)).toUpperCase();
      if (this.state.cont === 1) {
        this.setState({
          name_avatar: nameAva,
          cont: 2,
        });
      }
    }
    return true;
  }

  handleMouseDown(e) {
    this.toggleMenu();
    e.stopPropagation();
  }

  toggleMenu() {
    this.setState({
      visible: !this.state.visible
    });
  }

  logoutUser = () => {
    fetch(settings.backend.logout, {
      method: "POST",
      headers: settings.headers_auth(Auth.getSessionToken())
    })
      .then(FetchResponses.processResponse)
      .then(Auth.logoutUser)
      .catch(Auth.logoutUser);
  };

  profileLink = () => {
    if (!Auth.isAdmin()) {
      return <Link to="/perfil" className="dropdown-item">Perfil</Link>;
    }
    return null;
  };

  render() {
    return (
      <div>
        <MenuOffCanvas handleMouseDown={this.handleMouseDown} menuVisibility={this.state.visible}
                       menu_list={this.props.menu_list}/>
        <nav className="navbar fixed-top">
          <MenuButton handleMouseDown={this.handleMouseDown}/>
          <Link to="/resumen">
            <img alt="AlkomprarLogo" src={AlkomprarLogo} className="img-responsive alkomprar-logo"/>
          </Link>
          <ul className="d-flex align-items-center">
            {/*<img alt="logoCredito20Min" src={LogoCredito} className="img-responsive logoCredito20Min"/>*/}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-toggle="dropdown"
                 aria-haspopup="true"
                 aria-expanded="false">
                <span className="nameAvatar">{this.state.name_avatar}</span>
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">

                {this.profileLink()}

                <a href="/" className="dropdown-item" onClick={this.logoutUser}>Cerrar Sesión</a>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

HeaderPrivate.propTypes = {
  menu_list: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  perfil: state.perfil.perfilInformation
})

export default connect(mapStateToProps,)(HeaderPrivate);
