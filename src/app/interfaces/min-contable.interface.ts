export interface MinContable{
  assigned_user_id: number;
  created_by: string;
  date_entered: string;
  date_modified: string;
  deleted: number;
  //description: null
  estado: number;
  id: string;
  /*
  idgrupofinanciero: number;
  idreferenciacontable: string;
  modified_user_id: string;
  */
  name: string;
  /*
  numero: number;
  tg01_centrocosto_id_c: string;
  tg01_grupofinanciero_id_c: string;
  tg01_cuentascontables_id_c:string;
  tienectocosto: number;
  */
  tg01_monedas_id2_c: string;
  account_id1_c: string;
  tg01_tipocomprobante_id_c: string;
  fecha: string;
  tg01_cajas_id_c: string;
}