import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';

export interface JsonplaceholderInterface {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface ObsJsonplaceholderInterface {
  success?: JsonplaceholderInterface[];
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FakeService {

  constructor(private http: HttpClient) { }

  getDataByIdV1(id: number): Observable<JsonplaceholderInterface[]> {
    return this.http.get<JsonplaceholderInterface[]>(`https://jsonplaceholder.typicode.com/todos/${id}`);
  }

  getDataByIdV2(id: number): Observable<ObsJsonplaceholderInterface> {
    return this.http
      .get<JsonplaceholderInterface[]>(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .pipe(
        map((jsonplaceholder: JsonplaceholderInterface[]) => ({
          success: jsonplaceholder,
        })),
        catchError(() => of({ error: 'Unable to load jsonplaceholder' }))
      );
  }

  getDataByIdV3(id: number): Observable<ObsJsonplaceholderInterface> {
    return this.http
      .get<JsonplaceholderInterface[]>(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .pipe(
        tap((data: JsonplaceholderInterface[]) => data),
        catchError(this.handleError('Failedto fetch dat'))
      );
  }

  postDataByIdV1(id: number, data: JsonplaceholderInterface): Observable<JsonplaceholderInterface> {
    return this.http.post<JsonplaceholderInterface>(`https://jsonplaceholder.typicode.com/todos/${id}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  private handleError(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<any> => {

      // TODO: send the error to remote logging infrastructure
      // console.log(error); // log to console instead

      const message = `server returned code ${error.status} with body "${error.error}"`;
      // TODO: batter job os transforming error for user consumption
      throw new Error(`${operation} failed: ${message}`);

    }
  }
}
