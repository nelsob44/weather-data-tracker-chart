import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { WeatherData } from '../models/weather-data';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private _results = new BehaviorSubject<WeatherData[]>([]);

  get results() {
    return this._results.asObservable();
  }

  constructor(private http: HttpClient) { }

  fetchResults(metric: string, location: string, year: number, month1: number, month2: number) {
    //construct the url for sending request
    const url = environment.baseUrl + `${metric}-${location}` + '.json';
    
    //reach out to the API to obtain data
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          const dataSet: any = []; 
          result.forEach((el: WeatherData) => {
            if(el.year == year) {
              dataSet.push(el);
            }
          });
          this._results.next(dataSet);
          return dataSet;
        })
      );
  }
}
