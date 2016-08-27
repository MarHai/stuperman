import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

import { Catalogue } from '../model/catalogue';
import { Rating } from '../model/rating';
import { RatingPerStudentInCourse } from '../model/rating_per_student_in_course';

import { QuicklinkComponent } from '../directive/quicklink.component';
import { AddComponent } from '../directive/add.component';

import { Statistics } from '../module/statistics.module';

@Component({
    selector: 'catalogues',
    templateUrl: '../../tmpl/catalogues.component.html'
})

export class CataloguesComponent extends _Component {
    aCatalogue: Catalogue[];
    private sFilter: string = '';
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
        this.aCatalogue = this.oDataService.getCatalogues();
        if(this.aCatalogue.length > 1) {
            this.aCatalogue.sort(this.aCatalogue[0].sort);
        }
    }
    
    getEmptyCatalogue() {
        return new Catalogue({});
    }
    
    getCatalogues() {
        let aTemp = this.aCatalogue.filter( (_oCatalogue: Catalogue) => {
                if(this.sFilter == '') {
                    return true;
                } else {
                    return this.sFilter == this.w('inuse') ? _oCatalogue.aRating.length > 0 : _oCatalogue.aRating.length == 0;
                }
            });
        if(aTemp.length > 1) {
            aTemp.sort(aTemp[0].sort);
        }
        return aTemp;
    }
    
    getQuicklinks() {
        return [ this.w('inuse'), this.w('notinuse') ];
    }
    
    onQuicklinkChange(_oEvent: any) {
        this.sFilter = _oEvent.sLink;
    }
    
    onClickCatalogue(_oCatalogue: Catalogue) {
        this.oRouter.navigate(['app', 'catalogue', _oCatalogue.nId ]);
    }
    
    getMeanPoints(_oCatalogue: Catalogue) {
        let aPoint: number[] = [];
        for(let oRating of _oCatalogue.aRating) {
            for(let oRatingPerStudentInCourse of oRating.getRatingsFromFinalTry()) {
                if(oRatingPerStudentInCourse.bDone) {
                    aPoint.push(oRatingPerStudentInCourse.getSumOfPoints());
                }
            }
        }
        return Statistics.mean(aPoint);
    }
}
