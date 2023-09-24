import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Animal} from "../data/interfaces/animal.interface";

@Injectable({
  providedIn: 'root'
})
export class AnimalsStateService {
  private readonly _animals$ = new BehaviorSubject<Animal[] | []>([]);
  public animals$: Observable<Animal[] | []> = this._animals$.asObservable() as Observable<Animal[] | []>;
  constructor() { }

  public setAnimals(animals: Animal[]): void {
    this._animals$.next(animals);
  }

  public getAnimalsValue(): Animal[] | [] {
    return this._animals$.getValue();
  }
}
