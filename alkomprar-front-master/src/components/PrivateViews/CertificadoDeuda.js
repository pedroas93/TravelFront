import React from "react";
import settings from "../../settings";
import Auth from "../../models/Auth";
import FetchResponses from "../../models/FetchResponses";
import { Messages } from "../../models/Messages";
import BarLoader from "react-spinners/BarLoader";
import { isMobile } from "react-device-detect";

class CertificadoDeuda extends React.Component {
  state = {
    name: "",
    fiscal_number: "",
    begin_date: "",
    min_expire_date: "",
    positive_balance: "",
    total_payment: "",
    msg_have_mora: "",
    consulted_date: "",
    invoices: [],
    loading: true
  };

  componentWillMount() {
    fetch(settings.backend.debt_certificate, {
      method: "GET",
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
          alert(Messages.userWithoutOpenInvoices);
          window.close();
        }
      }).catch(error => {
        alert(Messages.userWithoutOpenInvoices);
        window.close();
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="row justify-content-center">
          <BarLoader
            sizeUnit="%"
            height={5}
            width={500}
            color="#ff0000"
            loading={this.state.loading}
          />
        </div>
      );
    }
  }
}

export default CertificadoDeuda;
