import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from './data.service';
import { PopupService } from './popup.service';
import { _Component } from './_.component';

import { User } from './model/user';
import { Email } from './model/email';
import { System } from './model/system';

import { i18n } from './module/i18n.module';

import { EditComponent } from './directive/edit.component';
import { DeleteComponent } from './directive/delete.component';
import { AddComponent } from './directive/add.component';
import { EmailAddComponent } from './directive/email_add.component';

import { DatetimeStringifyPipe } from './pipe/datetime_stringify.pipe';

declare var CryptoJS: any;

@Component({
    selector: 'profile',
    templateUrl: '../tmpl/profile.component.html'
})

export class ProfileComponent extends _Component {
    oUser: User;
    
    private nPasswordMinLength = 6;
    
    sPasswordNew1: string = '';
    sPasswordNew2: string = '';
    sPasswordError: string = '';
    bVolatile: boolean = false;
    
    aSystem: System[] = [];
    
    aUser: User[] = [];
    bPasswordRegenerationInProgress: boolean = false;
    oUserListedEmails: User;
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
        this.oUser = this.oDataService.getCurrentUser();
        if(this.oUser.bAdmin) {
            this.aUser = this.oDataService.getUsers();
            this.aUser.sort(this.oUser.sort);
            this.aSystem = this.oDataService.getSystems();
            this.aSystem.sort(this.aSystem[0].sort);
        }
    }
    
    getEmptySystem() {
        return new System({});
    }
    
    getEmptyUser() {
        return new User({});
    }
    
    getLanguageOptions() {
        return i18n.getLanguageOptions();
    }
    
    getDialectOptions() {
        return i18n.getDialectOptions();
    }
    
    onChangeOfflineSync() {
        if(this.oUser.bOfflineSync) {
            this.oDataService.updateAllCache();
        } else {
            this.oDataService.clearCache();
        }
    }
    
    onClickUser(_oUserClicked: User) {
        if(this.oUserListedEmails && this.oUserListedEmails.nId == _oUserClicked.nId) {
            this.oUserListedEmails = null;
        } else {
            this.oUserListedEmails = _oUserClicked;
        }
    }
    
    getMails(_oUser: User) {
        let aMail: Email[] = [];
        this.oDataService.getEmails().forEach( (_oMail: Email) => {
                if(_oMail.nRecipientUseId == _oUser.nId) {
                    aMail.push(_oMail);
                }
            });
        return aMail;
    }
    
    onClickRegeneratePassword(_oUser: User) {
        this.oPopupService.confirm(this.s('profilepwregenerate', _oUser.getName()), true, (_bConfirm: boolean) => {
                if(_bConfirm) {
                    this.bPasswordRegenerationInProgress = true;
                    this.oDataService.changePassword(JSON.stringify({ nUseId: _oUser.nId }), (_bSuccess: boolean) => {
                            if(!_bSuccess) {
                                this.oPopupService.alert(this.w('error.reload'));
                            }
                            this.bPasswordRegenerationInProgress = false;
                        });
                }
            });
    }
    
    onPasswordChange() {
        if(this.sPasswordNew1 == '' || this.sPasswordNew2 == '') {
            this.sPasswordError = this.w('error.passwordempty');
        } else if(this.sPasswordNew1 != this.sPasswordNew2) {
            this.sPasswordError = this.w('error.passwordunequal');
        } else if(this.sPasswordNew1.length < this.nPasswordMinLength) {
            this.sPasswordError = this.s('error.passwordtooshort', this.nPasswordMinLength);
        } else if(this.sPasswordNew1.match(/[a-z]/g) === null) {
            this.sPasswordError = this.w('error.passwordmisseslower');
        } else if(this.sPasswordNew1.match(/[A-Z]/g) === null) {
            this.sPasswordError = this.w('error.passwordmissesupper');
        } else if(this.sPasswordNew1.match(/[0-9]/gi) === null) {
            this.sPasswordError = this.w('error.passwordmissesnr');
        } else {
            this.sPasswordError = '';
        }
        
        if(this.sPasswordError == '') {
            this.bVolatile = true;
            this.oDataService.changePassword(JSON.stringify({ sPassword: CryptoJS.MD5(this.sPasswordNew1).toString() }), (_bSuccess: boolean) => {
                    if(_bSuccess) {
                        this.oDataService.logout();
                        this.oRouter.navigate(['logout']);
                    } else {
                        this.oPopupService.alert(this.w('error.update'));
                    }
                    this.bVolatile = false;
                });
            this.sPasswordNew1 = '';
            this.sPasswordNew2 = '';
        }
    }
}
