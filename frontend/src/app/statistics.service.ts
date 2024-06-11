import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  public wordsCorrect:number = 0;
  public avgWpm:number = 0;

  constructor() { }

  public getWpm(answerLength:number, elapsedTime:number):number {
    // Assuming 5 characters per word
    const words = answerLength / 5;
    const minutes = elapsedTime / 60000;
    return words / minutes;
  }

  public updateWpm(answerLength:number, elapsedTime:number):void {
    this.avgWpm = (this.avgWpm * this.wordsCorrect + this.getWpm(answerLength, elapsedTime)) / (this.wordsCorrect + 1);
  }
}
