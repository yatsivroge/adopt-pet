import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AnimalsService } from "../../services/animals.service";
import { FormBuilder } from "@angular/forms";
import { Animal } from "../../data/interfaces/animal.interface";
import { take } from "rxjs";
import { AnimalsStateService } from "../../services/animals-state.service";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-animals',
  templateUrl: './animals.component.html',
  styleUrls: ['./animals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalsComponent implements OnInit {
  public animal$ = this._animalsState.animals$;
  public filteredAnimal: Animal[] | []  = [];
  public animalFilterForm = this._fb.group({
    search: '',
    gender: 'All',
    animalType: 'All'
  })

  public currentPage = 0;
  public pageSize = 3;
  public start  = (this.currentPage + 1) * this.pageSize;
  public end = this.currentPage * this.pageSize;
  constructor(private readonly _animalService: AnimalsService,
              private readonly _animalsState: AnimalsStateService,
              private readonly _fb: FormBuilder) {}

  ngOnInit() {
    this._animalService.getAllAnimals().pipe(take(1)).subscribe(animals => {
      this._animalsState.setAnimals(animals);
      this.filteredAnimal = animals;
    })

    this.animalFilterForm.valueChanges.subscribe(filters => {
      let newFilteredAnimals = this.filteredAnimal.filter(animal => {
        if (filters.search) {
          return animal.breed.toLowerCase().includes(filters.search?.toLowerCase()!!) ||
            animal.name.toLowerCase().includes(filters.search?.toLowerCase()!!)
        } else {
          return animal
        }
      })

      if (filters.gender?.toLowerCase() !== 'all') {
        newFilteredAnimals = this._filterAnimals(newFilteredAnimals, 'sex', filters.gender as string)
      }
      if (filters.animalType?.toLowerCase() !== 'all') {
        newFilteredAnimals = this._filterAnimals(newFilteredAnimals, 'species', filters.animalType as string)
      }

      // this.iterator();
      this.start = this.currentPage * this.pageSize;
      this.end = (this.currentPage + 1) * this.pageSize;
      this._animalsState.setAnimals(newFilteredAnimals);
    })

    this.iterator();
  }


  public pageChangeEvent(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.iterator();
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

  private iterator() {
    this.start = this.currentPage * this.pageSize;
    this.end = (this.currentPage + 1) * this.pageSize;
  }
}
