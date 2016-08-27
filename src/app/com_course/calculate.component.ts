import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { CourseComponent } from './course.component';

import { Rating } from '../model/rating';
import { RatingPerStudentInCourse } from '../model/rating_per_student_in_course';

import { ChartComponent } from '../directive/chart.component';

enum Step { overview = 1, validate = 2, action = 3, error = 9 };

@Component({
    selector: 'calculate',
    templateUrl: '../../tmpl/calculate.component.html'
})

export class CalculateComponent extends CourseComponent {
    oRating: Rating;
    aGradePointRange: { bInc: boolean, nCntSub: number, nUpper: number, nGrade: number, bPass: boolean, nFrom: number, sError: string }[];
    nSlider: number;
    nMin: number;
    nMax: number;
    nSliderMax: number;
    nCountGradePass: number;
    nPass: number;
    sErrorGeneral: string = '';
    bError: boolean = false;
    eStep = Step.overview;
    aHistogramData: number[];
    nStudentsToCalculate: number;
    bOverwrite: boolean = true;
    aLog: { oRatingPerStudentInCourse: RatingPerStudentInCourse, sError: string }[];
    nLogErrorCount: number;
    nTry: number = 1;
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
        this.oRoute.params.forEach( (_aParam: Params) =>  {
                this.nTry = +_aParam['nTry'];
                this.oRating = this.oDataService.getRatings(+_aParam['nRatId'])[0];
                this.nMax = this.oRating.oCatalogue.getMaxPoints();
                this.nMin = this.oRating.oCatalogue.getMinPoints();
                this.nSliderMax = this.nMax - 1;
                this.nCountGradePass = this.oRating.oSystem.aGrade.length - this.oRating.oSystem.aGradeFail.length;
                this.updateSlider(Math.round(this.nMax*.5/this.nCountGradePass));
            });
    }
    
    getSliderOptions() {
        let aReturn: number[] = [];
        for(let i = 1; i <= this.nSliderMax; i++) {
            aReturn.push(i);
        }
        return aReturn;
    }
    
    findGradeIndices(_nPoint: number) {
        let aGradeIndex: number[] = [];
        for(let i = 0; i < this.aGradePointRange.length; i++) {
            if(_nPoint <= (i == 0 || this.aGradePointRange[i].nUpper < 0 ? this.nMax : this.aGradePointRange[this.aGradePointRange[i].nUpper].nFrom-1) && 
               _nPoint >= this.aGradePointRange[i].nFrom &&
               this.aGradePointRange[i].bInc) {

                aGradeIndex.push(i);
            }
        }
        return aGradeIndex;
    }
    
    validate() {
        this.bError = false;
        this.sErrorGeneral = '';
        for(let i = 0; i < this.aGradePointRange.length; i++) {
            this.aGradePointRange[i].sError = '';
        }
        let aPointError: number[] = [];
        for(let i = this.nMin; i <= this.nMax; i++) {
            let aGradeIndex = this.findGradeIndices(i);
            if(aGradeIndex.length == 0) {
                aPointError.push(i);
            } else if(aGradeIndex.length > 1) {
                aGradeIndex.forEach( (_nIndex: number) => {
                        this.aGradePointRange[_nIndex].sError = this.w('error.ratingcalculateduplicategrades');
                        this.bError = true;
                    });
            }
        }
        if(aPointError.length > 0) {
            this.sErrorGeneral = this.s('error.ratingcalculatepointsmissing', aPointError.join(', '));
            this.bError = true;
        }
        this.setHistogramData();
    }
    
    updateInc(_nIndex: number) {
        this.aGradePointRange[_nIndex].bInc = !this.aGradePointRange[_nIndex].bInc;
        //get upper active
        let nLast = -1;
        if(_nIndex > 0) {
            for(let i = _nIndex-1; i >= 0; i--) {
                if(this.aGradePointRange[i].bInc) {
                    nLast = i;
                    break;
                }
            }
        }
        //get next active's upper
        let nNext = -1;
        if((_nIndex+1) < this.aGradePointRange.length) {
            for(let i = _nIndex+1; i < this.aGradePointRange.length; i++) {
                if(this.aGradePointRange[i].bInc) {
                    nNext = i;
                    break;
                }
            }
        }
        if(this.aGradePointRange[_nIndex].bInc) {
            //it was disabled before, now being active
            this.aGradePointRange[_nIndex].nUpper = nLast;
            if(nNext >= 0) {
                this.aGradePointRange[nNext].nUpper = _nIndex;
            }
        } else {
            //it was enabled, now is disabled
            if(nNext >= 0) {
                this.aGradePointRange[nNext].nUpper = nLast;
            }
        }
        this.validate();
    }
    
    updateFrom(_nIndex: number, _nFrom: number) {
        this.aGradePointRange[_nIndex].nFrom = _nFrom;
        this.validate();
    }
    
    updateSlider(_nSlider: number) {
        if(_nSlider <= 0 || _nSlider > this.nSliderMax) {
            _nSlider = 1;
        }
        this.nSlider = _nSlider;
        let nCountIncluded = 0;
        let nLastIncluded: number = null;
        this.aGradePointRange = [];
        for(let i = 0; i < this.oRating.oSystem.aGrade.length; i++) {
            let nGrade = this.oRating.oSystem.aGrade[i];
            let nPosNeg = this.oRating.oSystem.aGradeFail.indexOf(nGrade);
            let nFromTemp = this.nMax+1-((nCountIncluded+1)*this.nSlider);
            let bPass = true;
            let bInc = true;
            let nCntSub = i;
            let nUpper = nCountIncluded - 1;
            if(nPosNeg >= 0) {
                if(nFromTemp >= this.nMin || nPosNeg === 0) {
                    bPass = false;
                    nCntSub = nPosNeg;
                    nCountIncluded++;
                } else {
                    bInc = false;
                    bPass = false;
                    nCntSub = nPosNeg;
                }
                if(nPosNeg === 0) {
                    this.nPass = nFromTemp + this.nSlider;
                }
            } else {
                if(nFromTemp > this.nMin) {
                    nCountIncluded++;
                } else {
                    bInc = false;
                }
            }
            if(bInc) {
                nLastIncluded = i;
            }
            this.aGradePointRange.push({
                bInc: bInc, 
                nCntSub: nCntSub, 
                nUpper: nUpper, 
                nGrade: nGrade, 
                bPass: bPass, 
                nFrom: nFromTemp,
                sError: ''
            });
        }
        this.aGradePointRange[nLastIncluded].nFrom = this.nMin;
        this.validate();
    }
    
    setHistogramData() {
        this.aHistogramData = [];
        this.oRating.oSystem.aGrade.forEach( (_nGrade: number) => {
                let nNr = 0;
                this.oRating.getRatings(0, this.nTry).forEach( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                        if(_oRatingPerStudentInCourse.bDone) {
                            let nGrade: number = null;
                            if(!_oRatingPerStudentInCourse.fGrade || this.bOverwrite) {
                                let nPointSum = _oRatingPerStudentInCourse.getSumOfPoints();
                                if(nPointSum >= this.nMin) {
                                    nGrade = this.aGradePointRange[this.findGradeIndices(nPointSum)[0]].nGrade;
                                }
                            } else if(_oRatingPerStudentInCourse.fGrade) {
                                nGrade = _oRatingPerStudentInCourse.fGrade;
                            }
                            if(nGrade !== null && nGrade == _nGrade) {
                                nNr++;
                            }
                        }
                    });
                this.aHistogramData.push(nNr);
            });
    }
    
    checkCalculationEnd() {
        if(this.aLog.length == this.nStudentsToCalculate) {
            if(this.nLogErrorCount > 0) {
                this.eStep = Step.error;
            } else {
                this.oRouter.navigate(['app', 'course', this.oRating.nCouId, 'rating', this.oRating.nId ]);
            }
        }
    }
    
    onClickCalculate(_bAction: boolean = false) {
        this.eStep = Step.validate;
        if(_bAction) {
            this.eStep = Step.action;
            this.aLog = [];
            this.nLogErrorCount = 0;
            this.oRating.getRatings(0, this.nTry).forEach( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                    if(_oRatingPerStudentInCourse.bDone && (!_oRatingPerStudentInCourse.fGrade || this.bOverwrite)) {
                        let nPointSum = _oRatingPerStudentInCourse.getSumOfPoints();
                        if(nPointSum >= this.nMin) {
                            let nGrade = this.aGradePointRange[this.findGradeIndices(nPointSum)[0]].nGrade;
                            this.oDataService.updateItem(_oRatingPerStudentInCourse, JSON.stringify({ fGrade: nGrade }), (_bSuccess: boolean) => {
                                    if(_bSuccess) {
                                        this.aLog.push({ oRatingPerStudentInCourse: _oRatingPerStudentInCourse, sError: '' });
                                        this.calculateGrade(_oRatingPerStudentInCourse.oStudentInCourse, false, (_bSuccess: boolean) => {
                                                if(_bSuccess) {
                                                    this.checkCalculationEnd();
                                                } else {
                                                    this.aLog.push({ oRatingPerStudentInCourse: _oRatingPerStudentInCourse, sError: this.w('error.ratingcalculateoverall') });
                                                    this.nLogErrorCount++;
                                                    this.checkCalculationEnd();
                                                }
                                            });
                                    } else {
                                        this.aLog.push({ oRatingPerStudentInCourse: _oRatingPerStudentInCourse, sError: this.w('error.ratingcalculateupdate') });
                                        this.nLogErrorCount++;
                                        this.checkCalculationEnd();
                                    }
                                });
                        } else {
                            this.aLog.push({ oRatingPerStudentInCourse: _oRatingPerStudentInCourse, sError: this.w('error.ratingcalculatemin') });
                            this.nLogErrorCount++;
                        }
                    }
                });
        } else {
            this.nStudentsToCalculate = 0;
            this.oRating.getRatings(0, this.nTry).forEach( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                    if(_oRatingPerStudentInCourse.bDone && (!_oRatingPerStudentInCourse.fGrade || this.bOverwrite)) {
                        this.nStudentsToCalculate++;
                    }
                });
        }
    }
    
    onClickBack(_bBackToRating: boolean = false) {
        if(_bBackToRating) {
            this.oRouter.navigate(['app', 'course', this.oRating.nCouId, 'rating', this.oRating.nId ]);
        } else {
            this.eStep = Step.overview;
        }
    }
}