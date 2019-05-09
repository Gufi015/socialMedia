import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../user.service";
import { firestore } from "firebase/app";

@Component({
  selector: "app-post",
  templateUrl: "./post.page.html",
  styleUrls: ["./post.page.scss"]
})
export class PostPage implements OnInit {
  postID: string;
  post;
  postReference: AngularFirestoreDocument;
  sub;

  heartType: string = "heart-empty";


  effect:string = '';

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private user: UserService
  ) {}

  ngOnInit() {
    this.postID = this.route.snapshot.paramMap.get("id");
    this.postReference = this.afs.doc(`posts/${this.postID}`);
    this.sub = this.postReference.valueChanges().subscribe(val => {
      this.post = val;
      this.effect = val.effect;
      this.heartType = val.likes.includes(this.user.getUID())
        ? "heart"
        : "heart-empty"
    });

    console.log(this.post);
    console.log(this.postID);
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

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
