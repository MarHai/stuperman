import {Pipe, PipeTransform} from '@angular/core';
import { DomSanitizationService } from '@angular/platform-browser';

declare var showdown: any;

@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {
    oSanitizer: DomSanitizationService;
    
    constructor(_oSanitizer: DomSanitizationService) {
        this.oSanitizer = _oSanitizer;
    }
    
    transform(_sValue: string) {
        return this.oSanitizer.bypassSecurityTrustHtml((new showdown.Converter()).makeHtml(_sValue));
    }
}