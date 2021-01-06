import React from 'react';
import Page from './Page';
const PlanDePagosPDF = ({id}) => (<Page id={id}>

  <div className="row">
    <div className="col-lg-6">
    <div className ="logoAlkomprarPayment_Plan"></div>
    </div>
  </div>
  <div className ="Payment_Plan">
         <p><strong>Fecha de Consulta:</strong> 28/11/2018 10:53 a.m.</p>
         <p><strong>Cliente:</strong> OSCAR EVELIO ROMERO SUAZA</p>
         <p><strong>N° Documento:</strong> 10000058</p>

  </div>
  <div>
      <p className="mt4">
        <strong>Estimado Cliente</strong>
        </p>
      <p>A continuación presentamos el plan de pagos:</p>
      <p className="Red_Certificate_Renta"><strong>FACTURA N 38210010092311</strong></p>
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="panel">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                <tr>
                  <th scope="col">Cuota No</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Valor</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Dias Mora</th>
                  <th scope="col">Pendiente por Aplicar</th>
                  <th scope="col">Saldo</th>
                </tr>
                </thead>
              {/* DATOS DE PRUEBA */}
                {/* <tbody>
                  <td className="text-center">1</td>
                  <td className="text-center">2</td>
                  <td className="text-center">3</td>
                  <td className="text-center">4</td>
                </tbody> */}
              </table>
            </div>
          </div>
        </div>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <p >Es muy grato contarlo dentro de nuestro selecto grupo de clientes. A continuación, le informamos las políticas generales de la compañía:</p>
      <p className = "idea_Certificate_Renta">-Los intereses moratorios se cobrarán a la tasa máxima legal vigente.</p>
      <p className = "idea_Certificate_Renta">-El plan de pago de pagos puede presentar variaciones como consecuencia del pago anticipado o vencido de las cuotas o por una disminución de la tasa de interés.</p>
      <p className = "idea_Certificate_Renta">-En caso de realizarse pagos por valores mayores al de las cuotas fijadas en el plan de pagos, tales sumas se aplicarán
      inicialmente a la cuota correspondiente y el restante se abonará a capital, en ningún momento se aplicarán como adelanto
      de cuotas. Lo anterior no exime al consumidor de seguir cumpliendo el plan de pago acordado ±salvo que se haya pagado
      la totalidad del crédito.</p>
      <p className = 'paragraph_Certificate_Renta'>Si sus obligaciones con la compañía se encuentran en mora lo invitamos a actualizar sus pagos, si tiene alguna inquietud sobre
      sus saldos, favor comunicarse a la línea 6042323 Medellin, - Línea Nacional 018000 946000- opción 2, lunes a sábado de 8 am a
      7 pm con el Departamento de Cartera de Alkomprar.</p>

  </div>

</Page>);

export default PlanDePagosPDF;
