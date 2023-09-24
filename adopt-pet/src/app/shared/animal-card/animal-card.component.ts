import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {Animal} from "../../data/interfaces/animal.interface";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-animal-card',
  template: `
      <mat-card class="animal-card">
          <p class="animal-card__adopted-title" *ngIf="animal.isAdopt">
            Adopted
          </p>
          <img [ngClass]="{'animal-card__adopted-image': animal.isAdopt}" class="animal-card__image"
               [src]="animal.photoLink"
               [alt]="animal.name">
          <mat-card-header>
              <mat-card-title>{{animal.name}}</mat-card-title>
              <mat-card-subtitle>{{animal.breed}}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Location: {{animal.sex}}</p>
            <p>Size: {{animal.size}}</p>
            <p>Species: {{animal.species}}</p>
            <p>Age: {{animal.age}}</p>
          </mat-card-content>
          <mat-card-actions>
              <button mat-raised-button (click)="onAnimalDetailsClick()">Details</button>
          </mat-card-actions>
      </mat-card>
  `,
  styleUrls: ['./animal-card.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalCardComponent {
 @Input() public animal!: Animal;
 @Output() public animalDetailsClick = new EventEmitter<void>();

 public onAnimalDetailsClick(): void {
   this.animalDetailsClick.emit()
 }
}
