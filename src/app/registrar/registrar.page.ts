import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: "app-registrar",
  templateUrl: "./registrar.page.html",
  styleUrls: ["./registrar.page.scss"]
})
export class RegistrarPage implements OnInit {
  usuario: string = "";
  password: string = "";
  cPassword: string = "";

  constructor(private afAuth: AngularFireAuth, 
    private alertController:AlertController,
    private router:Router) {}

  ngOnInit() {}

  async registrar() {
    const { usuario, password, cPassword } = this;
    if (password !== cPassword) {
      this.showAlert('error!', 'Contraseñas no coinciden!');
      return console.log("Las contraseñas no son iguales");
    }

    try {
      const res = await this.afAuth.auth.createUserWithEmailAndPassword(
        usuario + "@guf.com",
        password
      );
      console.log(res);
      this.showAlert('Succes', 'Bienvenido ' + usuario);

      this.router.navigate(['/tabs']);
    } catch (error) {
      console.dir(error);
      this.showAlert('error', error.message);
    }
  }

  async showAlert(header: string, message:string){
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Ok']
    })

    await alert.present();

  }
}
