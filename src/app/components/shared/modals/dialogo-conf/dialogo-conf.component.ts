import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-dialogo-conf',
  templateUrl: './dialogo-conf.component.html',
  styleUrls: ['./dialogo-conf.component.css']
})
export class DialogoConfComponent implements OnInit {
  titulo : string;
  mensaje : string;
  @Output() salida = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<DialogoConfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.titulo = this.data.titulo;
    this.mensaje = this.data.mensaje;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
