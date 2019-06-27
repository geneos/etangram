export interface Remesas {
    id: string,
    name: string,
    date_entered: string,
    date_modified: string,
    modified_user_id: string,
    created_by: string,
    description: string,
    deleted: number,
    assigned_user_id: string,
    fecha: string,
    estado: string,
    numero: number,
    pago_previsto: number,
    pago_restante: number
}
export interface RemesaComprobantes {
    ID_Comprobante: string,
    Proveedor: string,
    Categoria_Proveedor: string,
    Criticidad_Proveedor: string,
    Comprobante: string
    Criticidad_Comprobante: string,
    Fecha_Vencimiento: string,
    Total: number,
    Saldo: string
}

export interface RemesaComprobantesImputar {
    Razon_Social: string,
    Categoria_Proveedor: string,
    Criticidad_Proveedor: string,
    Comprobante: string
    Fecha_Comprobante: string
    Criticidad_Comprobante: string,
    Fecha_Vencimiento: string,
    Monto_Total: number,
    Saldo: string
}