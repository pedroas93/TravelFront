import React, {Component} from "react";
import {Link} from "react-router-dom";
import AlkomprarLogo from "../../images/logo-alkomprar-header.png";
// import LogoCredito from "../../images/logo-cred20min.png";

class HeaderLogo extends Component {
  render() {
    return (
      <div className="HeaderPublic d-flex align-items-center">
        <Link to="/resumen">
          <img alt="AlkomprarLogo" src={AlkomprarLogo} className="img-responsive alkomprar-logo"/>
        </Link>
        {/*<img alt="logoCredito20Min" src={LogoCredito} className="img-responsive logoCredito20Min"/>*/}
      </div>
    );
  }
}

export default HeaderLogo;
