import { AlertController } from "@ionic/angular";
import { Component, OnInit } from "@angular/core";
import { AngularFireFunctions } from "@angular/fire/functions";
import { AngularFirestoreDocument } from "@angular/fire/firestore";
import { UserService } from "../user.service";
import { firestore } from "firebase/app";
import { Router } from "@angular/router";
import { timer } from "rxjs/observable/timer";
import { switchMap } from "rxjs/operators";

@Component({
  selector: "app-feed",
  templateUrl: "./feed.page.html",
  styleUrls: ["./feed.page.scss"]
})
export class FeedPage implements OnInit {
  posts;
  heartType: string = "heart-empty";
  postReference: AngularFirestoreDocument;
  sub;

  constructor(
    private aff: AngularFireFunctions,
    private user: UserService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    
    const getFeed = this.aff.httpsCallable("getfeed");
    this.sub = getFeed({}).subscribe(data => {
      console.log(data);
      this.posts = data;

      const datas = this.posts.effect;

      console.log(
        "no esta definida " +
          "https://ucarecdn.com/" +
          this.posts.postID +
          "/-/preview/" +
          datas
      );
    });

    // const getFeed = this.aff.httpsCallable("getfeed");
    // const timeInterval = 3000;
    // return timer(0, timeInterval).subscribe(() =>{
    //   getFeed({}).subscribe(data => {
    //     console.log(data);
    //     this.posts = data;
    //     const datas = this.posts.effect;
    //     console.log(
    //       "no esta definida " +
    //         "https://ucarecdn.com/" +
    //         this.posts.postID +
    //         "/-/preview/" +
    //         datas
    //     );
    //   });
    // });

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  like() {
    //this.heartType = this.heartType == "heart" ? "heart-empty" : "heart";
    console.log("click like");
    if (this.heartType == "heart-empty") {
      this.postReference.update({
        likes: firestore.FieldValue.arrayUnion(this.user.getUID())
      });
    } else {
      this.postReference.update({
        likes: firestore.FieldValue.arrayRemove(this.user.getUID())
      });
    }
  }
  async salir() {
    const alert = await this.alertController.create({
      header: "Estas Seguro que deseas salir de la APP?",
      message: "",
      buttons: [
        {
          text: "SI",
          role: "cancel",
          handler: () => {
            this.user.logout();
            this.router.navigate(["/login"]);
          }
        },
        {
          text: "NO"
        }
      ]
    });
    await alert.present();
    // console.log("logout");
    // this.router.navigate(["/login"]);
  }
}
