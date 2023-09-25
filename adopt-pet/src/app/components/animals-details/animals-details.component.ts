import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {AnimalsService} from "../../services/animals.service";
import {ActivatedRoute} from "@angular/router";
import {AnimalsStateService} from "../../services/animals-state.service";
import {Animal} from "../../data/interfaces/animal.interface";
import {Observable, Subject, takeUntil} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarComponent} from "../../shared/snack-bar/snack-bar.component";

@Component({
  selector: 'app-animals-details',
  templateUrl: './animals-details.component.html',
  styleUrls: ['./animals-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalsDetailsComponent implements OnInit, OnDestroy {
  public animal$!: Observable<Animal | null>;
  private readonly _animalId = this._route.snapshot.paramMap.get('id');
  private readonly _destroy$ = new Subject<void>();
  constructor(
    private readonly _animalService: AnimalsService,
    private readonly _animalsState: AnimalsStateService,
    private readonly _route: ActivatedRoute,
    private readonly _snackBar: MatSnackBar
  ) {}

  public ngOnInit(): void {
      this.animal$ = this._animalsState.getCurrentAnimal() ?
        this._animalsState.currentAnimal$ :
        this._animalService.getAnimalById(+this._animalId!!)
  }

  public ngOnDestroy(): void {
    this._snackBar.dismiss()
    this._animalsState.setCurrentAnimal(null);
    this._destroy$.next();
    this._destroy$.complete();
  }

  public adoptAnimal(animal: Animal): void {
    this._animalsState.setCurrentAnimal(animal);
      this._animalService.editAnimalById(+this._animalId!!,{
        ...animal,
        isAdopt: true
      }).pipe(takeUntil(this._destroy$))
        .subscribe(data => {
        this._animalsState.editCurrentAnimal(data);
        this._snackBar.openFromComponent(SnackBarComponent, {
          duration: 10 * 1000,
          data: { name: animal.name }
        });
      })
  }
}
