import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

import { CriteriaInCatalogue } from '../model/criteria_in_catalogue';

import { EditComponent } from '../directive/edit.component';
import { DeleteComponent } from '../directive/delete.component';

@Component({
    selector: 'criteria',
    templateUrl: '../../tmpl/criteria.component.html'
})

export class CriteriaComponent extends _Component {
    oCriteriaInCatalogue: CriteriaInCatalogue;
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
        this.oRoute.params.forEach( (_aParam: Params) =>  {
                this.oCriteriaInCatalogue = this.oDataService.getCriteriaInCatalogues(+_aParam['nC2CId'])[0];
            });
    }
}
