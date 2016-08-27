import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';
import { DomSanitizationService, SafeUrl } from '@angular/platform-browser';


declare var Papa: any;

@Component({
    selector: 'grader-download-csv',
    template: '<a (click)="updateLink()" [href]="sLink" [download]="sFilename" class="{{sClass}}"><i class="fa fa-download"></i> {{sText}}</a>',
    inputs: [
        'aData',
        'aHead',
        'sFilename',
        'sClass',
        'sText'
    ]
})

export class DownloadCsvComponent extends _Component {
    aData: string[][];
    aHead: string[];
    sFilename: string;
    sClass: string = '';
    sText: string = '';
	sLink: SafeUrl;
    oSanitizer: DomSanitizationService;
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService, _oSanitizer: DomSanitizationService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
        this.oSanitizer = _oSanitizer;
    }
	
	ngOnInit() {
		this.updateLink();
		if(this.sFilename) {
			this.sFilename = this.sFilename.trim().toLowerCase().replace(/ /g, '_').replace(/[\/\\:*\?"\|<>ßäöü]/g, '') + '.csv';
		} else {
			let dNow = new Date();
			this.sFilename = 'stuperman-' + dNow.getFullYear().toString() + (dNow.getMonth() + 1).toString() + dNow.getDate().toString() + '.csv';
		}
	}
	
	updateLink() { 
		this.sLink = this.oSanitizer.bypassSecurityTrustUrl('data:text/csv;charset=utf-8,' + encodeURIComponent(Papa.unparse({ data: this.aData, fields: this.aHead })));
	}
}