import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common/common.service';

@Component({
  selector: 'app-sentiment',
  templateUrl: './sentiment.component.html',
  styleUrls: ['./sentiment.component.scss']
})
export class SentimentComponent implements OnInit {

  selectedLanguages: Array<boolean> = Array(16).fill(true);
  sentcorr: any = null;
  a: number = 0;
  b: number = 0;
  corr: number = 0;

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    this.update();
    // const b = this.commonService.sentcorr?.belovedness;
    // const m = this.commonService.sentcorr?.mean_sent;
    // const a: any = this.commonService.sentcorr?.a;
    // const b2: any = this.commonService.sentcorr?.b;
    // this.setSentcorr(b, m, a, b2);
  }

  update() {
    const x: any = this.commonService.sentcorr?.belovedness.filter((value, index) => this.selectedLanguages[index]);
    const y: any = this.commonService.sentcorr?.mean_sent.filter((value, index) => this.selectedLanguages[index]);
    const xmean = x.reduce((a: number, b: number) => a + b) / x.length;
    const ymean = y.reduce((a: number, b: number) => a + b) / y.length;
    let ssxx = 0, ssyy = 0, ssxy = 0;
    for (const i in x) {
      ssxx += Math.pow(x[i] - xmean, 2);
      ssyy += Math.pow(y[i] - ymean, 2);
      ssxy += (x[i] - xmean) * (y[i] - ymean);
    }
    this.a = ssxy / ssxx;
    this.b = ymean - this.a * xmean;
    this.corr = Math.sqrt(Math.pow(ssxy, 2) / (ssxx * ssyy));
    this.setSentcorr(x, y);
  }

  setSentcorr(b: any, m: any) {
    this.sentcorr = {
      data: [
        {
          x: b,
          y: m,
          name: "Data points",
          text: this.commonService.languages
            .filter((value, index) => this.selectedLanguages[index])
            .map(lang => this.commonService.capitalize(lang)),
          type: "scatter",
          mode: "markers+text",
          textposition: "top",
        },
        {
          x: [0, 100],
          y: [this.b, this.a * 100 + this.b],
          name: "Best linear fit",
          mode: "lines",
        },
      ],
      layout: {
        xaxis: {
          title: "Belovedness [%]",
          range: [0.01, 100],
          gridcolor: "lightgrey",
        },
        yaxis: {
          title: "Mean sentiment",
          range: [0.15, 0.33],
          gridcolor: "lightgrey",
        },
        title: "Sentiment against belovedness",
      },
      config: {
        responsive: true,
      },
    };
  }

  onChange(i: number, value: boolean) {
    this.selectedLanguages[i] = value;
    this.update();
  }
}
