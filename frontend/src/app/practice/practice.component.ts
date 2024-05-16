import { Component } from '@angular/core';
import { ValuesService } from '../values.service';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [],
  templateUrl: './practice.component.html',
  styleUrl: './practice.component.scss'
})
export class PracticeComponent {
  constructor(public valuesService: ValuesService) {
    this.valuesService.removeEmptyValues();
  }
}
