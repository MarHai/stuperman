import {Pipe, PipeTransform} from '@angular/core';
import { i18n } from '../module/i18n.module';

@Pipe({
  name: 'datetimeStringify'
})
export class DatetimeStringifyPipe implements PipeTransform {
    transform(_dTransform: Date) {
        let nTimestampTransform = Math.round(_dTransform.getTime()/1000);
        let nTimestampNow = Math.round((new Date()).getTime()/1000);
        let nDifference = nTimestampNow - nTimestampTransform;
        if(nDifference < 15) {
            return i18n.sentence('timeago', i18n.get('few'), i18n.get('sec', 2));
        } else if(nDifference < 55) {
            return i18n.sentence('timeago', nDifference.toString(), i18n.get('sec', nDifference));
        } else if(nDifference < 75) {
            return i18n.sentence('timeago', '1', i18n.get('min'));
        } else if(nDifference < 15*60) {
            return i18n.sentence('timeago', i18n.get('few'), i18n.get('min', 2));
        } else if(nDifference < 75*60) {
            return i18n.sentence('timeago', '1', i18n.get('hour'));
        } else if(nDifference < 3*3600) {
            return i18n.sentence('timeago', i18n.get('few'), i18n.get('hour', 2));
        } else if(nDifference < 22*3600) {
            return i18n.sentence('timeago', Math.round(nDifference/3600).toString(), i18n.get('hour', 2));
        } else if(nDifference < 26*3600) {
            return i18n.sentence('timeago', '1', i18n.get('day'));
        } else if(nDifference < 6*86400) {
            return i18n.sentence('timeago', Math.round(nDifference/86400).toString(), i18n.get('day', 2));
        } else if(nDifference < 8*86400) {
            return i18n.sentence('timeago', '1', i18n.get('week'));
        } else if(nDifference < 3.5*604800) {
            return i18n.sentence('timeago', Math.round(nDifference/604800).toString(), i18n.get('week', 2));
        } else if(nDifference < 4.5*604800) {
            return i18n.sentence('timeago', '1', i18n.get('month'));
        } else if(nDifference < 11.5*2592000) {
            return i18n.sentence('timeago', Math.round(nDifference/2592000).toString(), i18n.get('month', 2));
        } else if(nDifference < 12.5*2592000) {
            return i18n.sentence('timeago', '1', i18n.get('year'));
        } else {
            return _dTransform.toLocaleDateString() + ', ' + _dTransform.toLocaleTimeString();
        }
    }
}