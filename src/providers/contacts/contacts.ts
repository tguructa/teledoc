import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Contact } from '../../model/contact';

 

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/*
  Generated class for the ContactsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ContactsProvider {

  private contactUrl = 'https://f2fapiserv.herokuapp.com/api/contacts';  // URL to web api

  constructor(public http: HttpClient) {
    console.log('Hello ContactsProvider Provider');
  }

  /** GET Contacts from the server */
  getContacts (): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.contactUrl)
      .pipe(
        tap(contact => console.log(`fetched Contacts`)),
        catchError(this.handleError('getContacts', []))
      );
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
