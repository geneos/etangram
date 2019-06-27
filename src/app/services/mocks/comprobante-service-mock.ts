import { Impuesto } from '../../interfaces/impuesto.interface';
import { ImpuestoComprobante } from '../../interfaces/impuesto-comprobante.interface';

export const mockComprobantes = [
  {
    ID_Comprobante: "znn5OK6V8gX9fRoODxEgSUl1fwGg8OE8Gn4N",
    Comprobante: "OP -16220",
    Fecha: "2018-07-03",
    RazonSocial_Referente: "QUART PRODUCCIONES SRL                       ",
    CUIT: "30710434863",
    Total: "51909.00",
    Estado_CAI: "No declarado",
    Estado_Documentacion: "No declarado",
    Estado_Impositivo: "0",
    Estado_Contable: "0",
    Estado_Presupuestario: "0"
  },
  {
    ID_Comprobante: "ZLZJ0ttaMm7tOHC81w4C7rP6LUKS10xKuva9",
    Comprobante: "OP -16290",
    Fecha: "2018-07-03",
    RazonSocial_Referente: "L Y M PRODUCCIONES SRL                       ",
    CUIT: "33709470359",
    Total: "36602.50",
    Estado_CAI: "No declarado",
    Estado_Documentacion: "No declarado",
    Estado_Impositivo: "0",
    Estado_Contable: "0",
    Estado_Presupuestario: "0"
  },
  {
    ID_Comprobante: "zKCcxjKbhXNg0eZcJ6sVUhSoHdPf3lVAOO1I",
    Comprobante: "MIN -57098",
    Fecha: "2018-07-03",
    RazonSocial_Referente: "CAS - Caja de Asistencia Social",
    CUIT: "",
    Total: "414152.09",
    Estado_CAI: "No declarado",
    Estado_Documentacion: "No declarado",
    Estado_Impositivo: "0",
    Estado_Contable: "0",
    Estado_Presupuestario: "0"
  },
  {
    ID_Comprobante: "Y7aGHF8aSqgrRnKwVxZQiwX0HJ6rgKQAKQ9s",
    Comprobante: "OP -16291",
    Fecha: "2018-07-03",
    RazonSocial_Referente: "OLMEDO MARIA JOSE                            ",
    CUIT: "27287157350",
    Total: "4692.84",
    Estado_CAI: "No declarado",
    Estado_Documentacion: "No declarado",
    Estado_Impositivo: "0",
    Estado_Contable: "0",
    Estado_Presupuestario: "0"
  },
  {
    ID_Comprobante: "wiRs12yTND0yhT7wt0fyWkWOOASHXYf8LvH9",
    Comprobante: "OP -16289",
    Fecha: "2018-07-03",
    RazonSocial_Referente: "GRANDE MARIA HERMINIA                        ",
    CUIT: "27132245407",
    Total: "6181.65",
    Estado_CAI: "No declarado",
    Estado_Documentacion: "No declarado",
    Estado_Impositivo: "0",
    Estado_Contable: "0",
    Estado_Presupuestario: "0"
  },
  {
    ID_Comprobante: "w05lNB9b3LbLpfqoiDs2imjRZXXkaYF2lkr6",
    Comprobante: "OP -16296",
    Fecha: "2018-07-03",
    RazonSocial_Referente: "TELECOM ARGENTINA SA                         ",
    CUIT: "30639453738",
    Total: "8275.43",
    Estado_CAI: "No declarado",
    Estado_Documentacion: "No declarado",
    Estado_Impositivo: "0",
    Estado_Contable: "0",
    Estado_Presupuestario: "0"
  },
  {
    ID_Comprobante: "v3xhBkUZgvghLMXLAlMHNAah50rZQK1CJl5w",
    Comprobante: "OP -16226",
    Fecha: "2018-07-03",
    RazonSocial_Referente: "QUART PRODUCCIONES SRL                       ",
    CUIT: "30710434863",
    Total: "26571.60",
    Estado_CAI: "No declarado",
    Estado_Documentacion: "No declarado",
    Estado_Impositivo: "0",
    Estado_Contable: "0",
    Estado_Presupuestario: "0"
  },
  {
    ID_Comprobante: "updJewfd7LOcVncmtdWPV09judVpqAf0CS4Y",
    Comprobante: "OP -16285",
    Fecha: "2018-07-03",
    RazonSocial_Referente: "BARBICH PEDRO ISIDRO                         ",
    CUIT: "20215568319",
    Total: "14055.00",
    Estado_CAI: "No declarado",
    Estado_Documentacion: "No declarado",
    Estado_Impositivo: "0",
    Estado_Contable: "0",
    Estado_Presupuestario: "0"
  },
  {
    ID_Comprobante: "t8j530cgXvSVxeCGmijS1AaKBfT9YaN02t2G",
    Comprobante: "OP -16299",
    Fecha: "2018-07-03",
    RazonSocial_Referente: "VIA G SA                                     ",
    CUIT: "30674816592",
    Total: "11243.93",
    Estado_CAI: "No declarado",
    Estado_Documentacion: "No declarado",
    Estado_Impositivo: "0",
    Estado_Contable: "0",
    Estado_Presupuestario: "0"
  },
  {
    ID_Comprobante: "T6fd5eqPt3vb0sSf5cN1cXrrfcAZYGgBLhiB",
    Comprobante: "OP -16286",
    Fecha: "2018-07-03",
    RazonSocial_Referente: "COMARIN COMUNICACIONES Y MARKE               ",
    CUIT: "30708493046",
    Total: "18646.10",
    Estado_CAI: "No declarado",
    Estado_Documentacion: "No declarado",
    Estado_Impositivo: "0",
    Estado_Contable: "0",
    Estado_Presupuestario: "0"
  }
]

export let mockImpuestosComprobante : any = [
  {
    ID_Comprobante: "ee30514f-7728-11e9-a11c-d050990fe081",
    Comprobante: "MIN X-X0000-00000562",
    ID_Renglon: "9504b0cc-7e2d-11e9-8845-d050990fe081",
    RazonSocial_Referente: "i2T",
    Fecha: "2019-05-15",
    Total: "1822193.03",
    Nro_RefContable: "",
    Concepto: "INGRESOS BRUTOS - 4,5%",
    Nombre_RefContable: "",
    Descripcion: "Ingresos Brutos",
    Impuesto: " Ingresos Brutos",
    Imponible: 111.11,
    MontoRetenido: 111.11,
    Observaciones: "jcabrera"
  },
  {
    ID_Comprobante: "ee30514f-7728-11e9-a11c-d050990fe081",
    Comprobante: "MIN X-X0000-00000562",
    ID_Renglon: "1952cb8f-7bd8-11e9-921a-d050990fe081",
    RazonSocial_Referente: "i2T",
    Fecha: "2019-05-15",
    Total: "1822193.03",
    Nro_RefContable: "1",
    Concepto: "SELLOS-CONT",
    Nombre_RefContable: "testing final deux editado 2",
    Descripcion: "Ganancias",
    Impuesto: " Ganancias",
    Imponible: 111.11,
    MontoRetenido: 111.11,
    Observaciones: "jcabrera"
  },
  {
    ID_Comprobante: "ee30514f-7728-11e9-a11c-d050990fe081",
    Comprobante: "MIN X-X0000-00000562",
    ID_Renglon: "3027b8ff-7e3a-11e9-8845-d050990fe081",
    RazonSocial_Referente: "i2T",
    Fecha: "2019-05-15",
    Total: "1822193.03",
    Nro_RefContable: "",
    Concepto: "INGRESOS BRUTOS - 2,76%",
    Nombre_RefContable: "",
    Descripcion: "Tasa Servicios",
    Impuesto: " Tasa Servicios",
    Imponible: 111.11,
    MontoRetenido: 120,
    Observaciones: "jcabrera"
  },
  {
    ID_Comprobante: "ee30514f-7728-11e9-a11c-d050990fe081",
    Comprobante: "MIN X-X0000-00000562",
    ID_Renglon: "960fc17f-7bd8-11e9-921a-d050990fe081",
    RazonSocial_Referente: "i2T",
    Fecha: "2019-05-15",
    Total: "1822193.03",
    Nro_RefContable: "26",
    Concepto: "INGRESOS BRUTOS - 2,76%",
    Nombre_RefContable: "IVA",
    Descripcion: "Tasa Servicios",
    Impuesto: " Tasa Servicios",
    Imponible: 1822193.03,
    MontoRetenido: 120,
    Observaciones: "estoesunaobservacion2"
  }
];

export let mockModeloImpuestos : any = [
  {
    id: "1",
    name: "Sellos",
    idmodeloimpuesto: 1,
    categoria: "R",
    referente: "P",
    tg01_tipooperacion_id_c: "98718385-ea41-080f-8bfb-5adfa4fd2764"
  },
  {
    id: "2",
    name: "Ingresos Brutos",
    idmodeloimpuesto: 2,
    categoria: "R",
    referente: "P",
    tg01_tipooperacion_id_c: "98718385-ea41-080f-8bfb-5adfa4fd2764"
  },
  {
    id: "3",
    name: "Ganancias",
    idmodeloimpuesto: 3,
    categoria: "R",
    referente: "P",
    tg01_tipooperacion_id_c: "98718385-ea41-080f-8bfb-5adfa4fd2764"
  },
  {
    id: "4",
    name: "Tasa Servicios",
    idmodeloimpuesto: 4,
    categoria: "R",
    referente: "P",
    tg01_tipooperacion_id_c: "98718385-ea41-080f-8bfb-5adfa4fd2764"
  }
];

export let mockConfigImpuesto : any = [
  {
      ID_ModeloImpuesto: "1",
      Nombre_ModeloImpuesto: "Sellos",
      ID_Impuesto: "1002",
      Nombre_Impuesto: "SELLOS - BANCO",
      ID_ImpuestoIBIG: "1002",
      Nombre_ImpuestoIBIG: "impuestoibig2",
      fechavigencia: "2000-05-14",
      alicuotainsc: 2,
      alicuotanoinsc: 10,
      importeminimo: 142400,
      retencionminima: 150,
      porctotal: 0,
      porcmercex: 100,
      porcmercgrav: 100,
      tg01_referenciascontables_id_c: "1",
      idregimen: 78,
      aplicaescala: 0,
      tienerefcontasociada: 0,
      tg01_alicuotas_id_c: "9f213b47-4102-adf8-dcde-5bc65af883ad",
      aplicara: "M"
  },
  {
      ID_ModeloImpuesto: "1",
      Nombre_ModeloImpuesto: "Sellos",
      ID_Impuesto: "1001",
      Nombre_Impuesto: "SELLOS",
      ID_ImpuestoIBIG: "1001",
      Nombre_ImpuestoIBIG: "impuestoibig1",
      fechavigencia: "2019-05-24",
      alicuotainsc: 2,
      alicuotanoinsc: 15,
      importeminimo: 150000,
      retencionminima: 150,
      porctotal: 0,
      porcmercex: 100,
      porcmercgrav: 100,
      tg01_referenciascontables_id_c: "026",
      idregimen: 78,
      aplicaescala: 0,
      tienerefcontasociada: 0,
      tg01_alicuotas_id_c: "9f213b47-4102-adf8-dcde-5bc65af883ad",
      aplicara: "M"
  }
];

export let mockImpuestos : Impuesto[] = [
  {id: 1, cuenta: 1234, descripcion: "Impuesto 1", impuesto: "impuesto 1"},
  {id: 2, cuenta: 1235, descripcion: "Impuesto 2", impuesto: "impuesto 2"},
  {id: 3, cuenta: 1236, descripcion: "Impuesto 3", impuesto: "impuesto 3"},
  {id: 4, cuenta: 1237, descripcion: "Impuesto 4", impuesto: "impuesto 4"},
  {id: 5, cuenta: 1238, descripcion: "Impuesto 5", impuesto: "impuesto 5"},
  {id: 6, cuenta: 1239, descripcion: "Impuesto 6", impuesto: "impuesto 6"},
];

export let mockLineasContables : any = [
  {
    ID_Comprobante: "znn5OK6V8gX9fRoODxEgSUl1fwGg8OE8Gn4N",
    ID_Renglon: "wJLO0yN67erfxk30ybcSr0MJohBtPCOqOnoM",
    Comprobante: "OP -10952",
    RazonSocial_Referente: "MAC ROUILLON PUBLICIDAD S.R.L.               ",
    Subdiario: "16 - SUBDIARIO DE PRESUPUESTO",
    Fecha: "2018-01-22",
    Total: "25671.36",
    Nro_RefContable: "",
    Nombre_RefContable: "PUBLIC.Y O/GASTOS A PAGAR",
    TieneCtoCosto: "0",
    Nombre_CtoCosto: "",
    debe: "25671.36",
    haber: "0.00"
  },
  {
    ID_Comprobante: "znn5OK6V8gX9fRoODxEgSUl1fwGg8OE8Gn4N",
    ID_Renglon: "S1gxoQy06gptcvzXCKe5b4ZCkoX3grUQrkbP",
    Comprobante: "OP -10952",
    RazonSocial_Referente: "MAC ROUILLON PUBLICIDAD S.R.L.               ",
    Subdiario: "16 - SUBDIARIO DE PRESUPUESTO",
    Fecha: "2018-01-22",
    Total: "25671.36",
    Nro_RefContable: "1021",
    Nombre_RefContable: "BANCO SANTA FE S.A.",
    TieneCtoCosto: 0,
    Nombre_CtoCosto: "",
    debe: "0.00",
    haber: "24049.18"
  },
  {
    ID_Comprobante: "znn5OK6V8gX9fRoODxEgSUl1fwGg8OE8Gn4N",
    ID_Renglon: "LuthR5Kr4UTGEp06Oh4ZqalrlLg1HIEkCIQU",
    Comprobante: "OP -10952",
    RazonSocial_Referente: "MAC ROUILLON PUBLICIDAD S.R.L.               ",
    Subdiario: "16 - SUBDIARIO DE PRESUPUESTO",
    Fecha: "2018-01-22",
    Total: "25671.36",
    Nro_RefContable: "",
    Nombre_RefContable: "API IMP.DE SELLOS PROVEED",
    TieneCtoCosto: "0",
    Nombre_CtoCosto: "",
    debe: "0.00",
    haber: "154.03"
  },
  {
    ID_Comprobante: "znn5OK6V8gX9fRoODxEgSUl1fwGg8OE8Gn4N",
    ID_Renglon: "3Ip3r3tHNxG823JaILoUyRTYqWx5ZZv1RdDJ",
    Comprobante: "OP -10952",
    RazonSocial_Referente: "MAC ROUILLON PUBLICIDAD S.R.L.               ",
    Subdiario: "16 - SUBDIARIO DE PRESUPUESTO",
    Fecha: "2018-01-22",
    Total: "25671.36",
    Nro_RefContable: "",
    Nombre_RefContable: "DGI IMP.A LAS GCIAS.PROV.",
    TieneCtoCosto: "0",
    Nombre_CtoCosto: "",
    debe: "0.00",
    haber: "513.43"
  },
  {
    ID_Comprobante: "znn5OK6V8gX9fRoODxEgSUl1fwGg8OE8Gn4N",
    ID_Renglon: "r8pTGUS4zmWCEYxuRds3Qcb4QbnTqgjrClaQ",
    Comprobante: "OP -10952",
    RazonSocial_Referente: "MAC ROUILLON PUBLICIDAD S.R.L.               ",
    Subdiario: "16 - SUBDIARIO DE PRESUPUESTO",
    Fecha: "2018-01-22",
    Total: "25671.36",
    Nro_RefContable: "",
    Nombre_RefContable: "API IMP I. BRUTOS PROVEE.",
    TieneCtoCosto: "0",
    Nombre_CtoCosto: "",
    debe: "0.00",
    haber: "954.72"
  }
];

export let mockCentrosDeCostos : any[] = [
  {
      id: "0",
      name: "Sin Centro de Costos          ",
      deleted: 0,
      idcentrocosto: 0,
      idcentrocostocontabilidad: "0",
      estado: "0"
  },
  {
      id: "111",
      name: "jcabrera123",
      deleted: 0,
      idcentrocosto: 111,
      idcentrocostocontabilidad: "15",
      estado: "0"
  },
  {
      id: "15",
      name: "Prueba pancho",
      deleted: 1,
      idcentrocosto: 15,
      idcentrocostocontabilidad: "0",
      estado: "0"
  },
  {
      id: "654",
      name: "jcabrera123",
      deleted: 1,
      idcentrocosto: 112,
      idcentrocostocontabilidad: "16",
      estado: "0"
  }
]
