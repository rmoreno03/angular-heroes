import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { Hero } from '../interfaces/hero.interface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HeroesService {

  private baseUrl: string = environment.baseUrl;


  constructor(private http: HttpClient) { }


  getHeroes():Observable<Hero[]> {
    return this.http.get<Hero[]>(`${ this.baseUrl }/heroes`);
  }

  getHeroById( id: string ): Observable<Hero|undefined> {
    return this.http.get<Hero>(`${ this.baseUrl }/heroes/${ id }`)
      .pipe(
        catchError( error => of(undefined) )
      );
  }

  getSuggestions( query: string ): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${ this.baseUrl }/heroes?q=${ query }&_limit=6`);
  }

  /*
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${ this.baseUrl }/heroes`, hero);
  }
  */

  addHero(hero: Hero): Observable<Hero> {
    // Crea una copia del héroe sin el campo `id` si está vacío
    const heroWithoutId = { ...hero };
    if (!heroWithoutId.id || heroWithoutId.id.trim() === '') {
      delete heroWithoutId.id;
    }

    return this.http.post<Hero>(`${this.baseUrl}/heroes`, heroWithoutId);
  }

  updateHero(hero: Hero): Observable<Hero> {
    if ( !hero.id ) throw new Error('The hero must have an ID');
    return this.http.patch<Hero>(`${ this.baseUrl }/heroes/${ hero.id }`, hero);
  }

  deleteHero(id: string): Observable<boolean> {
    return this.http.delete<any>(`${ this.baseUrl }/heroes/${ id }`)
    .pipe(
      catchError( error => of(false) ),
      map( resp => true )
    );
  }

}
