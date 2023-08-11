import { Component, OnInit } from '@angular/core';
import { ClienteWAService } from '../login-registro/login-registro.service';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { TrackServicioComponent } from '../track-servicio/track-servicio.component';
import { UbicacionComponent } from 'src/app/ubicacion/ubicacion.component';
import { environment } from 'src/environments/environment';

declare var google: any;

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  apiKey = environment.googleMapsApiKey;

  orderId:any;
  orderData:any;
  photo:string;
  leaderData:any;
  formattedDuration:string;
  total:any;
  subtotal:any;
  iva:any;
  status:any;
  requires_origin_and_destination:boolean = true;
  origen = {
    lat: -2.1676746,
    lng: -79.8956897
  };
  destino = {
    lat: -2.1676746,
    lng: -79.8956897
  };

  constructor(private clienteWAService: ClienteWAService, private route: ActivatedRoute, 
    private modalController: ModalController, private alertController: AlertController, private navCtrl: NavController) { }

  ngOnInit() {
    this.orderId = this.route.snapshot.queryParamMap.get('id');
    this.status = this.route.snapshot.queryParamMap.get('status');
    this.getDetail();
    this.getEmployeeData();
  }

  getDetail(){
    const token = localStorage.getItem('token');
    this.clienteWAService.getOrderDetail(token, this.orderId).subscribe({
      next: (response) => {
        if(response.destination_lat==null){
          this.requires_origin_and_destination = false;
        }
        this.orderData = response;
        this.formattingDuration();
        this.total = parseFloat(response.total)
        let iva:any = this.total / 1.12 * 0.12;
        let subtotal:any = (this.total - iva).toFixed(2);
        iva = (this.total - subtotal).toFixed(2);
        this.iva = iva
        this.subtotal = subtotal
        console.log(this.orderData);
        this.origen.lat = this.orderData.origin_lat
        this.origen.lng = this.orderData.origin_lng
        this.destino.lat = this.orderData.destination_lat
        this.destino.lng = this.orderData.destination_lng
        console.log(this.origen.lat)
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getEmployeeData(){
    const token = localStorage.getItem('token');
    this.clienteWAService.getLeaderStaff(token, this.orderId).subscribe({
      next: (response) => {
        this.leaderData = response
        if(response.url_img == null){
          this.photo = 'assets/img/backcliente.png';
        } else{
          this.photo = response.url_img
        }
      },error: (error) => {
      }
    });
  }

async startOrder() {
  const alert = await this.alertController.create({
    header: 'Iniciar servicio',
    message: '¿Estás seguro de iniciar el servicio?',
    buttons: [
      {
        text: 'No',
        role: 'cancel'
      },
      {
        text: 'Sí',
        handler: () => {
          this.status = "en proceso"
          const token = localStorage.getItem('token');
          this.clienteWAService.startOrder(token, this.orderId).subscribe({
            next: async (response) => {
              console.log(response);
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Servicio iniciado con éxito',
                buttons: ['Aceptar']
              });
              await successAlert.present();
            },
            error: async (error) => {
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Hubo un error al iniciar el servicio',
                buttons: ['Aceptar']
              });
              await errorAlert.present();
            }
          });
        }
      }
    ]
  });
  await alert.present();
}

  

async endOrder() {
  const alert = await this.alertController.create({
    header: 'Finalizar servicio',
    message: '¿Estás seguro de finalizar el servicio?',
    buttons: [
      {
        text: 'No',
        role: 'cancel'
      },
      {
        text: 'Sí',
        handler: () => {
          this.navCtrl.navigateBack("/tabs/inicio")
          const token = localStorage.getItem('token');
          this.clienteWAService.endOrder(token, this.orderId).subscribe({
            next: async (response) => {
              console.log(response);
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Servicio finalizado con éxito',
                buttons: ['Aceptar']
              });
              await successAlert.present();
            },
            error: async (error) => {
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Hubo un error al finalizar el servicio',
                buttons: ['Aceptar']
              });
              await errorAlert.present();
            }
          });
        }
      }
    ]
  });
  await alert.present();
}


  formattingDuration(){
    let hours = Math.floor(this.orderData.duration);
    let minutes = Math.floor((this.orderData.duration - hours) * 60);
    let seconds = Math.round(((this.orderData.duration - hours) * 60 - minutes) * 60);
    this.formattedDuration = `${hours} horas ${minutes} min ${seconds} seg`;
  }

  async dibujarRuta() {

    const modalAdd = await this.modalController.create({
      component: TrackServicioComponent,
      mode: 'ios',
      swipeToClose: true,
      componentProps: { origen: this.origen, destino: this.destino }
    });
    modalAdd.setAttribute('style', '--background: transparent; --backdrop-opacity: 0.0');
  
    await modalAdd.present();
  }
  
  async verUbicacion() {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.origen.lat},${this.origen.lng}&key=${this.apiKey}`);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const modalAdd = await this.modalController.create({
        component: UbicacionComponent,
        mode: 'ios',
        swipeToClose: true,
        componentProps: { position: this.origen, onlyView: true }
      });
  
      await modalAdd.present();
  }
  }

}


