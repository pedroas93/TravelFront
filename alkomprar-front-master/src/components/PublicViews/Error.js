import React from "react";
import "antd/dist/antd.css";
import {Modal} from "antd";
import {Link} from 'react-router-dom';


export default class Error extends React.Component {
  state = {open: false};

  render() {

    let message;
    if (this.props.error_message) {
      if (this.props.error_message.indexOf("Te informamos que tu cedula no se encuentra registrada en nuestra base de datos como cliente de crédito 20 minutos.Te recordamos que puedes adquirir un crédito en cualquiera de nuestras tiendas.") >= 0) {
        message = <p>Puedes ver el listado de tiendas <Link to="/puntos">aquí</Link></p>
      } else {
        message = <p/>;
      }
    }

    return (
      <div>
        <Modal
          // title='Alkomprar te informa:'
          visible={this.props.open}
          onOk={this.handleOk}
          onCancel={this.props.handleClose}
          onClose={this.props.handleClose}
          footer={null}
          closable={false}
          maskClosable={false}
          wrapClassName='ant-confirm ant-confirm-info'
        >

          <div className="ant-confirm-body-wrapper">
            <div className="ant-confirm-body">
              <i className="anticon anticon-info-circle"/>
              <span className="ant-confirm-title">Alkomprar te informa.</span>
              <div className="ant-confirm-content">
                {this.props.error_message}
                {message}
              </div>
            </div>
            <div className="ant-confirm-btns">
              <button type="button" className="ant-btn ant-btn-primary" onClick={this.props.handleClose}>
                <span>Continuar</span>
              </button>
            </div>
          </div>


        </Modal>
      </div>
    );
  }
}
