/* export interface PlanCuenta{
  id:string;
  nombre:string;
  cuenta_contable:string;
  nomenclador:string;
  nomenclador_padre:string;
  orden:string;
  estado:number; //0= Baja(inactivo), 1=Activo
  imputable:number; //0=no, 1=si
  patrimonial:number; //0=no, 1=si
}
 */
/*
Nombre
Cuenta Contable
Nomenclador
Nomenclador Padre
Orden
Estado

Imputable?
Patrimonial?
*/

/*
export interface PlanCuenta{
  idCuentaContable:     number;//integer
  nombreCuenta:         string; //50
  cuentacontable:       string; //25
  imputable:            number; //0=no, 1=si //integer
  cuentaresultados:     number;
  nomenclador:          string;//25
  //nomenclador_padre:  string;
  nivel:                number;
  idReferenciacontable: string; //5 
  nombreReferencia:     string; //50 
  orden:                number;

  //estado:number; //0= Baja(inactivo), 1=Activo
  //patrimonial:number; //0=no, 1=si
}
*/

export interface PlanCuenta{
  id:                 string; //36
  cuentacontable:     string;//25
  name:               string;//255
  nomenclador:        string;//25
  nomencladorpadre:   string;//25
  orden:              number;
  //description:        string; no se usa
  imputable:          string;//100, opciones: 0=no, 1=si
  patrimonial:        string;//100, opciones: 1|si
  estado:             string;//100, opciones: 1|baja
  //deleted:          number; no se usa
  assigned_user_id:   string;//36
  date_entered:       null;
  //created_by:       string;//36
  date_modified:      null;
  //modified_user_id: string;//36
}
