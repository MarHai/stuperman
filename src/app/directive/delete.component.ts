import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

import { Model } from '../model/_model';

@Component({
    selector: 'grader-delete',
    templateUrl: '../../tmpl/delete.component.html',
    inputs: [
        'oItem',
        'bIconOnly',
        'sLinkClass'
    ]
})

export class DeleteComponent<T extends Model> extends _Component {
    oItem: T;
    bIconOnly: boolean = false;
    sLinkClass: string = 'a btn btn-danger';
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
	
    onClickDelete() {
        this.oPopupService.confirm(this.s('delete.really', this.oItem.getName()), true, (_bConfirm: boolean) => {
                if(_bConfirm) {
                    this.oDataService.deleteItem(this.oItem, ( _bSuccess: boolean) => {
                            if(_bSuccess) {
                                window.history.back();
                            } else {
                                this.oPopupService.alert(this.w('error.delete'));
                            }
                        });
                }
            });
	}
}