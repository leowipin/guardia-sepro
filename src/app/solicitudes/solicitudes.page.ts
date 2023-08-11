import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ClienteWAService } from '../login-registro/login-registro.service';
import { AlertController, NavController } from '@ionic/angular';
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
    private userDataService: UserDataService, private navCtrl: NavController) {
      // this.userDataService.photo$.subscribe(photo => {
      //   this.photo = photo;
      // });
  }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.getNames();
  }

  getNames() {
    const token = localStorage.getItem('token');
    this.clienteWAService.getAssignedList(token).subscribe({
      next: (response) => {
        console.log(response);
        //se ordena la solicitud de fecha mas reciente primero
        response.sort((a, b) => {
          const dateA = new Date(a.start_date + 'T' + a.start_time);
          const dateB = new Date(b.start_date + 'T' + b.start_time);
          return dateB.getTime() - dateA.getTime();
        });
        this.solicitudesList = response;
      },
      error: (error) => {
        this.alertController.create({
          header: 'Servicios',
          message: 'Error al cargar servicios',
          buttons: ['Aceptar']
        }).then(alert => alert.present());
      }
    });
  }
  
  goToDetail(id, status){
    let queryParams = {
      id: id,
      status: status,
    };
    this.navCtrl.navigateForward(['/tabs/inicio/detalle'], { queryParams: queryParams });
  }

}
