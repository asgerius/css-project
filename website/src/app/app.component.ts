import { Component } from '@angular/core';
import { CommonService } from './common/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public commonService: CommonService) { }
}
