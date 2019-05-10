import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from "firebase/app";
import { post } from 'selenium-webdriver/http';

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
    private user: UserService) {}

  ngOnInit() {
    const getFeed = this.aff.httpsCallable('getfeed');
    this.sub = getFeed({}).subscribe(data => {
      console.log(data);
      this.posts = data;

      console.log("https://ucarecdn.com/"+this.posts.postID+"/-/preview/"+this.posts.effect);
    });
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  like() {
    //this.heartType = this.heartType == "heart" ? "heart-empty" : "heart";

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
}
