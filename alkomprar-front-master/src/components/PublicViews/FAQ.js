import React, {Component} from "react";
import Footer from "./Footer";
import HeaderPrivate from "../PrivateViews/HeaderPrivate";
import settings from "../../settings";
import FetchResponses from "../../models/FetchResponses";
import {Collapse} from "antd";
import Auth from "../../models/Auth";
import MenuList from "../PrivateViews/MenuList";
import PublicHeader from "../PublicViews/PublicHeader";
import PropTypes from 'prop-types';
// redux
import {connect} from 'react-redux';
import {SetMenuCss} from '../PrivateViews/Menu_Actions';


const Panel = Collapse.Panel;

class FAQ extends Component {


  constructor(props) {
    super(props);
    let modules = [];
    this.state = {
      modules,
      FAQ: [],
      icon: [],
      logued: Auth.isAuthenticated(),
    }
  };

  handleClick = (event) => {
    if (event.target.className === "icon dripicons-chevron-right btn btn-link") {
      this.setState({
        icon: "icon dripicons-chevron-down btn btn-link",
      })
    } else {
      this.setState({
        icon: "icon dripicons-chevron-right btn btn-link",
      })
    }
  }

  componentDidMount = () => {
    //Cambia el estado del menu
    this.props.SetMenuCss(["", "", "", "", "", ""]);
    fetch(settings.backend.list_front_modules, {
      method: 'GET',
      headers: settings.headers_super_auth
    }).then(FetchResponses.processResponse)
      .then(this.successResponse)
      .catch(error => {
      })

  }

  header = () => {
    if (this.state.logued) {
      return (
        <div className="sidebar">
          <MenuList disabled={this.state.loading}/>
        </div>
      );
    } else {
      return <PublicHeader/>;
    }
  };

  successResponse = (response) => {
    let modules = [];
    response.modules.forEach(element => {
      if (element.module_type === "FAQ") {
        modules = [...modules, element]
      }
    });

    modules.sort(function (a, b) {
      return (a.extra_properties.position - b.extra_properties.position)
    })
    this.setState({
      FAQ: modules,
      modules,
    })
  }
  element = () => (


    <div className={this.state.logued ? "container-fluid" : ""}>
      {this.header()}
      <div className="row">
        <div className="col private-wrapper">
          {this.state.logued ? <HeaderPrivate menu_list={this.state.loading}/> : null}
          <div className={this.state.logued ? "wrapper" : ""}>

            {/*Title and text*/}
            <div className="row justify-content-center">
              <div className="col-lg-10 col-xl-8">
                <h3>
                  <span className=""/>
                  PREGUNTAS FRECUENTES
                </h3>
                {this.state.modules.map(element => {

                  return <div>
                    <Collapse bordered={false} defaultActiveKey={[""]}>
                      <Panel header={element.title} key={element.name}>
                        {element.content}
                      </Panel>
                    </Collapse>
                  </div>
                })}
              </div>
            </div>
            <Footer/>
          </div>
        </div>
      </div>
    </div>
  );

  render() {
    return this.element();
  }
}

MenuList.propTypes = {
  disabled: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  menu: state.menu.menu
})

export default connect(mapStateToProps, {SetMenuCss})(FAQ);