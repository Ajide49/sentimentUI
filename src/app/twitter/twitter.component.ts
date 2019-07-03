import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import * as d3 from "d3";

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss']
})
export class TwitterComponent implements OnInit {

  width = 450
  height = 450
  margin = 40
  radius;
  svg;
  color;
  pie;
  data_ready;

  public dougnutData = { neutral: 0, pos: 0, neg: 0, Vpos: 0, Vneg: 0 }

  constructor() { }

  ngOnInit() {
  }

}
