import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef} from "@angular/material/snack-bar";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-snack-bar',
  template: `
    <div class="snack-bar" style="display: flex;">
      <span matSnackBarLabel>
        You Adopt a {{animalName}}
      </span>
      <span matSnackBarActions>
        <button mat-button matSnackBarAction
                routerLink="/"
                (click)="snackBarRef.dismissWithAction()">Home Page</button>
      </span>
    </div>
  `,
  styles: ['.snack-bar { display: flex; }'],
  imports: [MatButtonModule, MatSnackBarModule, RouterLink],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnackBarComponent {
  snackBarRef = inject(MatSnackBarRef);
  snackBarData = inject(MAT_SNACK_BAR_DATA)
  public animalName = this.snackBarData.name
  constructor() {}
}
