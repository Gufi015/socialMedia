import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";

@Component({
  selector: "app-registrar",
  templateUrl: "./registrar.page.html",
  styleUrls: ["./registrar.page.scss"]
})
export class RegistrarPage implements OnInit {
  usuario: string = "";
  password: string = "";
  cPassword: string = "";

  constructor(private afAuth: AngularFireAuth) {}

  ngOnInit() {}

  async registrar() {
    const { usuario, password, cPassword } = this;
    if (password !== cPassword) {
      return console.log("Las contraseñas no son iguales");
    }

    try {
      const res = await this.afAuth.auth.createUserWithEmailAndPassword(
        usuario + "@guf.com",
        password
      );
      console.log(res);
    } catch (error) {
      console.dir(error);
    }
  }
}
