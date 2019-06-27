import { Impuesto } from './impuesto.interface'

export interface ImpuestoComprobante {
  /* id: number,
  impuesto: Impuesto
  imponible: number,
  debitoF: number,
  creditoF: number,
  observaciones: string,
  editing: boolean
 */
  ID_Comprobante : string,
  Comprobante : string,
  ID_Renglon : string,
  RazonSocial_Referente : string,
  Fecha : string,
  Total : string,
  Nro_RefContable : string,
  Concepto : string,
  Nombre_RefContable : string,
  Descripcion : string,
  Impuesto : string,
  Imponible : number,
  MontoRetenido : number,
  Observaciones : string,
  editing : boolean
}