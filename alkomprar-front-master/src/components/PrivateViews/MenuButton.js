import React, {Component} from "react";

class MenuButton extends Component {
  render() {
    return (
      <button className="mobileMenuButton"
              onMouseDown={this.props.handleMouseDown}>
        <span className="icon dripicons-menu"/>
      </button>
    );
  }
}

export default MenuButton;
