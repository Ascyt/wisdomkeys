import { Component, HostListener, Renderer2 } from '@angular/core';
import { Value, ValuesService } from '../values.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatisticsService } from '../statistics.service';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './practice.component.html',
  styleUrl: './practice.component.scss'
})
export class PracticeComponent {
  public currentValue:Value|undefined = undefined;
  public currentValueAnswer:string = '';

  public stopwatchRunning:boolean = false;
  private elapsedTime: number = 0;
  private startTime: number = 0;
  private animationFrameId: any;


  constructor(public valuesService: ValuesService, private renderer: Renderer2, public statistics:StatisticsService) {
    this.valuesService.removeEmptyValues();

    if (valuesService.selectedCollection.values.length > 0) {
      this.nextValue();
    }

    //this.startStopwatch();
  }

  public nextValue():void {
    this.currentValue = this.valuesService.getRandomValue();
    
    this.reset();
  }

  public submitAnswer():void {
    if (this.currentValueAnswer === '') {
      return;
    }

    if (this.currentValueAnswer === this.currentValue?.answer) {
      this.correctAnswer();
    } else {
      this.incorrectAnswer();
    }
  }

  public correctAnswer():void {
    this.statistics.updateWpm(this.currentValueAnswer.length, this.getTime());

    this.nextValue();
  }

  public incorrectAnswer():void {
    this.reset();

    this.renderer.addClass(document.body, 'shake');
    setTimeout(() => {
      this.renderer.removeClass(document.body, 'shake');
    }, 500);
  }

  public reset():void {
    this.stopStopwatch();
    this.currentValueAnswer = '';
  }

  @HostListener('document:keydown.enter') 
  public onEnterKeydown():void {
    this.submitAnswer();
  }

  public onInputChange():void {
    if (!this.stopwatchRunning) {
      this.startStopwatch();
    }
  }

  startStopwatch(): void {
    if (!this.stopwatchRunning) {
      this.stopwatchRunning = true;
      this.startTime = performance.now() - this.elapsedTime;
      this.updateStopwatch();
    }
  }

  stopStopwatch(): void {
    if (this.stopwatchRunning) {
      this.stopwatchRunning = false;
      cancelAnimationFrame(this.animationFrameId);
    }
    
    this.elapsedTime = 0;
  }

  private updateStopwatch(): void {
    this.elapsedTime = performance.now() - this.startTime;
    if (this.stopwatchRunning) {
      this.animationFrameId = requestAnimationFrame(() => this.updateStopwatch());
    }
  }

  getTime():number {
    return performance.now() - this.startTime;
  }

  getDynamicWpm():string {
    const wpm:number = this.statistics.getWpm(this.currentValueAnswer.length, this.getTime());
    return wpm.toFixed(0);
  }
  getAvgWpm():string {
    return this.statistics.avgWpm.toFixed(0);
  }
}
