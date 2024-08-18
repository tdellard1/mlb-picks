import {Component, Input, OnInit} from '@angular/core';
import {Game} from "../../../../common/interfaces/game";
import {NgIf} from "@angular/common";

@Component({
  selector: 'handed-splits',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './handed-splits.component.html',
  styleUrl: './handed-splits.component.css'
})
export class HandedSplitsComponent implements OnInit {

  @Input() game!: Game;

  constructor() {}

  ngOnInit(): void {}
}
