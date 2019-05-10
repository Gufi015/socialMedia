import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { first } from "rxjs/operators";
import { auth } from 'firebase/app'

interface user {
  usuario: string;
  uid: string;
}

@Injectable()
export class UserService {
  private user: user;

  constructor(private afAuth: AngularFireAuth) {}

  setUser(user: user) {
    this.user = user;
  }

  getUID(): string {
    // if (!this.user) {
    //   if (this.afAuth.auth.currentUser) {
    //     const user = this.afAuth.auth.currentUser;
    //     this.setUser({
    //       usuario: user.email.split("@")[0],
    //       uid: user.uid
    //     });
    //     return user.uid;
    //   } else {
    //     throw new Error("Usuario No logeado en la aplicación");
    //   }
    // } else {
    //   return this.user.uid;
    // }

    return this.user.uid;
  }

  async isAuth() {
    if (this.user) return true;

    const user = await this.afAuth.authState.pipe(first()).toPromise();

    if (user) {
      this.setUser({
        usuario: user.email.split("@")[0],
        uid: user.uid
      });
      return true;
    }
    return false;
  }

  getName(): string {
    return this.user.usuario;
  }

  reAuth(usuario: string, password: string) {
    return this.afAuth.auth.currentUser.reauthenticateWithCredential(
      auth.EmailAuthProvider.credential(usuario + "@guf.com", password)
    );
  }

  updatePass(newPassword:string) {
    return this.afAuth.auth.currentUser.updatePassword(newPassword);
  }

  updateEmail(usuario:string){
    return this.afAuth.auth.currentUser.updateEmail(usuario + "@guf.com");
  }

  logout(){
    this.afAuth.auth.signOut();
  }
}
