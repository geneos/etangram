export interface Caja{
  id: string;
  name: string;
  date_entered: string;
  date_modified: string;
  modified_user_id: string;
  created_by: string;
  description: null;
  deleted: number;
  assigned_user_id: null;
  numerocuenta: string;
  tg01_referenciascontables_id_c: string;
  conciliable: number;
  cbu: string;
  tg01_sucursales_id_c: string;
  tg01_mediospago_id_c: string;
  tg01_bancos_id_c: string;
  tg01_mediospago_id1_c: string;
  tg01_monedas_id_c: string;
  //todo reviar nulos
  saldo: null; 
  currency_id: null;
  fechasaldo: null;
  tipoconciliacion: string;
  tiporegistracion: string;
  tg01_referenciascontables_id1_c: string;
  tg01_grupofinanciero_id_c: string;
  }
