import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { CourseComponent } from './course.component';

import { Rating } from '../model/rating';
import { StudentInCourse } from '../model/student_in_course';
import { RatingPerStudentInCourse } from '../model/rating_per_student_in_course';
import { CriteriaInCatalogue } from '../model/criteria_in_catalogue';
import { Grade } from '../model/grade';

import { EditComponent } from '../directive/edit.component';
import { DeleteComponent } from '../directive/delete.component';
import { ChartComponent } from '../directive/chart.component';
import { DownloadCsvComponent } from '../directive/download_csv.component';
import { StudentInCourseComponent } from '../directive/student_in_course.component';

import { Statistics } from '../module/statistics.module';

declare var Chart: any;

@Component({
    selector: 'rating',
    templateUrl: '../../tmpl/rating.component.html'
})

export class RatingComponent extends CourseComponent {
    oRating: Rating;
    aPoint: number[] = [];
    aHistogramData: number[];
	
	aCsvData: string[][] = [];
	aCsvHead: string[] = [];
    
    nS2RIdForStudentInCourseToShow: number;
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
        this.oRoute.params.forEach( (_aParam: Params) =>  {
                this.oRating = this.oDataService.getRatings(+_aParam['nRatId'])[0];
                this.aPoint = this.getPointsForTry();
                this.aHistogramData = this.oRating.getHistogramData();
                this.setDownloadRatings();
            });
    }
    
    getPointsForTry(_nTry: number = null) {
        let aReturn: number[] = [];
        let aRatingsPerStudentInCourse = _nTry === null ? this.oRating.getRatingsFromFinalTry() : this.oRating.getRatings(0, _nTry);
        aRatingsPerStudentInCourse.forEach( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                if(_oRatingPerStudentInCourse.bDone) {
                    let nPoint = 0;
                    _oRatingPerStudentInCourse.aGrade.forEach( (_oGrade: Grade) => {
                            if(_oGrade.fPoints) {
                                nPoint += _oGrade.fPoints;
                            }
                        });
                    aReturn.push(nPoint);
                }
            });
        return aReturn;
    }
    
    mean(_aNr: number[]) {
        return Statistics.mean(_aNr);
    }
    
    sd(_aNr: number[]) {
        return Statistics.sd(_aNr);
    }
    
    getStudentsInCourse() {
        let aStudentInCourse = this.oRating.oCourse.aStudentInCourse;
        if(aStudentInCourse.length > 1) {
            aStudentInCourse.sort(aStudentInCourse[0].sort);
        }
        return aStudentInCourse;
    }
    
    stringifyGradingPoints(_oCriteriaInCatalogue: CriteriaInCatalogue, _oStudentInCourse: StudentInCourse) {
        let aGrade: string[] = [];
        _oStudentInCourse.getRatings(this.oRating.nId, 0).forEach( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                _oRatingPerStudentInCourse.aGrade.forEach( (_oGrade: Grade) => {
                        if(_oGrade.nC2CId == _oCriteriaInCatalogue.nId) {
                            let fPoint = _oGrade.fPoints;
                            aGrade.push(fPoint === null ? '' : _oGrade.fPoints.toString());
                        }
                    });
            });
        return aGrade;
    }
    
    getGradingPoints(_oCriteriaInCatalogue: CriteriaInCatalogue, _oStudentInCourse: StudentInCourse) {
        for(let oGrade of _oCriteriaInCatalogue.aGrade) {
            if(oGrade.oRatingPerStudentInCourse.oStudentInCourse.nId == _oStudentInCourse.nId &&
                oGrade.oRatingPerStudentInCourse.nRatId == this.oRating.nId) {
                return oGrade.fPoints;
            }
        }
        return null;
    }
    
    stringifyRatingForStudentInCourse(_oStudentInCourse: StudentInCourse) {
        let aRating: string[] = [];
        _oStudentInCourse.getRatings(this.oRating.nId, 0).forEach( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                let fGrade = _oRatingPerStudentInCourse.fGrade;
                aRating.push(fGrade === null ? '' : fGrade.toString());
            });
        return aRating;
    }
    
    getTryCountArray() {
        let aReturn: number[] = [];
        for(let i = 1; i <= this.oRating.numOfTries(); i++) {
            aReturn.push(i);
        }
        return aReturn;
    }
    
    getRatingForStudentInCourse(_oStudentInCourse: StudentInCourse) {
        let aRatingPerStudentInCourse = _oStudentInCourse.getRatings(this.oRating.nId, _oStudentInCourse.numOfTries(this.oRating.nId));
        return aRatingPerStudentInCourse.length > 0 ? aRatingPerStudentInCourse[0] : null;
    }
    
    setDownloadRatings() {
        this.aCsvData = [];
        this.oRating.oCourse.aStudentInCourse.forEach( (_oStudentInCourse: StudentInCourse) => {
                let aRow: string[] = [ 
                    _oStudentInCourse.oStudent.getName(), 
                    _oStudentInCourse.oStudent.sNr, 
                    _oStudentInCourse.oStudent.sMail, 
                    _oStudentInCourse.oStudent.sNote
                ];
                this.oRating.oCatalogue.aCriteriaInCatalogue.forEach( (_oCriteriaInCatalogue: CriteriaInCatalogue) => {
                        let nPoint = this.getGradingPoints(_oCriteriaInCatalogue, _oStudentInCourse);
                        aRow.push(nPoint === null ? '' : nPoint.toString());
                    });
                let oRatingPerStudentInCourse = this.getRatingForStudentInCourse(_oStudentInCourse);
                if(oRatingPerStudentInCourse) {
                    aRow.push(oRatingPerStudentInCourse.fGrade.toString());
                } else {
                    aRow.push('');
                }
                this.aCsvData.push(aRow);
            });
        this.aCsvHead = [ this.w('sName'), this.w('sNr'), this.w('sMail'), this.w('sNote') ];
        this.oRating.oCatalogue.aCriteriaInCatalogue.forEach( (_oCriteriaInCatalogue: CriteriaInCatalogue) => {
                this.aCsvHead.push(_oCriteriaInCatalogue.oCriteria.getName());
            });
        this.aCsvHead.push(this.w('fGrade'));
    }
    
    onClickStudentInCourse(_oStudentInCourse: StudentInCourse) {
        let oRatingPerStudentInCourse = this.getRatingForStudentInCourse(_oStudentInCourse);
        this.oStudentInCourseToShow = _oStudentInCourse;
        if(oRatingPerStudentInCourse !== null) {
            this.nS2RIdForStudentInCourseToShow = oRatingPerStudentInCourse.nId;
        }
    }
}
