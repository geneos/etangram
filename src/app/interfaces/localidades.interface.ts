export interface Localidad{
  id: string;
  cpostal: number;
  subcpostal: number;
  cpostala: number;
  idlocalidadafip: number;
  tg01_provincias_id_c: string;
  tg01_departamentos_id_c: number;
}

export interface Provincia{
  id: string;
  name: string;
  idprovincia: string;
  idprovinciaafip: number;
  tg01_paises_id_c: string;
  securitygroup_id_c: number;
}

export interface Pais{
  id: string;
  name: string;
  idpais: number;
  idpaisafip: number;
}