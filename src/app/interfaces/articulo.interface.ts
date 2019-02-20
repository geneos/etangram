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