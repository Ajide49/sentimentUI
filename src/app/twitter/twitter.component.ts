import { Component, OnInit, Input } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap } from 'rxjs/operators';
import * as d3 from "d3";

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss']
})
export class TwitterComponent implements OnInit {
  @Input() public barData;
  width = 450
  height = 450
  margin = 40
  radius;
  svg;
  color;
  pie;
  data_ready;


  public doughnutData = { neutral: 0, pos: 0, neg: 0, Vpos: 0, Vneg: 0 }


  ngOnInit() {
    //this.draw();
  }

  // 0 - neutral
  // (+/-).2 - .5 positive/negative
  //(+/-) <= .5 very positive/negative

  constructor(db: AngularFirestore) {
    db.collection("Twitter").get().pipe(tap((res) => this.something(res))).subscribe(() => this.draw());
  }

  sortByPolarity(polarity: any) {
    if (polarity >= 0 && polarity <= 0.1 || polarity <= 0 && polarity >= -0.1) {
      this.doughnutData.neutral++;
    }
    if (polarity > 0.1 && polarity <= 0.5) {
      this.doughnutData.pos++;
    }
    if (polarity < -0.1 && polarity >= -0.5) {
      this.doughnutData.neg++;
    }
    if (polarity > 0.5) {
      this.doughnutData.Vpos++;
    }
    if (polarity < -0.5) {
      this.doughnutData.Vneg++;
    }

  }

  draw() {
    this.drawDoughnut();
    this.drawBar();

  }

  private drawBar(): void {
    var margin = { top: 20, right: 20, bottom: 70, left: 40 },
      width = 600 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    // Parse the date / time
    var	parseDate = d3.timeParse("%Y-%m");

    var x = d3.scaleBand().range([0, width]);

    var y = d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom()
      .scale(x)
      .tickFormat(d3.timeFormat("%Y-%m"));

    var yAxis = d3.axisLeft()
      .scale(y)
      .ticks(11);

    var svg = d3.select("div#my_dataviz2").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    x.domain(this.barData.map(function(d) { return parseDate(d.tweetDate); }));
    y.domain([-1, d3.max(this.barData, function(d) { return d.tweetPolarity; })]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value ($)");
console.log("bardata", this.barData);
    svg.selectAll("bar")
      .data(this.barData)
      .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function (d, index) {
        return index * 51;
      })
      .attr("width",50)
      .attr("y", function (d) { return y(d.tweetPolarity); })
      .attr("height", function (d) { 
        return height - y(d.tweetPolarity); });


  }

  private drawDoughnut(): void {
    this.radius = Math.min(this.width, this.height) / 2 - this.margin
    console.log('radius', this.radius);

    const svg = d3.select("div#my_dataviz")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", "translate(" + this.width / 2 + "," +
        this.height / 2 + ")");

    // set the color scale
    this.color = d3.scaleOrdinal()
      .domain(Object.keys(this.doughnutData))
      .range(["#4287f5", "#42bcf5", "#42daf5", "#4266f5", "#6f42f5"])

    // Compute the position of each group on the pie:
    this.pie = d3.pie()
      .value(function (d) { return d.value })

    this.data_ready = this.pie(d3.entries(this.doughnutData))
    console.log('data_ready', this.data_ready);

    svg
      .selectAll('g')
      .data(this.data_ready)
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(90)         // This is the size of the donut hole
        .outerRadius(this.radius))
      .attr('fill', (d) => {
        console.log('d', d);
        console.log('color', this.color(d.data.key));
        return (this.color(d.data.key))
      })
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 1)
  }

  private something(querySnapshot): void {
    querySnapshot.forEach((doc) => {
      //console.log(doc.data());
      let data = doc.data();
      let { polarity } = data;

      if (typeof polarity == 'object') {
        polarity.forEach(pol => {
          this.sortByPolarity(pol.polarity);
        })
      }
      else {
        this.sortByPolarity(data.polarity);

      }

    })
  }

}

