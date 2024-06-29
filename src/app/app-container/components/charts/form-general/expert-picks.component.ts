import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'expert-picks',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './expert-picks.component.html',
  styleUrl: './expert-picks.component.css'
})
export class ExpertPicksComponent implements OnInit {
  @Input() public parentForm!: FormGroup;
  @Input() public expertFormControl!: AbstractControl;
  @Input() public index!: number;

  public expertForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    description: new FormControl(undefined, [Validators.required]),
  });

  get controls() {
    return this.expertForm.controls;
  }

  constructor(public formsService: FormsService) {}

  public ngOnInit() {
    console.log('this.expertFormControl: ', this.expertFormControl)
    // this.formsService.addGroupToParentForm(this.parentForm, this.expertForm);
  }
}

// forms.service.ts
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class FormsService {
  public addGroupToParentForm(parentForm: FormGroup, group: FormGroup) {
    for (const [key, control] of Object.entries(group.controls)) {
      parentForm.addControl(key, control);
    }
    group.setParent(parentForm);
  }
}
