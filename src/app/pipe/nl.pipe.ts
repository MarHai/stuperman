import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'nl'
})
export class NewLinePipe implements PipeTransform {
    transform(_sValue: string) {
        return _sValue.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
}