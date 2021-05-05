import { DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TfidfComponent } from './tfidf/tfidf.component';
import { DataComponent } from './data/data.component';
import { GraphComponent } from './graph/graph.component';
import { SentimentComponent } from './sentiment/sentiment.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { PartionComponent } from './partion/partion.component';
import { DiscussionComponent } from './discussion/discussion.component';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    TfidfComponent,
    DataComponent,
    GraphComponent,
    SentimentComponent,
    IntroductionComponent,
    PartionComponent,
    DiscussionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    PlotlyModule,
    ReactiveFormsModule,
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
