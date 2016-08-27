import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { DataService } from './data.service';
import { PopupService } from './popup.service';
import { _Component } from './_.component';

import { Observable } from 'rxjs/Rx';

import { SearchComponent } from './directive/search.component';
import { ImprintComponent } from './directive/imprint.component';

import { i18n } from './module/i18n.module';

declare var $: any;

@Component({
    templateUrl: '../tmpl/app.component.html'
})

export class AppComponent extends _Component {
    bLogin: boolean = false;
    
    nTimeUntilAutoLogout: number = null; //sec
    nTimeUntilAutoLogoutPreflight: number = 0; //sec
    private oTimerLogin: any;
    private nStartingTimeUntilAutoLogout: number = 180; //3min in sec
    private nPreflightTimeUntilAutoLogout: number = 1620; //27min in sec
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
        //on router-link change restart counting auto-logout
        this.oRouter.events.subscribe( (_oEvent: NavigationStart | NavigationEnd | NavigationCancel | NavigationError) => {
                if(_oEvent instanceof NavigationStart) {
                    this.onClickStayLoggedIn();
                }
            });
        //now try to either auto-login or set login status to be true
        if(this.oDataService.isLoggedIn()) {
            this.setLoggedIn();
        } else {
            this.oDataService.checkPriorLogin( (_bLogin: boolean) => {
                    if(_bLogin) {
                        this.setLoggedIn();
                        if('/app/' + this.getCurrentModule() != this.oRouter.url) {
                            this.oRouter.navigateByUrl('/app/' + this.getCurrentModule());
                        } else {
                            this.oRouter.navigateByUrl('/app');
                        }
                    } else {
                        this.oRouter.navigate([ 'login' ]);
                    }
                });
        }
    }
    
    setLoggedIn() {
        this.bLogin = true;
        let oUser = this.oDataService.getCurrentUser();
        i18n.setLanguage(oUser.eLanguage);
        i18n.setDialect(oUser.eDialect);
        this.oTimerLogin = Observable.timer(1000, 1000);
        this.oTimerLogin.subscribe( (_nNr: number) => {
                this.nTimeUntilAutoLogoutPreflight++;
                if(this.nTimeUntilAutoLogoutPreflight > this.nPreflightTimeUntilAutoLogout) {
                    if(this.nTimeUntilAutoLogout === null) {
                        this.nTimeUntilAutoLogout = this.nStartingTimeUntilAutoLogout;
                        $('#grader-autologout').modal('show');
                    }
                    this.nTimeUntilAutoLogout--;
                    if(this.nTimeUntilAutoLogout <= 0) {
                        this.onClickLogout();
                    }
                }
            });
    }
    
    onClickModalPrimary() {
        this.oPopupService.onClickModalPrimary();
    }

    onClickModalSecondary() {
        this.oPopupService.onClickModalSecondary();
    }
    
    onClickStayLoggedIn() {
        this.nTimeUntilAutoLogout = null;
        this.nTimeUntilAutoLogoutPreflight = 0;
        $('#grader-autologout').modal('hide');
    }
    
    onClickLogout() {
        $('#grader-autologout').modal('hide');
        this.oRouter.navigate([ 'logout' ]);
    }
    
    getCurrentYear() {
        return (new Date()).getFullYear();
    }
	
	getLoggedInUser() {
		return this.oDataService.getCurrentUser();
	}
    
    getCurrentModule() {
        let sPath = this.oRouter.url.replace('/app/', '').split('/')[0];
        if(sPath.substr(-1) != 's') {
            sPath += 's';
        }
        return sPath;
    }
    
    isCurrentModule(_sModule: string) {
        return _sModule.toLowerCase() == this.getCurrentModule();
    }
}