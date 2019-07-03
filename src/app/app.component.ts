import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: `./app.component.html`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sentimentUI';

  isRedditView = false;
  isTwitterView = false;

  redditView(){
    if(this.isRedditView == true){
      this.isRedditView = false;
    }
     else{
    this.isRedditView = true;
    }
  }

  twitterView(){
    if(this.isTwitterView == true){
      this.isTwitterView = false;
    }
     else{
    this.isTwitterView = true;
    }
  }
  
  items: Observable<any[]>;
  constructor(db: AngularFirestore) {
   db.collection("twitter").get().subscribe((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(doc.data());
    });
});
  }
  
}
