export interface PlanCuenta{
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