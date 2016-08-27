import { Component, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

@Component({
    selector: 'grader-quicklink',
    templateUrl: '../../tmpl/quicklink.component.html',
    inputs: [
        'aLink'
    ],
    outputs: [
        'onSelect'
    ]
})

export class QuicklinkComponent extends _Component {
    aLink: string[];
    onSelect = new EventEmitter(true);
    sLinkActive = '';
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    onClick(_sLink: string) {
        this.sLinkActive = _sLink;
        this.onSelect.next({ sLink: _sLink });
    }
}