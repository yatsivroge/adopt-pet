import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-animals-details',
  templateUrl: './animals-details.component.html',
  styleUrls: ['./animals-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalsDetailsComponent {

}
