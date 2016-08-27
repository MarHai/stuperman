import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { DataService } from './data.service';
import { PopupService } from './popup.service';
import { _Component } from './_.component';

import { FocusDirective } from './directive/focus.directive';
import { ImprintComponent } from './directive/imprint.component';

declare var $: any;

@Component({
    templateUrl: '../tmpl/home.component.html',
    styleUrls: [
        '../style/home.scss'
    ]
})

export class HomeComponent extends _Component {
    sName: string;
    sMail: string;
    sSubject: string = 'Frage';
    sMessage: string;
    
    bValidName: boolean = true;
    bValidMail: boolean = true;
    bValidMessage: boolean = true;
    
    bSending: boolean = false;
    
    sUser: string;
    sPassword: string;
    bLoggingIn = false;
    bLogin = false;
    
    bNavbarLight: boolean = false;
    bBackToTop: boolean = false;
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
        if(this.oRouter.url && this.oRouter.url.indexOf('login') > 0) {
            this.bLogin = true;
        }
    }
    
    ngOnInit() {
        this.oDataService.checkPriorLogin( (_bLogin: boolean) => {
            if(_bLogin) {
                this.login();
            }
        });
        this.toggleNavbar();
    }
    
    toggleNavbar(_oEvent?: any) {
        let nWidth: number = $(window).width();
        let nScroll: number = $(document).scrollTop();
        if(nWidth > 1024) {
            if(nScroll > 150) {
                this.bNavbarLight = true;
            } else {
                this.bNavbarLight = false;
            }
        }
        if(nWidth > 992) {
            if(nScroll > 300) {
                this.bBackToTop = true;
            } else {
                this.bBackToTop = false;
            }
        }
    }
    
    checkLogin() {
        if(this.sUser != '' && this.sPassword != '') {
            this.onChangeMode('login-process');
            this.oDataService.login((_nStatus: number) => {
                    if(_nStatus == 1) {
                        this.login();
                    } else if(_nStatus == 0) {
                        this.bLoggingIn = false;
                        this.oPopupService.alert(this.w('error.login'));
                    }
                }, this.sUser, this.sPassword);
        }
    }
    
    private login() {
        this.oRouter.navigate([ 'app', 'courses' ]);
    }
    
    getCurrentYear() {
        return (new Date()).getFullYear();
    }
    
    onClickScroll(_sScrollToElement: string = '') {
        $(window).scrollTop(_sScrollToElement == '' ? 0 : $('#' + _sScrollToElement).offset().top);
    }
    
    onClickImprint() {
        $('grader-imprint > a').get(0).click();
    }
    
    onChangeMode(_sMode: string) {
        switch(_sMode) {
            case 'login-process':
                this.bLoggingIn = true;
                //no break here as it should also be login mode
            case 'login-form':
                this.bLogin = true;
                break;
            case 'home':
                this.bLogin = false;
                break;
        }
    }
    
    onContact() {
        this.sName = (this.sName || '').trim();
        this.sMail = (this.sMail || '').trim().toLowerCase();
        this.sSubject = (this.sSubject || '').trim();
        this.sMessage = (this.sMessage || '').trim();
        let nError = 0;
        if(this.sName == '') {
            nError++;
            this.bValidName = false;
        } else {
            this.bValidName = true;
        }
        if(this.sSubject == '') {
            nError++;
        }
        if(this.sMessage == '') {
            nError++;
            this.bValidMessage = false;
        } else {
            this.bValidMessage = true;
        }
        if(this.sMail == '' || this.sMail.match(/^(([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9.])|([-])){2,63}[.](([a-zA-Z0-9]){2,63})+$/gi) === null) {
            nError++;
            this.bValidMail = false;
        } else {
            this.bValidMail = true;
        }
        if(nError <= 0) {
            this.bSending = true;
            this.oDataService.sendContactMail(this.sName + '<' + this.sMail + '>', this.sSubject, this.sMessage, (_bSuccess: boolean) => {
                    if(_bSuccess) {
                        this.oPopupService.alert(this.w('mail'));
                        this.sMessage = '';
                    } else {
                        this.oPopupService.alert(this.w('error.mail'));
                    }
                    this.bSending = false;
                });
        } else {
            this.oPopupService.alert(this.w('error.misinformation', nError));
        }
    }
}