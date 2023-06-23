import { Component, HostBinding, Input, inject } from '@angular/core';

import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { TlappService } from 'src/app/services/tlapp.service';

@Component({
  templateUrl: './customshape.component.html',
  styleUrls: ['./customshape.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    NgIf,
  ],
})
export class CustomshapeComponent {
  @HostBinding('style.--fa-primary-color')
  @Input()
  primarycolor: string = 'white';

  @HostBinding('style.--fa-secondary-color')
  @Input()
  secondarycolor: string = '#4263eb';

  public shapec: any;

  constructor(private appsvc: TlappService) {
    this.appsvc.shapeChanged.subscribe((id: string) => {
      if (id === this.shapec?.id) {
        this.shapec = this.appsvc.getShapeById(id);
      }
    });
  }

  @Input() set shape(val: string) {
    if (val) {
      this.shapec = this.appsvc.getShapeById(val);
    }
  }

  get shapeid() {
    return this.shapec?.id || 'shapeid';
  }

  get text() {
    return this.shapec?.props?.text || 'text';
  }

  get hasBoundStartArrow() {
    return this.appsvc.hasBoundStartArrow(this.shapec);
  }

  onClick(evt: any) {
    console.log('click', evt);
  }

  onMouseDown(evt: any) {
    this.appsvc.infodialog(this.shapec);
  }

  onMouseUp(evt: any) {
    console.log('mouseup', evt);
  }

  addState() {
    this.appsvc.addState(this.shapec);
  }
}
