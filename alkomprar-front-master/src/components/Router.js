import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Landing from './PublicViews/Landing';
import Login from './PublicViews/Login';
import Registro from './PublicViews/Registro';
import RecuperarClave from './PublicViews/RecuperarClave';
import Resumen from './PrivateViews/Resumen';
import Perfil from './PrivateViews/Perfil';
import Facturas from './PrivateViews/Facturas';
import FacturasPago from './PrivateViews/FacturasPago';
import Historial from './PrivateViews/Historial';
import Puntos from './SharedViews/Puntos';
import Documentos from './PrivateViews/Documentos';
import DocumentoPDF from './PrivateViews/DocumentPDF';
import CertificadoPDF from './PrivateViews/CertificadoRenta';
import PlanDePagosPDF from './PrivateViews/PlanDePagos';
import Logger from "../models/Logger";
import Information from "./PublicViews/Information";
import FAQ from "./PublicViews/FAQ";
import Transaction from './PrivateViews/Transaction';
import Manager from './AdminViews/Manager';
import ValidateRouter from './Routers/ValidateRouter';
import Certificates from './AdminViews/Certificates';
import AdminUser from './AdminViews/AdminUser';
import Transactions from "./AdminViews/Transactions";
import Conciliation from "./AdminViews/Conciliation";
import AttentionLines from "./PublicViews/AttentionLines";
import CreditInformation from "./PublicViews/CreditInformation";
// import PrivateRouter from './Routers/PrivateRoute';
// import AdminRouter from './Routers/AdminRouter';

class Router extends Component {
  static admin_pages = ["/manager", "/certificates", "/adminuser", "/pagos", "/conciliacion"];

  constructor(props) {
    super(props);
    Logger.setLogger(this.constructor.name);
  }

  
  render() {
    return (
      <BrowserRouter>
        <Switch>
          {/*PublicViews*/}
          <Route exact path="/" component={Landing} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/registro" component={Registro} />
          <Route exact path="/recuperar-clave" component={RecuperarClave} />
          <Route exact path="/informacion" component={Information} />
          <Route exact path="/faq" component={FAQ} />
          <Route exact path="/atencion" component={AttentionLines} />
          <Route exact path="/credito" component={CreditInformation} />

          {/*PrivateViews*/}
          <ValidateRouter adminPages={Router.admin_pages} exact path="/perfil" component={Perfil} />
          <ValidateRouter adminPages={Router.admin_pages} exact path="/resumen" component={Resumen} />
          <ValidateRouter adminPages={Router.admin_pages} exact path="/facturas" component={Facturas} />
          <ValidateRouter adminPages={Router.admin_pages} exact path="/facturas-pago" component={FacturasPago} />
          <ValidateRouter adminPages={Router.admin_pages} exact path="/historial" component={Historial} />
          <ValidateRouter adminPages={Router.admin_pages} exact path="/documentos" component={Documentos} />
          <ValidateRouter adminPages={Router.admin_pages} exact path="/transaccion/:id" component={Transaction} />
          <ValidateRouter adminPages={Router.admin_pages} exact path="/documentoPDF" component={DocumentoPDF} />
          <ValidateRouter adminPages={Router.admin_pages} exact path="/certificadoPDF" component={CertificadoPDF} />
          <ValidateRouter adminPages={Router.admin_pages} exact path="/planDePagos" component={PlanDePagosPDF} />

          {/*Admin Views*/}
          <ValidateRouter adminPages={Router.admin_pages} exact path="/manager" component={Manager} />
          <ValidateRouter adminPages={Router.admin_pages} exact path="/certificates" component={Certificates} />
          <ValidateRouter adminPages={Router.admin_pages} exact path="/adminuser" component={AdminUser} />
          <ValidateRouter adminPages={Router.admin_pages} exact path="/pagos" component={Transactions} />
          <ValidateRouter adminPages={Router.admin_pages} exact path="/conciliacion" component={Conciliation} />
          {/*SharedViews*/}
          <Route exact path="/puntos" component={Puntos} />

          <Route render={() => <Redirect to="/"> </Redirect>} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;
