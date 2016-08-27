import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'convertSecondsToDate'
})
export class ConvertSecondsToDatePipe implements PipeTransform {
    transform(_nSeconds: number) {
        return new Date(0, 0, 0).setSeconds(_nSeconds);
    }
}