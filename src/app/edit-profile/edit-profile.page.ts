import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Http } from "@angular/http";
import { AlertController } from "@ionic/angular";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { UserService } from "../user.service";
import { timeout } from 'rxjs/operators';

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.page.html",
  styleUrls: ["./edit-profile.page.scss"]
})
export class EditProfilePage implements OnInit {
  //profilePic: string;
  mainUser: AngularFirestoreDocument;
  sub;
  usuario: string;
  fotoPerfil: string;
  newPassword: string;
  password: string;

  busy: boolean = false;

  @ViewChild('fileBtn') fileBtn: {
    nativeElement: HTMLInputElement;
  };

  constructor(
    private http: Http,
    private alertController: AlertController,
    private afs: AngularFirestore,
    private user: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.mainUser = this.afs.doc(`users/${this.user.getUID()}`);

    this.sub = this.mainUser.valueChanges().subscribe(
      event => {
        this.usuario = event.usuario;
        this.fotoPerfil = event.profilePic;
        console.log('esta es la foto de perfil' + this.fotoPerfil);
      },
      error => {
        console.log(error);
      }
    );
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  cargarFotoPerfil() {
    this.fileBtn.nativeElement.click();
  }


  cargarFoto(event) {
    
    const files = event.target.files;

    const data = new FormData();
    data.append("file", files[0]);
    data.append("UPLOADCARE_STORE", "1");
    data.append("UPLOADCARE_PUB_KEY", "1f5270cc7aee29733cf4");

    setTimeout(() => {
      this.http.post("https://upload.uploadcare.com/base/", data).subscribe(
      event => {
        console.log('image' + event);
        const uuid = event.json().file;

        this.mainUser.update({
          profilePic: uuid
        });
      },
      error => {
        console.error(error);
      }
    )}, 5000);
    
  }
  async actualizarPerfil() {
    this.busy = true;

    if (!this.password) {
      this.busy = false;
      return this.showAlert("Error", "Tienes que ingresar tu contraseña");
    }

    try {
      await this.user.reAuth(this.user.getName(), this.password);
    } catch (error) {
      this.busy = false;
      return this.showAlert("error", "contraseña incorrecta");
    }

    if (this.newPassword) {
      //return this.showAlert("Error", "Tienes que ingresar tu nueva contraseña");
      this.busy = false;
      await this.user.updatePass(this.newPassword);
    }

    if (this.usuario !== this.user.getName()) {
      await this.user.updateEmail(this.usuario);
      this.mainUser.update({
        usuario: this.usuario
      });
      this.busy = false;
    }

    this.password = "";
    this.newPassword = "";
    

    await this.showAlert('Success', 'Perfil actualizado Correctamente');

    this.router.navigate(["/tabs/feed"]);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ["Ok"]
    });

    await alert.present();
  }
}
