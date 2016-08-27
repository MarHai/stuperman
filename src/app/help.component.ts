import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from './data.service';
import { PopupService } from './popup.service';
import { _Component } from './_.component';

import { NewLinePipe } from './pipe/nl.pipe';
import { MarkdownPipe } from './pipe/markdown.pipe';

@Component({
    templateUrl: '../tmpl/help.component.html',
    pipes: [
        NewLinePipe,
		MarkdownPipe
    ]
})

export class HelpComponent extends _Component {
    aHelp: { sQ: string, sA: string }[];
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
        this.aHelp = [];
        let oQA = this.getQAobject();
        while(oQA !== null) {
            this.aHelp.push(oQA);
            oQA = this.getQAobject(this.aHelp.length + 1);
        }
    }
    
    private getQAobject(_nI: number = 1) {
        var oReturn = {
            sQ: this.w('help.' + (_nI < 10 ? ('0' + _nI.toString()) : _nI.toString()) + '.q'),
            sA: this.w('help.' + (_nI < 10 ? ('0' + _nI.toString()) : _nI.toString()) + '.a')
        };
        return oReturn.sQ != '' && oReturn.sA != '' ? oReturn : null;
    }
}