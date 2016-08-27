import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from './data.service';
import { PopupService } from './popup.service';
import { _Component } from './_.component';

@Component({
    template: '<p>{{w(\'logout\')}} ...</p>'
})

export class LogoutComponent extends _Component {
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
        this.logout();
    }
    
    logout() {
        this.oDataService.logout();
        this.oRouter.navigate([ 'login' ]);
    }
}