import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: `./app.component.html`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public influArray;
  title = 'sentimentUI';
  isRedditView = false;
  isTwitterView = false;
  polarity;
  polarityArray= [];
  // 0 - neutral
  // (+/-).2 - .5 positive/negative
  //(+/-) <= .5 very

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
   var influArray= [];
   
  db.collection("Twitter").get().subscribe((querySnapshot) => {
   querySnapshot.forEach((doc) => {
      console.log(doc.data());
      var influence = (doc.data().favorite_count)+(doc.data().retweet_count);
      
      if (typeof doc.data().polarity == 'object') {
        doc.data().polarity.forEach(pol => {
          this.polarity = pol.polarity;
        })
      }
      else {
        this.polarity = doc.data().polarity;
      }
      var tweet = {
       tweetInflu: influence,
       tweetText: doc.data().text,
       tweetDate: doc.data().created_at,
       tweetName: doc.data().user.screen_name,
       tweetPolarity: this.polarity
     }
     influArray.push(tweet);
   });
   this.polarityArray = influArray;
   influArray.sort(function(a, b){
     return b.tweetInflu-a.tweetInflu
   })
   console.log(influArray);

});

 this.influArray = influArray;
 }
  
}
