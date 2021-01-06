import React from "react";
import settings from "../../settings";
import Auth from "../../models/Auth";
import FetchResponses from "../../models/FetchResponses";
import { Messages } from "../../models/Messages";
import BarLoader from 'react-spinners/BarLoader';
import { isMobile } from 'react-device-detect';

class CertificadoRenta extends React.Component {
  state = {
    name: "",
    fiscal_number: "",
    begin_date: "",
    consulted_year: "",
    invoices: [],
    loading: true,
    consulted_date: "",
  };

  componentDidMount() {
    fetch(settings.backend.rent_certificate(this.props.year), {
      method: 'GET',
      headers: settings.headers_auth(Auth.getSessionToken())
    }).then(FetchResponses.processResponse)
      .then(response => {
        if (response.url_certificate) {
          let url_pdf = response.url_certificate;
          window.location.href = url_pdf;
          setTimeout(function () {
            if (isMobile) window.close();
          }, 3000);
        } else {
          alert(Messages.errorTryLater);
          window.close();
        }
      }).catch(error => {
        alert(Messages.errorTryLater);
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

export default CertificadoRenta;
