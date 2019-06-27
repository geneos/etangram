export interface Comprobante {
  /*id :number,
  identificador: string,
  fecha :string,
  referente :string,
  total :number,
  estado_cai :string,
  estado_doc :string, 
  autorizacion :string, 
  contabilidad :string,
  imputacion :string*/

  ID_Comprobante : string,
  Comprobante : string,
  Fecha : string,
  RazonSocial_Referente : string,
  CUIT : string,
  Total : number,
  Estado_CAI : string,
  Estado_Documentacion : string,
  Estado_Impositivo : number,
  Estado_Contable : number,
  Estado_Presupuestario : number
}