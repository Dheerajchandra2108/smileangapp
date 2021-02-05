import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getTime(start, end){
    return (end - start).toFixed(2);
  }

  getPatients() {
    let timeStart = performance.now();
    let response = this.httpClient.get(environment.queryURI + '/Patient',
    { headers: this.getHeaders() });
    let timeEnd = performance.now();
    return {"response": response, "timeTaken": this.getTime(timeStart, timeEnd)};
  }

  getPatientsByDob() {
    let timeStart = performance.now();
    let response =  this.httpClient.get(environment.queryURI + '/Patient?birthdate=gt1959-12-31&birthdate=lt1966-01-01&_sort=birthdate', 
    { headers: this.getHeaders() });
    let timeEnd = performance.now();
    return {"response": response, "timeTaken": this.getTime(timeStart, timeEnd)};
  }
  
  getPatientsByNameDob(name, dob) {
    let timeStart = performance.now();
    let response =  this.httpClient.get(environment.queryURI + '/Patient?birthdate=' + dob + '&name=' + name, 
    { headers: this.getHeaders() });
    let timeEnd = performance.now();
    return {"response": response, "timeTaken": this.getTime(timeStart, timeEnd)};
  }

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/fhir+json'
    });
    return headers;
  }
}


