import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import { AnimalsService } from "../../services/animals.service";
import { FormBuilder } from "@angular/forms";
import { Animal } from "../../data/interfaces/animal.interface";
import {Subject, take, takeUntil} from "rxjs";
import { AnimalsStateService } from "../../services/animals-state.service";
import { PageEvent } from "@angular/material/paginator";
import {Router} from "@angular/router";
import {ANIMAL_GENDER, ANIMAL_GENDER_VALUES} from "../../data/constants/animal-gender.constants";
import {ANIMAL_TYPE, ANIMAL_TYPE_VALUES} from "../../data/constants/animal-type.constants";

@Component({
  selector: 'app-animals',
  templateUrl: './animals.component.html',
  styleUrls: ['./animals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalsComponent implements OnInit, OnDestroy {
  public animal$ = this._animalsState.animals$;
  public filteredAnimal: Animal[] | []  = [];
  public animalFilterForm = this._fb.group({
    search: '',
    gender: ANIMAL_GENDER.ALL,
    animalType: ANIMAL_TYPE.ALL
  })

  public animalGenderValues = ANIMAL_GENDER_VALUES;
  public animalTypeValues = ANIMAL_TYPE_VALUES;
  public currentPage = 0;
  public pageSize = 10;
  public start  = (this.currentPage + 1) * this.pageSize;
  public end = this.currentPage * this.pageSize;
  private readonly _destroy$ = new Subject<void>();
  constructor(private readonly _animalService: AnimalsService,
              private readonly _animalsState: AnimalsStateService,
              private readonly _router: Router,
              private readonly _fb: FormBuilder) {}

  ngOnInit() {
    this._animalService.getAllAnimals().pipe(
      take(1),
      takeUntil(this._destroy$))
      .subscribe(animals => {
      this._animalsState.setAnimals(animals);
      this.filteredAnimal = animals;
    })

    this.animalFilterForm.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe(filters => {
      let newFilteredAnimals = this._searchAnimals(this.filteredAnimal, filters?.search!!);

      if (filters.gender?.toLowerCase() !== 'all') {
        newFilteredAnimals = this._filterAnimals(newFilteredAnimals, 'sex', filters.gender as string)
      }
      if (filters.animalType?.toLowerCase() !== 'all') {
        newFilteredAnimals = this._filterAnimals(newFilteredAnimals, 'species', filters.animalType as string)
      }

      this._setPaginationConfig();
      this._animalsState.setAnimals(newFilteredAnimals);
    })

    this._setPaginationConfig();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }


  public pageChangeEvent(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this._setPaginationConfig();
  }

  public onAnimalDetails(animal: Animal | null): void {
    if (animal) {
      this._router.navigateByUrl(`animals/${+animal.id}`);
      this._animalsState.setCurrentAnimal(animal);
    }
  }

  private _filterAnimals(
    animals: Animal[] | [],
    filterProperty: keyof Animal,
    valueToFilter: string): Animal[] | [] {
    if (animals.length) {
      return animals.filter(animal => animal[filterProperty].toString().toLowerCase() === valueToFilter.toLowerCase())
    } else {
      return []
    }
  }

  private _searchAnimals(animals: Animal[], searchValue: string) {
    return animals.filter(animal => {
      if (searchValue) {
        return animal.breed.toLowerCase().includes(searchValue.toLowerCase()) ||
          animal.name.toLowerCase().includes(searchValue.toLowerCase())
      } else {
        return animal
      }
    })
  }

  private _setPaginationConfig(): void {
    this.start = this.currentPage * this.pageSize;
    this.end = (this.currentPage + 1) * this.pageSize;
  }
}
