import React, {Component} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

class InfoModule extends Component {

  stylesImage = image_link => ({
    backgroundImage: `url(${image_link})`,
  });

  element = ({redirect_link, alt, content, image_link, new_tab}) => {
    let element = (
      <div className="col-8 col-md-6">
        <Link to={redirect_link} target={new_tab ? "_blank" : ""}>
          <div className="square" style={this.stylesImage(image_link)}/>
        </Link>
      </div>
    );
    if (redirect_link.indexOf("http") >= 0) {
      element = (
        <div className="col-8 col-sm-6">
          <a href={redirect_link} target={new_tab ? "_blank" : ""}>
            <div className="square" style={this.stylesImage(image_link)}/>
          </a>
        </div>
      );
    }
    return element;
  };

  render() {
    return this.element(this.props.module);
  }
}

InfoModule.propTypes = {
  module: PropTypes.object.isRequired,
};

export default InfoModule;
