import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DataService } from './data.service';
import { PopupService } from './popup.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { i18n } from './module/i18n.module';

export class _Component implements OnInit {
    w: (_sWord: string, _nPluralIndicator?: number) => string;
    s: (_sSentence: string, ..._aWord: any[]) => string;
    p: (_sSentence: string, _nPluralIndicator: number, ..._aWord: any[]) => string;
    
    oRouter: Router;
    oRoute: ActivatedRoute;
    oDataService: DataService;
    oPopupService: PopupService;
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        this.w = i18n.get;
        this.s = i18n.sentence;
        this.p = i18n.pluralsentence;
        this.oRouter = _oRouter;
        this.oRoute = _oRoute;
        this.oDataService = _oDataService;
        this.oPopupService = _oPopupService;
    }

    ngOnInit() {}
}