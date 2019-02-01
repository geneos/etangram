export interface datosCabecera {
    'Razon_Social': string,
    'CUIT': string,
    'Email': string,
    'Estado': string,
    'Estado_Afip': string,
    'Domicilio': any,
    'Ciudad': string,
    'Codigo_Postal': string,
    'Domicilio_envio': string,
    'Ciudad_envio': string,
    'Codigo_Postal_envio': string,
    'Telefono_Oficina': string,
    'Telefono_Movil': string
  }
  
  export interface datosImpuesto {
    "id_prov": string,
    "name_mode": string,
    "name_impu": string,
    "situacion": string,
    "nroinscripcion": string,
    "fechainscripcion": string,
    "exenciones": number,
    "exen_fechadesde": string,
    "exen_fechahasta": string
  }
  export interface datosFormularios{
    "name": string,
    "fechapresentacion": string,
    "fechavencimiento": string,
    "url": string,
    "id_prov": string
  }