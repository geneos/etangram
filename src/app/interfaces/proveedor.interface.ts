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
  estado: string;
  categoria_bloqueo: string;
  tipo_comprobante: string;
}

export interface RelacionComercial{
  ID_Relacion_Comercial: string;
  CBU: string;
  Numero_Cuenta: string;
  Sucursal: string;
  Tipo_Cuenta: string;
}//proveedores_relacioncomercial_GET_SP

export interface Impuesto{
  Impuesto: number;
  ID_Modelo_impuestos: string;
  ID_Impuestos: string;
  Situacion: string;
  Fecha_inscripcion: string;
  Codigo_inscripcion: string;
  Exenciones: number;
  Fecha_Desde_Exenciones: string;
  Fecha_Hasta_Exenciones: string;
  Observaciones: string;
}//proveedores_impuesto_GET_SP

export interface Formulario{
  // ID_Form_Proveedor: string;
  ID_Formulario: string;
  ID_Formulario_nombre: string;
  Fecha_presentacion: string;
  Fecha_vencimiento: string;
  Url: string;
  Descripcion: string;
}//proveedores_formulario_GET_SP

export interface ArticuloProv{
  id_prov: string;
  // id_art: string;
  // NAME: string;
  nombre_articulo: string;
  fecha_ultima_compra: string;
  id_moneda: string;
  codigobarra: string;
  fecha_creacion: string;
  fecha_ult_modificacion: string;
  id_usuario_creador: string;
  id_usuario_modificador: string;
  id_articulo: string;
  precioultimacompra: number;
  codigo_articulo_proveedor: string;
}//proveedores_articulo_GET_SP

export interface AFIPProv{

}//proveedores_afip_GET_SP */