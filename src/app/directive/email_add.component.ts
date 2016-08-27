import { Component, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

import { Student } from '../model/student';
import { User } from '../model/user';

declare var $: any;

@Component({
    selector: 'email-add',
    templateUrl: '../../tmpl/email_add.component.html',
    inputs: [
        'sTo',
        'sSubject',
        'sMessage',
        'sLink',
        'sLinkClass',
        'bIconOnly'
    ],
    outputs: [
        'onSend',
        'onOpen'
    ]
})

export class EmailAddComponent extends _Component {
    sTo: string = '';
    sSubject: string = '';
    sMessage: string = '';
    sLink: string = '';
    bIconOnly: boolean = false;
    sRecipientEmailAddress: string = '';
    aRecipientSelectionUser: User[] = [];
    aRecipientSelectionStudent: Student[] = [];
    
    bValidRecipient: boolean = true;
    bValidSubject: boolean = true;
    bValidMessage: boolean = true;
    
    bShowForm: boolean = false;
    bSending: boolean = false;
    
    onSend = new EventEmitter(true);
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
        if(this.sLink == '') {
            this.sLink = this.w('newmail');
        }
    }
    
    ngOnInit() {
        this.aRecipientSelectionStudent = this.oDataService.getStudents();
        if(this.aRecipientSelectionStudent.length > 1) {
            this.aRecipientSelectionStudent.sort(this.aRecipientSelectionStudent[0].sort);
        }
        this.aRecipientSelectionUser = this.oDataService.getUsers();
        if(this.aRecipientSelectionUser.length > 1) {
            this.aRecipientSelectionUser.sort(this.aRecipientSelectionUser[0].sort);
        }
        //in order to set current recipient's email address:
        this.onChangeRecipient(this.sTo);
    }
    
    onClickNew(_oModal: any) {
        this.bShowForm = true;
        $(_oModal).modal('show');
    }
    
    onClickAbort(_oModal: any) {
        this.bShowForm = false;
        $(_oModal).modal('hide');
    }
    
    onChangeRecipient(_sTo: string) {
        this.sTo = _sTo;
        if(this.sTo.indexOf('user') === 0) {
            let nId = +this.sTo.substr(5);
            this.sRecipientEmailAddress = (<User><any>(this.aRecipientSelectionUser.filter( (_oUser: User) => _oUser.nId == nId)[0])).sMail;
        } else if(this.sTo.indexOf('student') === 0) {
            let nId = +this.sTo.substr(8);
            this.sRecipientEmailAddress = (<Student><any>(this.aRecipientSelectionStudent.filter( (_oStudent: Student) => _oStudent.nId == nId)[0])).sMail;
        }
        this.bValidRecipient = this.sRecipientEmailAddress == '' ? false : true;
    }
    
    onClickSend(_oModal: any) {
        this.sSubject = this.sSubject.trim();
        this.bValidSubject = this.sSubject != '';
        this.sMessage = this.sMessage.trim();
        this.bValidMessage = this.sMessage != '';
        let oRecipient: any;
        if(this.sTo.indexOf('user') === 0) {
            let nId = +this.sTo.substr(5);
            oRecipient = <User><any>(this.aRecipientSelectionUser.filter( (_oUser: User) => _oUser.nId == nId)[0]);
        } else if(this.sTo.indexOf('student') === 0) {
            let nId = +this.sTo.substr(8);
            oRecipient = <Student><any>(this.aRecipientSelectionStudent.filter( (_oStudent: Student) => _oStudent.nId == nId)[0]);
        }
        if(!this.bSending && this.bValidSubject && this.bValidMessage && this.bValidRecipient) {
            this.bSending = true;
            this.oDataService.sendMail(oRecipient, this.sSubject, this.sMessage, (_bMail: boolean) => {
                    if(_bMail) {
                        this.onSend.next({ bSuccess: _bMail });
                        this.sSubject = '';
                        this.sMessage = '';
                        this.sTo = '';
                        this.onClickAbort(_oModal);
                    } else {
                        this.oPopupService.alert(this.w('error.mail'));
                    }
                    this.bSending = false;
                });
        } else {
            this.oPopupService.alert(this.w('error.misinformation', +this.bValidSubject + +this.bValidMessage + +this.bValidRecipient));
        }
    }
}