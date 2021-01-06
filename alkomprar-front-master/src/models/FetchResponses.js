import Logger from "./Logger";
import Auth from "./Auth";
import {Messages} from "./Messages";

class FetchResponses {
  static processResponse(response) {
    if (response.status === 401 && Auth.isAuthenticated()) {
      alert(Messages.sessionExpired);
      Auth.logoutUser();
    }
    if ((response.status >= 200 && response.status < 300) || response.status === 409) {
      const json_response = response.json();
      return Promise.resolve(json_response);
    } else {
      const json_response = response.json();
      return json_response.then(Promise.reject.bind(Promise));
    }
  }

  static succesResponse(response) {
    alert(response.detail);
    Logger.info("Request success:", JSON.stringify(response));
  }

  static errorResponse(error) {
    if (JSON.stringify(error).length > 2) {
      Logger.error("Request failed:", JSON.stringify(error));
    } else {
      Logger.error(error);
    }
  }
}

export default FetchResponses;
