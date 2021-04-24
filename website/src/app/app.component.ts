import { Component } from '@angular/core';
import { CommonService } from './common/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  classifyText: string = "";
  cleanedText: string = "";

  constructor(public commonService: CommonService) { }

  private clean(text: string): string {
    // text = text.replace(/<pre><code>.*<\/pre><\/code>/gm, "");
    text = text.replace(/\bhttp\S+/gm, "");
    text = text.replace(this.commonService.stopwordRegex, "");
    text = text.replace(/<.*?>/gm, "");
    text = text.replace(/[^a-zA-Z0-9\s]/, "");
    text = text.replace(/\s/gm, " ");
    return text.toLowerCase();
  }

  public updateClassification(input: string) {
    this.classifyText = input;
    this.cleanedText = this.clean(this.classifyText);
    this.commonService.classify(this.cleanedText);
  }
}
