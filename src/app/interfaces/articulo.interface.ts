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