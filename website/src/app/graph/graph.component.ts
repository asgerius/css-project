import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common/common.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

  degdist: any = null;

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    this.degdist = {
      data: [
        {
          x: this.commonService.degdist?.x_in,
          y: this.commonService.degdist?.in_hist,
          name: "In-degrees",
        },
        {
          x: this.commonService.degdist?.x_out,
          y: this.commonService.degdist?.out_hist,
          name: "Out-degrees",
        },
      ],
      layout: {
        xaxis: {
          title: "Degree",
          autorange: true,
          type: "log",
          gridcolor: "lightgrey",
        },
        yaxis: {
          title: "Probability density",
          autorange: true,
          type: "log",
          gridcolor: "lightgrey",
          exponentformat: 'e',
        },
        title: "Degree distribution",
      },
      config: {
        responsive: true,
      },
    };
  }

}
