import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

import { Course } from '../model/course';
import { Student } from '../model/student';
import { Rating } from '../model/rating';
import { Catalogue } from '../model/catalogue';
import { CriteriaInCatalogue } from '../model/criteria_in_catalogue';

@Component({
    selector: 'grader-search',
    templateUrl: '../../tmpl/search.component.html',
    inputs: [ 'sQuery' ]
})

export class SearchComponent extends _Component {
    sQuery: string = '';
    aCourse: Course[] = [];
    aRating: Rating[] = [];
    aStudent: Student[] = [];
    aCatalogue: Catalogue[] = [];
    aCriteriaInCatalogue: CriteriaInCatalogue[] = [];
    
    private sLastSearch = '';
    private nActiveIndex = -1;
    private aResult: Object[];
    private nMax = 5;
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    onKey(_oEvent: any) {
        switch(_oEvent.keyCode) {
            case 27: //esc
                this.sQuery = '';
                break;
            case 13: //enter
                if(this.nActiveIndex >= 0 && typeof(this.aResult[this.nActiveIndex]) !== 'undefined') {
                    this.sQuery = '';
                    switch(this.aResult[this.nActiveIndex]['sType']) {
                        case 'student':
                            this.oRouter.navigate(['app', 'student', this.aResult[this.nActiveIndex]['nId'] ]);
                            break;
                        case 'course':
                            this.oRouter.navigate(['app', 'course', this.aResult[this.nActiveIndex]['nId'] ]);
                            break;
                        case 'rating':
                            this.oRouter.navigate(['app', 'course', 
                                this.aRating.filter( (_oRating) => _oRating.nId == this.aResult[this.nActiveIndex]['nId'])[0].oCourse.nId, 
                                'rating',
                                this.aResult[this.nActiveIndex]['nId']
                            ]);
                            break;
                        case 'catalogue':
                            this.oRouter.navigate(['app', 'catalogue', this.aResult[this.nActiveIndex]['nId'] ]);
                            break;
                        case 'cat2cri':
                            let oCriteriaInCatalogue = this.aCriteriaInCatalogue.filter( (_oC2C) => _oC2C.nId == this.aResult[this.nActiveIndex]['nId'])[0];
                            this.oRouter.navigate([ 'app', 'catalogue', oCriteriaInCatalogue.nCatId, 'criteria', oCriteriaInCatalogue.nId ]);
                            break;
                    }
                }
                break;
            case 38: //up
                this.setActive(this.nActiveIndex < 0 ? this.aResult.length - 1 : this.nActiveIndex - 1);
                break;
            case 40: //down
                this.setActive(this.nActiveIndex < 0 ? 0 : this.nActiveIndex + 1);
                break;
            default:
                this.onSearch();
                break;
        }
    }
    
    isActive(_sType: string, _nId: number) {
        if(this.nActiveIndex >= 0 && this.nActiveIndex < this.aResult.length) {
            return this.aResult[this.nActiveIndex]['sType'] == _sType && this.aResult[this.nActiveIndex]['nId'] == _nId;
        } else {
            return false;
        }
    }
    
    setActive(_nResultIndex: number) {
        if(this.aResult.length == 0) {
            this.nActiveIndex = -1;
        } else if(typeof(this.aResult[_nResultIndex]) === 'undefined') {
            this.nActiveIndex = _nResultIndex < 0 ? this.aResult.length - 1 : 0;
        } else {
            this.nActiveIndex = _nResultIndex;
        }
    }
    
    onSearch() {
        let sQ = this.sQuery.trim().toLowerCase();
        if(sQ != this.sLastSearch) {
            this.sLastSearch = sQ;
            this.aResult = [];
            if(sQ != '') {
                this.searchStudents(sQ);
                this.searchCourses(sQ);
                this.searchRatings(sQ);
                this.searchCatalogues(sQ);
                this.searchCriteriaInCatalogues(sQ);
                this.setActive(0);
            }
        }
    }
	
	onClickResult() {
        this.sQuery = '';
	}
    
    private searchCourses(_sQ: string) {
        this.aCourse = [];
        for(let oCourse of this.oDataService.getCourses()) {
            if(oCourse.sName.toLowerCase().indexOf(_sQ) >= 0 && this.aCourse.length < this.nMax) {
                this.aCourse.push(oCourse);
                this.aResult.push({ sType: 'course', nId: oCourse.nId });
            }
        }
    }
    
    private searchStudents(_sQ: string) {
        this.aStudent = [];
        for(let oStudent of this.oDataService.getStudents()) {
            if(oStudent.sName.toLowerCase().indexOf(_sQ) >= 0 && this.aStudent.length < this.nMax) {
                this.aStudent.push(oStudent);
                this.aResult.push({ sType: 'student', nId: oStudent.nId });
            }
        }
    }
    
    private searchRatings(_sQ: string) {
        this.aRating = [];
        for(let oRating of this.oDataService.getRatings()) {
            if(oRating.sName.toLowerCase().indexOf(_sQ) >= 0 && this.aRating.length < this.nMax) {
                this.aRating.push(oRating);
                this.aResult.push({ sType: 'rating', nId: oRating.nId });
            }
        }
    }
    
    private searchCatalogues(_sQ: string) {
        this.aCatalogue = [];
        for(let oCatalogue of this.oDataService.getCatalogues()) {
            if(oCatalogue.sName.toLowerCase().indexOf(_sQ) >= 0 && this.aCatalogue.length < this.nMax) {
                this.aCatalogue.push(oCatalogue);
                this.aResult.push({ sType: 'catalogue', nId: oCatalogue.nId });
            }
        }
    }
    
    private searchCriteriaInCatalogues(_sQ: string) {
        this.aCriteriaInCatalogue = [];
        for(let oCriteriaInCatalogue of this.oDataService.getCriteriaInCatalogues()) {
            if(oCriteriaInCatalogue.oCriteria.sName.toLowerCase().indexOf(_sQ) >= 0 && this.aCriteriaInCatalogue.length < this.nMax) {
                this.aCriteriaInCatalogue.push(oCriteriaInCatalogue);
                this.aResult.push({ sType: 'cat2cri', nId: oCriteriaInCatalogue.nId });
            }
        }
    }
}
