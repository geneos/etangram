import { Injectable } from '@angular/core';
@Injectable()

export class ConsDinConfig {
    nombreServicio: string;
    accion: string;

    constructor(){
        this.accion = 'ver';
    }
}
