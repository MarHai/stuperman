import { Component, Renderer } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

import { Catalogue } from '../model/catalogue';
import { Criteria } from '../model/criteria';
import { Rating } from '../model/rating';
import { CriteriaInCatalogue } from '../model/criteria_in_catalogue';

import { QuicklinkComponent } from '../directive/quicklink.component';
import { EditComponent } from '../directive/edit.component';
import { DeleteComponent } from '../directive/delete.component';
import { AddComponent } from '../directive/add.component';
import { FocusDirective } from '../directive/focus.directive';
import { SortDirective } from '../directive/sort.directive';

declare var $: any;

@Component({
    selector: 'catalogue',
    templateUrl: '../../tmpl/catalogue.component.html',
    inputs: [ 'sFind' ]
})

export class CatalogueComponent extends _Component {
    sFind: string = '';
    oCatalogue: Catalogue;
    bDisplayCreate: boolean = false;
    
    aCriteria: Criteria[];
    bFind: boolean = false;
    nActiveIndex: number = -1;
    aResult: Criteria[] = [];
    
    private oRenderer: Renderer;
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService, _oRenderer: Renderer) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
        this.oRenderer = _oRenderer;
    }
    
    ngOnInit() {
        this.oRoute.params.forEach( (_aParam: Params) =>  {
                this.oCatalogue = this.oDataService.getCatalogues(+_aParam['nCatId'])[0];
                this.aCriteria = this.oDataService.getCriteria();
            });
    }
    
    getCourses() {
        let aCourse: string[] = [];
        this.oCatalogue.aRating.forEach( (_oRating: Rating) => {
                if(aCourse.indexOf(_oRating.oCourse.getName()) < 0) {
                    aCourse.push(_oRating.oCourse.getName());
                }
            });
        if(aCourse.length > 1) {
            aCourse.sort();
        }
        return aCourse;
    }
    
    getEmptyCriteria() {
        return new Criteria({});
    }
    
    onClickCriteria(_oCriteria: Criteria, _oModal: any) {
        this.onCriteriaAdd({ oItem: _oCriteria });
        $(_oModal).modal('hide');
    }

    setActive(_nActiveIndex: number) {
        if(this.aResult.length == 0) {
            this.nActiveIndex = -1;
        } else if(typeof(this.aResult[_nActiveIndex]) === 'undefined') {
            this.nActiveIndex = _nActiveIndex < 0 ? this.aResult.length - 1 : 0;
        } else {
            this.nActiveIndex = _nActiveIndex;
        }
    }
    
    onSearch(_oEvent: any, _oModal: any) {
        switch(_oEvent.keyCode) {
            case 13: //enter
                _oEvent.preventDefault();
                _oEvent.stopPropagation();
                if(this.nActiveIndex >= 0 && typeof(this.aResult[this.nActiveIndex]) !== 'undefined') {
                    this.onClickCriteria(this.aResult[this.nActiveIndex], _oModal);
                }
                break;
            case 38: //up
                this.setActive(this.nActiveIndex < 0 ? this.aResult.length - 1 : this.nActiveIndex - 1);
                break;
            case 40: //down
                this.setActive(this.nActiveIndex < 0 ? 0 : this.nActiveIndex + 1);
                break;
            default:
                this.aResult = [];
                this.nActiveIndex = -1;
                this.sFind = this.sFind.trim();
                if(this.sFind.length > 0) {
                    this.aCriteria.forEach( (_oCriteria: Criteria) => {
                            let bFound = false;
                            this.oCatalogue.aCriteriaInCatalogue.forEach( (_oCriteriaInCatalogue: CriteriaInCatalogue) => {
                                    if(_oCriteriaInCatalogue.nCriId == _oCriteria.nId) {
                                        bFound = true;
                                    }
                                });
                            if(!bFound && _oCriteria.getName().toLowerCase().indexOf(this.sFind.toLowerCase()) >= 0) {
                                this.aResult.push(_oCriteria);
                            }
                        });
                }
                break;
        }
    }
    
    onClickFind() {
        this.bFind = true;
    }
    
    onClickAdd(_oElem: any, _bReallyCreate: boolean = false) {
        if(_bReallyCreate) {
            $(_oElem).modal('hide');
            this.bDisplayCreate = true;
        } else {
            this.bFind = false;
            $(_oElem).modal('show');
        }
    }
    
    onCriteriaAdd(_oEvent: any) {
        this.oDataService.addItem(new CriteriaInCatalogue({ nCatId: this.oCatalogue.nId, nCriId: (<Criteria>_oEvent.oItem).nId }), 
                                  ( _bSuccess: boolean) => {
                if(!_bSuccess) {
                    this.oPopupService.alert(this.s('error.add', this.w('cat2cri')));
                }
            });
    }
	
	onCriteriaInCatalogueClick(_oCriteriaInCatalogue: CriteriaInCatalogue) {
		this.oRouter.navigate([ 'app', 'catalogue', _oCriteriaInCatalogue.nCatId, 'criteria', _oCriteriaInCatalogue.nId ]);
    }
    
    onQuicklinkChange(_oEvent: any) {
        this.oRouter.navigate([ 'app', 'course', this.oCatalogue.aRating.filter( (_oRating: Rating) => _oRating.oCourse.getName() == _oEvent.sLink)[0].oCourse.nId ]);
    }
}
