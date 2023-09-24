import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Observable} from "rxjs";
import {Animal} from "../data/interfaces/animal.interface";

@Injectable({
  providedIn: 'root'
})
export class AnimalsService {
  private readonly _url = environment.apiUrl
  constructor(private readonly _http: HttpClient) { }

  public getAllAnimals(): Observable<Animal[]> {
    return this._http.get<Animal[]>(`${this._url}/animals`)
  }

  public getAnimalById(id: number): Observable<Animal> {
    return this._http.get<Animal>(`${this._url}/animals/${id}`)
  }

  public editAnimalById(id: number, updateAnimal: Animal): Observable<Animal> {
    return this._http.patch<Animal>(`${this._url}/animals/${id}`, updateAnimal)
  }
}
