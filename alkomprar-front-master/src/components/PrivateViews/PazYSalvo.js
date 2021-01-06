import React from "react";
import settings from "../../settings";
import Auth from "../../models/Auth";
import FetchResponses from "../../models/FetchResponses";
import { Messages } from "../../models/Messages";
import BarLoader from 'react-spinners/BarLoader';
import { isMobile } from "react-device-detect";

class PazYSalvo extends React.Component {
  state = {
    consecutive: "",
    fiscal_number: "",
    name: "",
    city: "",
    state_name: "",
    phone: "",
    firm: "",
    consulted_date: "",
    loading: true,
  };

  componentDidMount() {
    fetch(settings.backend.peace_salve_certificate, {
      method: 'GET',
      headers: settings.headers_auth(Auth.getSessionToken()),
    }).then(FetchResponses.processResponse)
      .then(response => {
        if (response.url_certificate) {
          let url_pdf = response.url_certificate;
          window.location.href = url_pdf;
          if (isMobile) window.close();
          setTimeout(function () {
            if (isMobile) window.close();
          }, 3000);
        } else {
          alert(Messages.userWithBalanceInWallet);
          window.close();
        }
      }).catch(error => {
        alert(Messages.userWithBalanceInWallet);
        window.close();
      })
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="row justify-content-center">
          <BarLoader
            sizeUnit='%'
            height={5}
            width={500}
            color='#ff0000'
            loading={this.state.loading}
          />
        </div>
      );
    }
  }
}

export default PazYSalvo;
