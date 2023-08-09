import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ClienteWAService } from '../login-registro/login-registro.service';
import { AlertController } from '@ionic/angular';
import { UserDataService } from '../login-registro/userDataService';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.page.html',
  styleUrls: ['./solicitudes.page.scss'],
})
export class SolicitudesPage implements OnInit {


  solicitudesList: any;
  noti: any;
  photo: string;

  constructor(
    private clienteWAService: ClienteWAService, private alertController: AlertController, 
    private userDataService: UserDataService,) {
      // this.userDataService.photo$.subscribe(photo => {
      //   this.photo = photo;
      // });
  }

  ngOnInit() {
    this.getNames();

  }

  getNames(){
    const token = localStorage.getItem('token');
    this.clienteWAService.getAssignedList(token).subscribe({
      next: (response) => {
        console.log(response);
        this.solicitudesList = response;
      },
      error: (error) => {
        this.alertController.create({
          header:'Servicios',
          message: 'Error al cargar servicios',
          buttons: ['Aceptar']
        }).then(alert=> alert.present());
      }
    });
  }


}
