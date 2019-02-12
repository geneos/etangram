export interface CategoriaIVA{
  id: string;
  name: string;
  codigoafip: number;
  idcategoria: number;
}
//tg01_categoriasiva

export interface ModeloImpuesto{
  id: string;
  name: string;
  idmodeloimpuesto: number;
  categoria: number;
  referente: number;
  tg01_tipooperacion_id_c: number;
}
//tg01_modeloimpuestos

export interface Impuestos{
  id: string;
  name: string;
  idtipoimpuesto: number;
  tg01_modeloimpuestos_id_c: string;
  tiponumeracion: string;
  tg01_provincias_id_c: string;
  tg01_talonarios_id_c: string;
  tg01_tipocomprobante_id_c: string;
  codimpuestoafip: number;
  regimenimpuestoafip: number;
}
//tg01_impuestos

export interface ConstatacionCbte{
  ComprobanteConstatarResult:{
    CmpResp: {
        CbteModo: string,
        CuitEmisor: string,
        PtoVta: number,
        CbteTipo: number,
        CbteNro: string,
        CbteFch: string,
        ImpTotal: string,
        CodAutorizacion: string,
        DocTipoReceptor: string,
        DocNroReceptor: string
    },
    Resultado: string,
    Observaciones: {
        Obs:
            {
                Code: number,
                Msg: string
            }
        
    },
    FchProceso: string,
    Events: {
        Evt: 
            {
                Code: number
            }
        
    },
    Errors: {
      Err: 
          {
              Code: number,
              Msg: string
          }
      
  }
  }
}