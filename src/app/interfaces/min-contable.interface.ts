export interface MinContable{
  assigned_user_id: number;
  created_by: string;
  date_entered: string;
  date_modified: string;
  deleted: number;
  description: string;
  estado: number;
  id: string;
  name: string;
  tipooperacion: string;
  impmxdtotal: number;
  nombre_fantasia_c: string;
  account_id_c: string;
  fecha: string;
  /*
  numero: number;
  tg01_centrocosto_id_c: string;
  tg01_grupofinanciero_id_c: string;
  tg01_cuentascontables_id_c:string;
  tienectocosto: number;
  // tg01_monedas_id2_c: string;
  // tg01_tipocomprobante_id_c: string;
  // tg01_cajas_id_c: string;
  */
}

export interface MinContableDet{
  assigned_user_id: number;
  created_by: string;
  date_entered: string;
  date_modified: string;
  deleted: number;
  estado: number;

  id: string;
  name: string;
  description: string;
  fecha: string;
  tipooperacion: string;
  impmxdtotal: number;
  account_id_c: number;
  nombre_fantasia_c: string;
  impmxdneto: number;
  cantidad: number;
  precio: number;
  tiporenglon: string;
  /*
  numero: number;
  tg01_centrocosto_id_c: string;
  tg01_grupofinanciero_id_c: string;
  tg01_cuentascontables_id_c:string;
  tienectocosto: number;
  */
  // tg01_monedas_id2_c: string;
  account_id1_c: string;
  // tg01_tipocomprobante_id_c: string;
  // tg01_cajas_id_c: string;
}