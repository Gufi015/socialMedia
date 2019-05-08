import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit, ViewChild } from "@angular/core";
import { Http} from '@angular/http';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';

@Component({
  selector: "app-uploader",
  templateUrl: "./uploader.page.html",
  styleUrls: ["./uploader.page.scss"]
})
export class UploaderPage implements OnInit {
  imageURL: string;
  descripcion: string = "";



  @ViewChild('filebtn') filebtn;

  constructor(private http: Http,
    private afstore: AngularFirestore,
    private user:UserService) {}

  ngOnInit() {}

  fileChange(event) {
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
      });
  }
  createPost() {
    const image = this.imageURL;
    const desc = this.descripcion;

    this.afstore.doc(`users/${this.user.getUID()}`).update({
      post: firestore.FieldValue.arrayUnion(image),
    });

    this.afstore.doc(`posts/${image}`).set({
      desc,
      autor: this.user.getName(),
      likes:[]
    });
  }

  uploadFile(){
    this.filebtn.nativeElement.click();
  }
  
}
