import React from "react";
import {Redirect } from "react-router-dom";
import settings from "../settings";
import Logger from "./Logger";

//redux
import{connect} from 'react-redux';
import{SetAuth} from './Auth_Actions';

class Auth{
  
  static name_token = "session_token";
  static last_user = "last_user";
  static is_admin = "is_admin"

  static getSessionToken() {
    return localStorage.getItem(Auth.name_token);
  }

  static isAuthenticated() {
    return Auth.getSessionToken();
  }

  static isAdmin(){
    return JSON.parse(localStorage.getItem(Auth.is_admin));
  }

  static logoutUser() {
    localStorage.removeItem(Auth.is_admin)
    localStorage.removeItem(Auth.name_token);
    localStorage.clear();
  }

  static loginUser(session_token, is_admin) {
    localStorage.setItem(Auth.is_admin, is_admin)
    return localStorage.setItem(Auth.name_token, session_token);
  }

  static authenticationRequired(element) {
    if (!Auth.isAuthenticated()) {
      Logger.info("Unauthenticated user");
      return <Redirect to={settings.unauthenticated_user_page}/>;
    }
    return element;
  }

  static notAuthenticationRequired(element) {
    let redirect = element;
    if (Auth.isAuthenticated()) {
      if(Auth.isAdmin()){
        redirect = <Redirect to={settings.authenticated_admin_page}/>
      }else{
        redirect = <Redirect to={settings.authenticated_user_page}/>;
      }
      Logger.info("Authenticated user");
    }
    return redirect;
  }

  static setLastUserData(data) {
    const user = {
      fiscal_number: data.fiscal_number ? data.fiscal_number : "",
      first_name: data.first_name ? data.first_name : "",
      last_name: data.last_name ? data.last_name: "",
      email: data.email ? data.email : "",
    };
    // this.props.SetAuth(Auth.last_user);
    return localStorage.setItem(Auth.last_user, JSON.stringify(user));
  }

  static getLastUserData() {
    return localStorage.getItem(Auth.last_user);
  }

  static cleanAllData() {
    return localStorage.clear();
  }

}

const mapStateToProps = state =>({
  auth : state.Auth.Auth
})

export default connect(mapStateToProps, {SetAuth}) (Auth);
