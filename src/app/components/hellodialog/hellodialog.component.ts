import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

interface Data {
  title: string;
  name: string;
}

@Component({
  templateUrl: './hellodialog.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    NgIf,
  ],
})
export class HelloDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<HelloDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data
  ) {}

  get title() {
    if (!this.data) return 'Hello world';
    return this.data.title;
  }

  name: string = '';

  onNoClick(): void {
    this.dialogRef.close();
  }
}
