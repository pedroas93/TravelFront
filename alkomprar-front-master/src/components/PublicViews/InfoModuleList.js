import React, {Component} from "react";
import PropTypes from "prop-types";
import InfoModule from "./InfoModule";

class InfoModuleList extends Component {

  render() {
    return (
      <div className="row justify-content-center">
        <div className="col-11 -col-lg-10 col-xl-8">
          <div className="row justify-content-center">
            {this.props.modules.map(module => {
              return (
                <InfoModule key={module.title} module={module}/>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

InfoModuleList.propTypes = {
  modules: PropTypes.array.isRequired,
};

export default InfoModuleList;
