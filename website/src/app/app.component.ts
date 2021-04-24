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
    return text;
  }

  public updateClassification(input: string) {
    this.classifyText = input;
    this.cleanedText = this.clean(this.classifyText);
    
  }
}
