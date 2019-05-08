import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  usuario: string = "";
  password: string = "";

  constructor(private afAuth: AngularFireAuth,
    private alertController:AlertController,
    private router:Router) {}

  ngOnInit() {}

  async login() {
    const { usuario, password } = this;
    try {
      const res = await this.afAuth.auth.signInWithEmailAndPassword(
        usuario + "@guf.com",
        password
      ); 
      console.log(res);
      this.router.navigate(['/tabs']);

    } catch (error) {
      console.dir(error);
      this.showAlert('error', error.message);
    }
  }

  async showAlert(header:string, message:string){
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Ok']
    });

    await alert.present();

  }
}
