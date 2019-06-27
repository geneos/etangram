export interface PlanCuenta{
  id:                 string; //36
  name:               string;//255
  cuentacontable:     string;//25
  nomenclador:        string;//25
  nomencladorpadre:   string;//25
  orden:              number;
  description:        string; //no se usa
  imputable:          string;//100, opciones: 0=no, 1=si
  patrimonial:        string;//100, opciones: 1|si
  estado:             string;//100, opciones: 1|baja
  deleted:            number; 
  assigned_user_id:   string;//36
  date_entered:       null;
  created_by:         string;//36
  date_modified:      null;
  modified_user_id:   string;//36
}