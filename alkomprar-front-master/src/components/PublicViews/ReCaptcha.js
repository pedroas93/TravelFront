import React, {Component} from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import settings from "../../settings";
import Logger from "../../models/Logger";

class ReCaptcha extends Component {

  render() {
    return (
      <div className="ReCaptcha justify-content-center">
        <ReCAPTCHA sitekey={settings.recaptcha.site_key} 
                   ref={this.props.recaptchaRef}
                   onChange={this.props.reCaptchaOnChange}
                   hidden={this.props.hidden}/>
      </div>
    )
  }
}

export default ReCaptcha;
