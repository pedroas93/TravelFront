import React from 'react';
import 'antd/dist/antd.css';

import {Modal} from 'antd';


export default class TerminosCondiciones extends React.Component {
  state = {open_TC: false};


  render() {

    return (
      <div>
        <Modal
          style={{top: 20}}
          title="Aviso de Privacidad"
          visible={this.props.open_TC}
          onOk={this.handleOk_TC}
          onCancel={this.props.handleClose_TC}
          onClose={this.props.handleClose_TC}
          footer={null}
          width={760}
        >
          <p align="justify">Con esta suscripción, obrando por mi propia cuenta y nombre, autorizo en forma previa,
            expresa e informada, en mi calidad de Titular de los datos personales que comunico a Colombiana de Comercio
            S.A. (en adelante, “La Compañía”), identificada con NIT. 890.900.943-1, así como a todas sus Unidades de
            Negocio enunciadas en su Política de Privacidad, para que en los términos de la Ley 1581 de 2012 y la demás
            normatividad vigente en materia de Habeas Data, trate mis datos personales con las siguientes finalidades:
            (i) cumplir con las obligaciones derivadas de las relaciones contractuales, legales y comerciales que se
            establecen con el titular del dato; (ii) cumplir con las obligaciones de garantía y servicio posventa
            respecto de los productos adquiridos cuando esto proceda; (iii) comunicar información publicitaria, ofertas,
            listas de precios y campañas comerciales, entre otra información relativa a los productos y servicios que
            ofrece, intermedia o comercializa La Compañía, directa o indirectamente, al igual que terceros respecto de
            los cuales La Compañía tenga una relación contractual y/o comercial vigente para dichos fines; (iv) evaluar
            preferencias, experiencias sobre productos y hábitos de consumo, al igual que realizar análisis de datos
            para el apoyo a la actividad comercial de La Compañía; (v) consultar, reportar y tratar datos personales en
            centrales de riesgo en el marco de la relación financiera, crediticia y comercial entre las partes; (vi)
            gestionar el proceso de crédito y cobranza en los casos en que esto proceda; (vii) entregar información a
            fabricantes y/o importadores sobre los productos adquiridos para realizar análisis de calidad de producto y
            evaluar preferencias de los consumidores, con el fin de apoyar el impulso de los productos adquiridos;
            (viii) realizar labores de fidelización de clientes; (ix) invitar a eventos, capacitaciones y otras
            actividades para fortalecer la relación con los compradores de los productos; (x) realizar acciones de
            inteligencia de negocios, prospectiva de clientes y tendencias de mercado.</p>
          <p align="justify">Los datos personales serán gestionados de forma segura y algunos tratamientos podrán ser
            realizados de manera directa o a través de encargados, quienes podrán estar domiciliados dentro o fuera del
            territorio Colombiano, en Europa y en países tales como los Estados Unidos, entre otros. El tratamiento de
            los datos personales por parte de La Compañía se realizará dando cumplimiento a la Política de Privacidad y
            Protección de Datos personales, la cual puede ser consultada en www.alkomprar.com y a lo dispuesto en la ley
            1581 de 2012. Se presume que la información personal suministrada es veraz y ha sido entregada por el
            titular de esta y/o su representante o persona autorizada.</p>
          <p align="justify">El titular de los datos personales tiene derecho a (i) Conocer, actualizar y rectificar sus
            datos sobre información parcial, inexacta, incompleta, fraccionada o que induzca al error; (ii) Solicitar
            prueba de esta autorización; (iii) Ser informado(a) sobre el Tratamiento dado a sus datos; (iv) Presentar
            quejas a la Superintendencia de Industria y Comercio por infracciones frente a la normatividad vigente en
            materia de protección de datos personales; (v) Revocar la autorización y solicitar la supresión de los datos
            suministrados en los términos de la Ley 1581 de 2012; (vi) Acceder gratuitamente a los datos objeto de
            Tratamiento. Estos derechos podrán ser ejercidos a través de los siguientes canales dispuestos por La
            Compañía: (i) Calle 11 N° 31 A – 42, Bogotá; (ii) datos.personales@corbeta.com.co.</p>
          <p align="justify">Asimismo, declaro que en caso tal de encontrarme suministrando información de un tercero,
            he obtenido de manera previa su consentimiento para la comunicación de sus datos personales a La Compañía,
            para los propósitos de confirmación de referencias personales y comerciales, así como para su contacto para
            las finalidades arriba mencionadas.</p>
        </Modal>
      </div>
    );
  }

}