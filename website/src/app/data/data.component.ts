import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common/common.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

  n: any = null;
  c: any = null;
  s: any = null;

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    this.n = {
      data: [
        {
          x: this.commonService.ndist?.qx,
          y: this.commonService.ndist?.qdist,
          name: "Questions",
          mode: "lines+markers",
        },
        {
          x: this.commonService.ndist?.ax,
          y: this.commonService.ndist?.adist,
          name: "Answers",
          mode: "lines+markers",
        },
        {
          x: this.commonService.ndist?.cx,
          y: this.commonService.ndist?.cdist,
          name: "Comments",
          mode: "lines+markers",
        },
      ],
      layout: {
        xaxis: {
          title: "Number of words",
          type: 'log',
          range: [0, 3.8],
          gridcolor: "lightgrey",
        },
        yaxis: {
          title: "Probability density",
          type: "log",
          autorange: true,
          gridcolor: "lightgrey",
          exponentformat: 'e',
        },
        title: "Distribution of number of words before cleaning",
      },
      config: {
        responsive: true,
        gridcolor: "lightgrey",
      },
    };
    this.s = {
      data: [
        {
          x: this.commonService.sdist?.qx,
          y: this.commonService.sdist?.qdist,
          name: "Questions",
          mode: "lines+markers",
        },
        {
          x: this.commonService.sdist?.ax,
          y: this.commonService.sdist?.adist,
          name: "Answers",
          mode: "lines+markers",
        },
        {
          x: this.commonService.sdist?.cx,
          y: this.commonService.sdist?.cdist,
          name: "Comments",
          mode: "lines+markers",
        },
      ],
      layout: {
        xaxis: {
          title: "Number of words",
          type: 'log',
          range: [0, 3.8],
          gridcolor: "lightgrey",
        },
        yaxis: {
          title: "Probability density",
          type: "log",
          autorange: true,
          gridcolor: "lightgrey",
          exponentformat: 'e',
        },
        title: "Distribution of number of words after sentiment cleaning",
      },
      config: {
        responsive: true,
        gridcolor: "lightgrey",
      },
    };
    this.c = {
      data: [
        {
          x: this.commonService.cdist?.qx,
          y: this.commonService.cdist?.qdist,
          name: "Questions",
          mode: "lines+markers",
        },
        {
          x: this.commonService.cdist?.ax,
          y: this.commonService.cdist?.adist,
          name: "Answers",
          mode: "lines+markers",
        },
        {
          x: this.commonService.cdist?.cx,
          y: this.commonService.cdist?.cdist,
          name: "Comments",
          mode: "lines+markers",
        },
      ],
      layout: {
        xaxis: {
          title: "Number of words",
          type: 'log',
          range: [0, 3.8],
          gridcolor: "lightgrey",
        },
        yaxis: {
          title: "Probability density",
          type: "log",
          autorange: true,
          gridcolor: "lightgrey",
          exponentformat: 'e',
        },
        title: "Distribution of number of words after classification cleaning",
      },
      config: {
        responsive: true,
        gridcolor: "lightgrey",
      },
    };
  }

}
