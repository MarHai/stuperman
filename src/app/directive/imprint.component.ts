import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

import { MarkdownPipe } from '../pipe/markdown.pipe';

declare var $: any;

@Component({
    selector: 'grader-imprint',
    templateUrl: '../../tmpl/imprint.component.html',
    pipes: [
		MarkdownPipe
    ],
    inputs: [
        'bDoNotShowLink'
    ]
})

export class ImprintComponent extends _Component {
    bDoNotShowLink: boolean = false;
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    onClick() {
        $('#imprint_modal').modal('show');
    }
}