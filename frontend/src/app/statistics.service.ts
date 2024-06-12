import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  public wordsCorrect:number = 0;
  public avgWpm:number = 0;
  public bestWpm:number = 0;

  constructor() { }

  public getWpm(answerLength:number, elapsedTime:number):number {
    // Assuming 5 characters per word
    const words = answerLength / 5;
    const minutes = elapsedTime / 60000;
    return words / minutes;
  }

  public updateWpm(answerLength:number, elapsedTime:number):void {
    let wpm:number = this.getWpm(answerLength, elapsedTime);

    this.avgWpm = (this.avgWpm * this.wordsCorrect + wpm) / (this.wordsCorrect + 1);
    this.wordsCorrect++;
    if (wpm > this.bestWpm) {
      this.bestWpm = wpm;
    }
  }

  public resetHistory():void {
    this.wordsCorrect = 0;
    this.avgWpm = 0;
  }
}
