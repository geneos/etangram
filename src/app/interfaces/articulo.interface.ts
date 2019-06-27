export interface Articulo{
  codigo:string;
  descripcion:string;
  unidad_medida:string;
  precio_unitario:number;
  cantidad:number;
  alicuota:number;
}
//api/articulo

export interface cArticulo{
  id:string;
  part_number:string;
  name:string;
  aos_product_category_id:string;
  codigo_alternativo_c:string;
  tglp_tg_marcas_id_c:string;
  estado_c:number;
}//c_articulos

export interface ProductoCategoria{
  id:string;
  name:string;
  codigo_c:string;
  orden_c:number;
  is_parent:number;
  name_padre:string;
}//c_producto_categoria

export interface Marca{
  id:string; //numerico en realidad
  name:string;
  date_entered:string;
  date_modified:string;
  modified_user_id:string;
  created_by:string;
  description:string;
  deleted:number;
  assigned_user_id:string;
  codigo_marca:number;
}//tglp_tg_marcas
/* 
export interface UnidadMedida{
  id: string;
  name: string;
  idum: number;
  esalternativa: number;
  numeradorfc: number;
  denominadorfc: number;
  factorconversion: number;
  tiporelacion: number;
  toleranciaaceptable: number;
  toleranciaaviso: number;
  numeradorfcabase: number;
  denominadorfcabase: number;
  factorconversionabase: number;
  tg01_unidadmedida_id_c: string;
  tg01_unidadmedida_id1_c: string;
}//tg01_unidadmedida */

export interface AtributoArticulo{
  id: string;
  idatributo: number;
  codigo: number;
  name: string;
}//api/tg01_atributosarticulos?codigo=0

export interface ValorAtributoArticulo{
  id: string;
  idatributo: number;
  codigo: number;
  name: string;
}//api/tg01_atributosarticulos?idatributo=1&codigo=gt[0] 

export interface Deposito{
  id: string;
  name: string;
  date_entered: string;
  date_modified: string;
  modified_user_id: string;
  created_by: string;
  description: string;
  deleted: number;
  assigned_user_id: string;
  pordefecto: number;
  depositoweb: number;
  tg01_depositos_id_c: string;
  tg01_sucursales_id_c: string;
  iddeposito: number; //ID A USAR
}//tg01_depositos

export interface DepostitoArticulo{
  id: string;
  name: string;
  date_entered: string;
  date_modified: string;
  modified_user_id: string;
  created_by: string;
  description: string;
  deleted: number;
  assigned_user_id: string;
  aos_products_id_c: string;
  tg01_depositos_id_c: string;
  stockideal: number;
  stockmaximo: number;
  stockreposicion: number;
}//api/tg08_articulosdepositos

export interface FotoArticulo{
  id: string;
  name: string;
  date_entered: string;
  date_modified: string;
  modified_user_id: string;
  created_by: string;
  description: string;
  deleted: number;
  assigned_user_id: string;
  aos_products_id_c: string;
  foto: string; //"www.i2t-sa.com/fotoJcabreraEDIT"
}//api/tg08_articulosfotos

export interface ProveedorArticulo{
  id: string;
  name: string;
  date_entered: string;
  date_modified: string;
  modified_user_id: string;
  created_by: string;
  description: string;
  deleted: number;
  assigned_user_id: string;
  codigobarra: string;
  precioultimacompra: number;
  currency_id: string;
  ultimacompra: string;
  tg01_monedas_id_c: string;
  pordefecto: number;
  aos_products_id_c: string;
  account_id_c: string;
}//api/tg08_articulosproveedores


export interface ArticuloSustituto{
  id: string;
  name: string;
  date_entered: string;
  date_modified: string;
  modified_user_id: string;
  created_by: string;
  description: string;
  deleted: number;
  assigned_user_id: string;
  aos_products_id_c: string;
  aos_products_id1_c: string;
  cantidad: number;
  tg01_unidadmedida_id_c: string;
  tg01_unidadmedida_id1_c: string;
  idsustituto: string;
  tiposustituto: string;
}//api/tg08_articulossustitutos

export interface datosArticulos{
  "id_producto": string,
  "nombre_producto": string,
  "part_number": string,
  "fecha_creacion": string,
  "fecha_modificacion": string,
  "codigo_alternativo": string
  "codigobarra": string
  "procedencia": string
  "id_marcas": string,
  "id_atributosarticulos": string
  "id_atributosarticulos_1": string
  "id_atributosarticulos_2": string
  "estado": string
  "id_categoriabloqueo": string
  "obsregistroautovta": string
  "obsregistroautocpa": string
  "obsingresocpa": string
  "obsingresovta": string
  "obsimprimevta": string
  "obsauditoriacpa": string
  "obsauditoriavta": string
  "categoriaventa": string
  "categoriacompra": string
  "categoriainventario": string
  "precioultcompra": string
  "fechaultcompra": string
  "id_monedas": string
  "cantidadoptimadecompra": string
  "precioultventa": string
  "fechaultventa": string
  "id_monedas_1": string
  "id_gruporefcontablearticulo": string
  "tipo": string,
  "id_alicuotas": string
  "id_alicuotas_1": string
  "areaAplicacionAlicuota": string
  "areaAplicacionImporteFijo": string
  "aplicaConversionUnidadPrecio": string
  "impuestoInternoFijo": string
  "gestiondespacho": string
  "gestionlote": string,
  "gestionserie": string
  "administrastock": string
  "stockideal": string
  "stockmaximo": string
  "stockreposicion": string
  "dimensiones": string
  "pesable": string
  "pesable_estandar": string
  "id_unidadmedida": string
  "id_unidadmedida_1": string
  "id_unidadmedida_2": string
  "id_unidadmedida_3": string
  "id_unidadmedida_4": string
  "id_unidadmedida_5": string
  "id_unidadmedida_6": string
  "largo": string
  "ancho": string
  "profundo": string
  "m3": string
  "categoriaproducto": string
}

export interface ArticuloHijo{
  id_tabla_relaciones: string;
  nombre: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  id_usuario_creador: string;
  id_usuario_modificador: string;
  id_usuario_asignado: string;
  descripcion: string;
  id_articulo: string;
  id_articulo_padre: string;
  cantidad: string;
}//proc/articuloRelacionadoGET