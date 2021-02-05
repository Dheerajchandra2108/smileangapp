import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../app/services/api-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  form: FormGroup;
  title = 'fhir-app-test';
  entries = {};
  timeTaken = '0';

  constructor(
    private apiService: ApiService
  ) { }

  getDict(data){
    data['entry'].forEach(element => {
      let resource = element['resource'];
      let birthdate = "birthDate" in resource ? resource['birthDate'] : "-" ;
      let gender = "gender" in resource ? resource['gender'] : "-" ;
      let name = "name" in resource && resource['name'][0] !== undefined ? resource['name'][0] : "-" ;
      let family_name = "name" in resource && name['family'] !== undefined ? name['family'] : "-" ;
      let use_name = "name" in resource && name['use'] !== undefined ? name['use'] : "-" ;
      let given_name = "name" in resource && name['given'] !== undefined ? name['given'][0] : "-" ;
      let id = resource['id'];
      let address = "address" in resource ? resource['address'][0] : "-" ;
      let city = address != "" && address['city'] !== undefined ? address['city'] : "-";
      let country = address != "" && address['country'] !== undefined ? address['country'] : "-";
      let postal_code = address != "" && address['postalCode'] !== undefined? address['postalCode'] : "-";
      let address_type = address != "" && address['type'] !== undefined? address['type'] : "-";
      let use_address = address != "" && address['use'] !== undefined? address['use'] : "-";
      let lines = address != "" ? address['line'] : "-";
      
      let inner_dict = {};
      inner_dict = {
        'given_name': given_name,
        'family_name': family_name,
        'use_name': use_name,
        'gender': gender,
        'birth_date': birthdate,
        'city': city,
        'country': country,
        'postalCode': postal_code,
        'lines': lines,
        'address_type': address_type,
        'address_use': use_address
      }          
      this.entries[id] = inner_dict;
    });
    return this.entries
  }

  ngOnInit() {
    let promise = this.apiService.getPatients()
    promise['response'].subscribe(
      data => {
        this.getDict(data);
        this.timeTaken = promise['timeTaken'].toString();
      }
    )
  }

  changeAPI(){
    let promise = this.apiService.getPatientsByDob()
    this.apiService.getPatientsByDob()['response'].subscribe(
      data => {
        this.entries = {};
        this.getDict(data);
        this.timeTaken = promise['timeTaken'].toString();
      }
    )
  }

  getDate(dateObj){
    console.log(dateObj);
    if(dateObj['month'] < 10){
      dateObj['month'] = "0" + (dateObj['month'] + 1).toString()
    }
    if(dateObj['date'] < 10){
      dateObj['date'] = "0" + dateObj['date'].toString()
    }
    return dateObj['year'].toString() + "-" + dateObj['month'].toString() + "-" + dateObj['date'].toString()
  }

  call_name_dob_api(patient){
    console.log(patient.patient_dob);
    console.log(patient.patient_dob['_i']);
    let dob = patient.patient_dob['_i'].search('-') ? patient.patient_dob['_i'] : this.getDate(patient.patient_dob['_i']);
    console.log(dob);
    let promise = this.apiService.getPatientsByNameDob(patient.patient_name, dob)
    promise['response'].subscribe(
      data => {
        this.entries = {};
        this.getDict(data);
        this.timeTaken = promise['timeTaken'].toString();
      }
    )
  }
}