export interface TipoComprobante{
    id: string;
    name: string;
    idtipocomp: string;
    tipocomp: number;//null
    tg01_tipooperacion_id_c: string;
    debitoocredito: number;
    modalidad: string;
    referente: string;
    tipoimputacion: string;
    fechacontab: number;
    tipomovmateriales: number;
    caja: number;
    vendedor: number;
    cobrador: number;
    zona: number;
    listaprecios: number;
    aplicaciones: number;
    totalesimpuestos: number;
    bienes: number;
    items: number;
    refcontables: number;
    fechabienes: number;
    ccomercial: number;
    valores: number;
    compromisos: number;
    partidas: number;
    impuestos: number;
    activo: number;
}
export interface TipoComprobanteAfip{
    tcom: string;
    descripcion: string;
    letra: string;
    descripcion_afip: string;
    codigo_afip: number;
} 

export interface TipoComprobanteCompras{
    idtipocomp: string;
    name: string;
}//c_tipocomprobante_compras