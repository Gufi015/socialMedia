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

  constructor(private afAuth: AngularFireAuth) {}

  ngOnInit() {}

  async login() {
    const { usuario, password } = this;
    try {
      const res = await this.afAuth.auth.signInWithEmailAndPassword(
        usuario + "@guf.com",
        password
      );
      console.log(res);
    } catch (error) {
      console.dir(error);
    }
  }
}
