import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'toDate'
})
export class ToDatePipe implements PipeTransform {

  transform(value: any) : string {
    let result: string =  moment(value).format("DD/MM/YYYY");
    return result;
  }

}
