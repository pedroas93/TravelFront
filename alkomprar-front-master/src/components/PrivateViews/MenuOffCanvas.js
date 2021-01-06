import React, {Component} from "react";
import MenuList from "./MenuList";
import PropTypes from "prop-types";

class MenuOffCanvas extends Component {
  render() {
    let visibility = "hide";

    if (this.props.menuVisibility) {
      visibility = "show";
    }

    return (
      <div id="offCanvasMenu"
           onClick={this.props.handleMouseDown}
           className={visibility}>
        <div className="icon dripicons-cross text-right closeicon"/>
        <MenuList disabled={this.props.menu_list}/>
      </div>
    );
  }
}

MenuOffCanvas.propTypes = {
  menuVisibility: PropTypes.bool.isRequired,
  handleMouseDown: PropTypes.func.isRequired,
  menu_list: PropTypes.bool.isRequired,
};

export default MenuOffCanvas;
