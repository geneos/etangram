export interface Reporte{
  name: string;
  columnas: string;
  accion_crear: string;
  accion_editar: string;
  accion_borrar: string;
  accion_mostrar: string;
  accion_exportar: string;
  permiso_crear: string;
  permiso_editar: string;
  permiso_borrar: string;
  permiso_mostrar: string;
  permiso_exportar: string;
  }

export interface Atributo{
  tabla: string;
  atributo: string;
  desc_atributo: string;
  atributo_bd: string;
  orden: number;
  grupo: string;
  obligatorio: string; //1=si, 0= no
  tipo_dato: string;
  longitud: number;
  valores: string;//null
  consulta: string; //null
}
