import { Injectable } from '@angular/core';

import { i18n } from './module/i18n.module';

declare var $: any;

@Injectable()

export class PopupService {
    fCallback: (_bConfirm: boolean) => any;
    w: (_sWord: string, _nPluralIndicator?: number) => string;
    s: (_sSentence: string, ..._aWord: any[]) => string;
    p: (_sSentence: string, _nPluralIndicator: number, ..._aWord: any[]) => string;
    
    constructor() {
        this.w = i18n.get;
        this.s = i18n.sentence;
        this.p = i18n.pluralsentence;
    }
    
    onClickModalPrimary() {
        if(this.fCallback !== null) {
            this.fCallback(true);
        }
        $('#grader-modal').modal('hide');
    }

    onClickModalSecondary() {
        if(this.fCallback !== null) {
            this.fCallback(false);
        }
        $('#grader-modal').modal('hide');
    }
    
    alert(_sMessage: string) {
        $('#grader-modal .modal-title').text(_sMessage);
        $('#grader-modal .modal-footer .btn-primary').text(this.w('gotit'));
        $('#grader-modal .modal-footer .btn-link').addClass('hidden-xs-up');
        this.fCallback = null;
        $('#grader-modal').modal('show');
    }
    
    confirm(_sMessage: string, _bNoYesInsteadOfCancelOk: boolean = true, _fCallback: (_bConfirm: boolean) => any = null) {
        this.fCallback = _fCallback;
        $('#grader-modal .modal-title').text(_sMessage);
        $('#grader-modal .modal-footer .btn-link').removeClass('hidden-xs-up');
        if(_bNoYesInsteadOfCancelOk) {
            $('#grader-modal .modal-footer .btn-primary').text(this.w('true'));
            $('#grader-modal .modal-footer .btn-link').text(this.w('false'));
        } else {
            $('#grader-modal .modal-footer .btn-primary').text(this.w('gotit'));
            $('#grader-modal .modal-footer .btn-link').text(this.w('abort'));
        }
        $('#grader-modal').modal('show');
    }
}