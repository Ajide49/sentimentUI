import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
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
}
