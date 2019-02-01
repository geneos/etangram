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
  id: string,
  codigo: number,
  name:string,
  cuit: string,
  nombre_fantasia: string,
  calle: string,
  ciudad: string,
  provincia: string,
  cpostal: string,
  pais: string,
  id_categoria: string,
  desc_categoria:string,
  estado: string,
  desc_estado: string,
  id_localidad: string,
  desc_localidad: string,
  id_provincia: string,
  desc_provincia: string,
  id_civa: string,
  civa: string
}
/*
export interface CompraProveedor{
  codigo:string;
  razon_social:string;
  cuit:string;
  condicion_iva:string;
}*/

