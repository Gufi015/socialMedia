import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from "@angular/fire/firestore";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Http } from "@angular/http";
import { UserService } from "../user.service";
import { firestore } from "firebase/app";

@Component({
  selector: "app-uploader",
  templateUrl: "./uploader.page.html",
  styleUrls: ["./uploader.page.scss"]
})
export class UploaderPage implements OnInit {
  imageURL: string;
  descripcion: string = "";
  busy: boolean = false;
  scaleCrop: string = '-/scale_crop/200x200';

  effects = {
    effect1: '',
    effect2: '-/exposure/50/-/saturation/50/-/warmth/-30/',
    effect3: '-/filter/vevera/150/',
    effect4: '-/filter/carris/150/',
    effect5: '-/filter/misiara/150/'
  };
  activeEffect: string = this.effects.effect1;

  @ViewChild("filebtn") filebtn;

  constructor(
    private http: Http,
    private afstore: AngularFirestore,
    private user: UserService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {}

  fileChange(event) {
    this.busy = true;
    const files = event.target.files;

    const data = new FormData();
    data.append("file", files[0]);
    data.append("UPLOADCARE_STORE", "1");
    data.append("UPLOADCARE_PUB_KEY", "1f5270cc7aee29733cf4");

    this.http
      .post("https://upload.uploadcare.com/base/", data)
      .subscribe(event => {
        console.log(event);
        this.imageURL = event.json().file;
        console.log("Esta es la url " + this.imageURL);
      });

    this.busy = false;
  }
  async createPost() {
    this.busy = true;
    const image = this.imageURL;
    const desc = this.descripcion;

    this.afstore.doc(`users/${this.user.getUID()}`).update({
      post: firestore.FieldValue.arrayUnion(image)
    });

    this.afstore.doc(`posts/${image}`).set({
      desc,
      autor: this.user.getName(),
      likes: []
    });
    this.busy = false;
    this.imageURL = "";
    this.descripcion = "";

    const alert = await this.alertController.create({
      header: "success",
      message: "Post creado!",
      buttons: ["Ok"]
    });
    await alert.present();
    this.router.navigate(["/tabs/feed"]);
  }

  uploadFile() {
    this.filebtn.nativeElement.click();
  }

  cancelar() {
    this.imageURL = "";
    this.descripcion = "";
  }

  selectEfect(effect: string) {
    this.activeEffect = this.effects[effect];
  }
}
