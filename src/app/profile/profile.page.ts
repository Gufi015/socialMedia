import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { UserService } from "../user.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"]
})
export class ProfilePage implements OnInit {
  userPost;
  post;
  profilePic: string;
  usuario: string;
  mainUser: AngularFirestoreDocument;
  sub;

  constructor(
    private afstore: AngularFirestore,
    private user: UserService,
    private router: Router
  ) {
    //const post = this.afstore.doc(`users/${user.getUID()}`);
    this.mainUser = this.afstore.doc(`users/${this.user.getUID()}`);
    this.sub = this.mainUser.valueChanges().subscribe(event => {
      this.post = event.post;
      this.usuario = event.usuario;
      this.profilePic = event.profilePic;
      console.log('image ' + this.profilePic);
    });
  }

  ngOnInit() {}

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  goTo(postID: string) {
    this.router.navigate(["/tabs/post/" + postID.split("/")[0]]);
    console.log(postID);
  }
}
