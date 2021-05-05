import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common/common.service';

@Component({
  selector: 'app-tfidf',
  templateUrl: './tfidf.component.html',
  styleUrls: ['./tfidf.component.scss']
})
export class TfidfComponent implements OnInit {

  classifyText: string = "";
  cleanedText: string = "";

  public validation: any = null;

  constructor(public commonService: CommonService) { }

  ngOnInit() {
    this.validation = {
      data: [
        {
          x: this.commonService.validation?.number_of_words,
          y: this.commonService.validation?.accs.map(x => 100*x),
          name: "Accuracy",
        },
        {
          x: this.commonService.validation?.number_of_words,
          y: this.commonService.validation?.f1s.map(x => 100*x),
          name: "Weighted F1",
        },
      ],
      layout: {
        xaxis: {
          title: "Maximum vocabulary size",
          type: 'log',
          autorange: true,
          gridcolor: "lightgrey",
        },
        yaxis: {
          title: "Validation score [%]",
        },
        title: "Classifier validation",
      },
      config: {
        responsive: true,
        gridcolor: "lightgrey",
      },
    };
  }

  private clean(text: string): string {
    text = text.replace(/\bhttp\S+/gm, "");
    text = text.replace(this.commonService.stopwordRegex, "");
    text = text.replace(/<.*?>/gm, "");
    text = text.replace(/[^a-zA-Z0-9\s]/gm, "");
    text = text.replace(/\s/gm, " ");
    return text.toLowerCase();
  }

  public updateClassification(input: string) {
    this.classifyText = input;
    this.cleanedText = this.clean(this.classifyText);
    this.commonService.classify(this.cleanedText);
  }

}
