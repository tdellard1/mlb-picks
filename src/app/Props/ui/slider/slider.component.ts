import { Component } from '@angular/core';
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatLabel} from "@angular/material/form-field";

@Component({
  selector: 'slider',
  standalone: true,
  imports: [
    MatSlideToggle,
    MatLabel
  ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent {

}
