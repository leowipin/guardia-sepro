import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.page.html',
  styleUrls: ['./solicitudes.page.scss'],
})
export class SolicitudesPage implements OnInit {
  datosRecibidos: any;
  fechaInicio: any;
  fechaFinalizacion: any;
  horaInicio: any;
  horaFinalizacion: any;
  direccionOrigen: any;
  direccionDestino: any;
  seleccion: any;
  haymetodopago=false;
  duration: number;
  formattedDuration: string;
  total: any;
  subtotal: any;
  iva: any;
  apiKey = environment.googleMapsApiKey;

  constructor() { }

  ngOnInit() {
  }

}
