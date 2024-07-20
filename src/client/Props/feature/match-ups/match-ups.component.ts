import { Component } from '@angular/core';
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {SliderComponent} from "../../ui/slider/slider.component";

@Component({
  selector: 'match-ups',
  standalone: true,
  imports: [
    MatSlideToggle,
    SliderComponent
  ],
  templateUrl: './match-ups.component.html',
  styleUrl: './match-ups.component.css'
})
export class MatchUpsComponent {

}
