export interface CompraArticulo{
  tipoRenglon:string;
  renglonId:string;
  codigo:string;
  descripcion:string;
  unidad_medida:string;
  precio_unitario:number;
  cantidad:number;
  descuento:number;
  alicuota:number;
}

export interface CompraProveedor{
  codigo:string;
  razon_social:string;
  cuit:string;
  condicion_iva:string;
}
