import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Animal} from "../data/interfaces/animal.interface";

@Injectable({
  providedIn: 'root'
})
export class AnimalsStateService {
  private readonly _animals$ = new BehaviorSubject<Animal[] | []>([]);
  public animals$: Observable<Animal[] | []> = this._animals$.asObservable() as Observable<Animal[] | []>;

  private readonly _currentAnimal$ = new BehaviorSubject<Animal | null>(null);
  public currentAnimal$: Observable<Animal | null> = this._currentAnimal$.asObservable() as Observable<Animal | null>;
  constructor() { }

  public setAnimals(animals: Animal[]): void {
    this._animals$.next(animals);
  }

  public getAnimalsValue(): Animal[] | [] {
    return this._animals$.getValue();
  }

  public setCurrentAnimal(animal: Animal | null): void {
    this._currentAnimal$.next(animal);
  }

  public getCurrentAnimal(): Animal | null {
    return this._currentAnimal$.getValue();
  }

  public editCurrentAnimal(animal: Animal | null): void {
    const newAnimal = animal ? {
      ...this._currentAnimal$.value,
      ...animal
    } : null;
    this._currentAnimal$.next(newAnimal);
  }
}
