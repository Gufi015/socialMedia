import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from "firebase/app";
import { Router } from '@angular/router';


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

  constructor(private aff: AngularFireFunctions,
    private user: UserService,
    private router:Router) {}

  ngOnInit() {
    const getFeed = this.aff.httpsCallable('getfeed');
    this.sub = getFeed({}).subscribe(data => {
      console.log(data);
      this.posts = data;

      const datas = this.posts.effect;

      console.log('no esta definida '+ "https://ucarecdn.com/"+this.posts.postID+"/-/preview/"+datas);
    });
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  like() {
    //this.heartType = this.heartType == "heart" ? "heart-empty" : "heart";
    console.log('click like');
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
  salir(){
    this.user.logout();
    console.log('logout');
    this.router.navigate(['/login']); 
  }
}
