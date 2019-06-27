import { AppConfig } from 'src/app/app.config';

/* 
const preUrl:string = "http://tstvar.i2tsa.com.ar:3000/";
const preUrlTesting:string = "http://tstvar.i2tsa.com.ar:3005/";
const preUrlImage:string = "http://172.30.0.129:5002/";
*/
//export const PreUrl = this.config.getConfig('api_url');
//export const PreUrlImage = this.config.getConfig('api_url');

export class PreUrl {

  //api_url_var: string;
  static api_url_var: string;

  constructor(private config: AppConfig){
    PreUrl.api_url_var = this.config.getConfig('api_url');
}

  static getUrl(): string {
    return PreUrl.api_url_var
    //throw new Error("Method not implemented.");
  }
    

}
