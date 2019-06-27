//import { Injectable, Inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
//import { from, Observable } from 'rxjs';
//import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { AppConfig } from 'src/app/app.config';

export class GenericoService {
  constructor(protected config : AppConfig) { }

  getToken() : string {
    return localStorage.getItem('TOKEN')
  }

  getConfig(key : string) : string {
    return this.config.getConfig(key)
  }

  getApiUrl() : string {
    return this.getConfig("api_url");
  }

  getGenericJsonHeader() : Object {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token': this.getToken()
      })
    }
  }

  processResponse(data : any, ... options) : any[] {
    // console.log("RESPONSE", data)
    let response : any[] = [];
    if(data['returnset'][0].RCode === 1){
      response = data['dataset']    
    } else {
      let error : string = `WS Error: ${options ? options.toString() : ""} ${data['returnset'][0].RTxt}`;
      console.error(error);
      response.push({error: data['returnset'][0].RTxt});
    }
    return response
  }
}
