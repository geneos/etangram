export interface Proveedor{
  id: string;
  codigo: number;
  name: string;
  cuit: number;
  nombre_fantasia: string;
  calle: string;
  ciudad: number;
  provincia: number;
  cpostal: string;
  pais: number;
  id_categoria: string;
  desc_categoria: string;
  estado: string;
  desc_estado: string;
  id_localidad: number;
  desc_localidad: string;
  id_provincia: number;
  desc_provincia: string;
  id_civa: number;
  civa: string;
}

export interface ProveedorCabecera{
  nombre: string;
  descripcion: string;
  fecha_creacion: string;
  direccion_compra: string;
  ciudad_compra: string;
  provincia_compra: string;
  codigopostal_compra: string;
  pais_compra: string;
  direccion_envio: string;
  ciudad_envio: string;
  provincia_envio: string;
  codigopostal_envio: string;
  pais_envio: string;
  telefono: string;
  telefono_alternativo: string;
  fax: string;
  codigo_prov: string;
  tiporeferente: string;
  nombre_fantasia: string;
  tipo_documento: string;
  nro_documento: string;
  email: string;
  categoriareferente: string;
  id_zona: string;
  id_vendedor: string;
  id_cobrador: string;
  limitecredito: string;
  listaprecios: string;
  condicion_comercial: string;
  partidas_presupuestarias: string;
  referencias_contables: string;
  categoria_iva: string;
  cuit: string;
  cai: string;
  fecha_vto_cai: string;
  cuit_exterior: string;
  idimpositivo: string;
}

export interface RelacionComercial{
  ID_Relacion_Comercial: string;
  CBU: string;
  Numero_Cuenta: string;
  Sucursal: string;
}//proveedores_relacioncomercial_GET_SP