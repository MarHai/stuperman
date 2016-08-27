import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { CourseComponent } from './course.component';
import { Observable } from 'rxjs/Rx';

import { Model } from '../model/_model';
import { Rating } from '../model/rating';
import { Grade } from '../model/grade';
import { StudentInCourse } from '../model/student_in_course';
import { RatingPerStudentInCourse } from '../model/rating_per_student_in_course';
import { CriteriaInCatalogue } from '../model/criteria_in_catalogue';

import { EditComponent } from '../directive/edit.component';

import { Statistics } from '../module/statistics.module';

import { ConvertSecondsToDatePipe } from '../pipe/convert_seconds_to_date.pipe';

declare var $: any;
enum Mode { correct = 1, pause = 2, finish = 3, notallratings = 8, notfound = 9 };

@Component({
    selector: 'correct',
    templateUrl: '../../tmpl/correct.component.html'
})

export class CorrectComponent extends CourseComponent {
    eMode: Mode = Mode.correct;
    nRatId: number;
    oRatingPerStudentInCourse: RatingPerStudentInCourse;
    oProgress: { ratings_cnt: number, ratings_total: number, grades_cnt: number, grades_total: number, ratings_error: string[], grades_error: string[] };
    dStart: Date;
    oTimer: any;
    nElapsed: number = 0;
    nTry: number = 1;
    
    private aVolatileCorrect: string[] = [];
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
        this.oRoute.params.forEach( (_aParam: Params) =>  {
                this.nRatId = +_aParam['nRatId'];
                this.nTry = +_aParam['nTry'];
                this.initialSetup();
            });
    }
    
    initialSetup() {
        this.initialSetupRatings( () => {
                this.oRoute.params.forEach( (_aParam: Params) =>  {
                        let nS2RId = +_aParam['nS2RId'];
                        if(nS2RId > 0) {
                            this.show(this.oDataService.getRatingsForStudentsInCourses(nS2RId)[0]);
                        } else {
                            this.gotoNextStudent();
                        }
                    });
            });
    }
    
    show(_oRatingPerStudentInCourse: RatingPerStudentInCourse) {
        this.oRatingPerStudentInCourse = _oRatingPerStudentInCourse;
        this.nElapsed = _oRatingPerStudentInCourse.nCorrectionDuration;
        if(!_oRatingPerStudentInCourse.bDone) {
            this.oTimer = Observable.timer(1000, 1000);
            this.oTimer.subscribe( (_nNr: number) => {
                    if(this.eMode == Mode.correct) {
                        this.nElapsed++;
                    }
                });
        }
        $(window).scrollTop(0);
    }
    
    jumpFromQuicklink(_nS2RId: number) {
        if(this.nElapsed > 30 && !this.oRatingPerStudentInCourse.bDone) {
            this.oPopupService.confirm(this.s('correctionxdone', this.oRatingPerStudentInCourse.oStudentInCourse.oStudent.getName()), true, (_bSuccess: boolean) => {
                    if(_bSuccess) {
                        this.updateCurrentStudentsTime();
                    }
                    this.jump(this.oDataService.getRatingsForStudentsInCourses(_nS2RId)[0]);
                });
        } else {
            this.jump(this.oDataService.getRatingsForStudentsInCourses(_nS2RId)[0]);
        }
    }
    
    jump(_oRatingPerStudentInCourse: RatingPerStudentInCourse) {
        this.oRouter.navigate([ 'app', 'course', 
                _oRatingPerStudentInCourse.oStudentInCourse.nCouId,
                'rating',
                _oRatingPerStudentInCourse.nRatId,
                'try',
                this.nTry,
                'correct',
                _oRatingPerStudentInCourse.nId
            ]);
    }
    
    initialSetupRatings(_fCallback: () => any) {
        if(this.nTry == 1) {
            let aStudentInCourse: StudentInCourse[] = this.oDataService.getRatings(this.nRatId)[0].oCourse.aStudentInCourse;
            this.oProgress = { ratings_cnt: 0, ratings_total: aStudentInCourse.length, grades_cnt: 0, grades_total: 0, ratings_error: [], grades_error: [] };
            aStudentInCourse.forEach( (_oStudentInCourse: StudentInCourse) => {
                    if(_oStudentInCourse.getRatings(this.nRatId).length == 0) {
                        this.oDataService.addItem(new RatingPerStudentInCourse({ nRatId: this.nRatId, nS2CId: _oStudentInCourse.nId }), ( _bSuccess: boolean) => {
                                if(_bSuccess) {
                                    this.oProgress.ratings_cnt++;
                                    this.initialSetupCheckDone(true, _fCallback);
                                } else {
                                    this.oProgress.ratings_error.push(this.s('error.add', this.w('rating')));
                                    this.initialSetupCheckDone(true, _fCallback);
                                }
                            });
                    } else {
                        this.oProgress.ratings_cnt++;
                        this.initialSetupCheckDone(true, _fCallback);
                    }
                });
        } else {
            let nCount = this.getRatingsPerStudentsInCourse().length;
            this.oProgress = { ratings_cnt: nCount, ratings_total: nCount, grades_cnt: 0, grades_total: 0, ratings_error: [], grades_error: [] };
            this.initialSetupCheckDone(true, _fCallback);
        }
    }
    
    initialSetupGrades(_fCallback: () => any) {
        let aRatingPerStudentInCourse: RatingPerStudentInCourse[] = this.getRatingsPerStudentsInCourse();
        let aCriteriaInCatalogue = this.oDataService.getRatings(this.nRatId)[0].oCatalogue.aCriteriaInCatalogue;
        this.oProgress.grades_total = aRatingPerStudentInCourse.length * aCriteriaInCatalogue.length;
        aRatingPerStudentInCourse.forEach( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                aCriteriaInCatalogue.forEach( (_oCriteriaInCatalogue: CriteriaInCatalogue) => {
                        if(_oRatingPerStudentInCourse.getGrade(_oCriteriaInCatalogue.nId) === null) {
                            this.oDataService.addItem(
                                new Grade({ nC2CId: _oCriteriaInCatalogue.nId, nS2RId: _oRatingPerStudentInCourse.nId }), 
                                ( _bSuccess: boolean) => {
                                    if(_bSuccess) {
                                        this.oProgress.grades_cnt++;
                                        this.initialSetupCheckDone(false, _fCallback);
                                    } else {
                                        this.oProgress.grades_error.push(this.s('error.add', this.w('grade')));
                                        this.initialSetupCheckDone(false, _fCallback);
                                    }
                                });
                        } else {
                            this.oProgress.grades_cnt++;
                            this.initialSetupCheckDone(false, _fCallback);
                        }
                    });
            });
    }
    
    initialSetupCheckDone(_bFirstStage: boolean, _fCallback: () => any) {
        if(_bFirstStage && this.oProgress.ratings_cnt == this.oProgress.ratings_total) {
            this.initialSetupGrades(_fCallback);
        } else if(!_bFirstStage && this.oProgress.grades_cnt == this.oProgress.grades_total) {
            _fCallback();
        } else if((_bFirstStage && this.oProgress.ratings_error.length > 0 && (this.oProgress.ratings_cnt + this.oProgress.ratings_error.length) == this.oProgress.ratings_cnt) || (!_bFirstStage && this.oProgress.grades_error.length > 0 && (this.oProgress.grades_cnt + this.oProgress.grades_error.length) == this.oProgress.grades_total)) {
            this.eMode = Mode.notallratings;
        }
    }
    
    goBack() {
        if(this.oRatingPerStudentInCourse) {
            this.updateCurrentStudentsTime();
            this.oRouter.navigate([ 'app', 'course', this.oRatingPerStudentInCourse.oStudentInCourse.nCouId, 'rating', this.oRatingPerStudentInCourse.nRatId ]);
        } else {
            window.history.back();
        }
    }

    pause(_bUnpause = false) {
        if(_bUnpause) {
            this.eMode = Mode.correct;
        } else {
            this.eMode = Mode.pause;
            this.updateCurrentStudentsTime();
        }
        $(window).scrollTop(0);
    }
    
    getRatingsPerStudentsInCourse(_bOnlyNotYetDone = false) {
        let aReturn: RatingPerStudentInCourse[] = [];        
        if(_bOnlyNotYetDone) {
            aReturn = this.oDataService.getRatings(this.nRatId)[0].getRatings(0, this.nTry)
                .filter( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                        return !_oRatingPerStudentInCourse.bDone;
                    });
        } else {
            aReturn = this.oDataService.getRatings(this.nRatId)[0].getRatings(0, this.nTry);
        }
        if(aReturn.length > 1) {
            aReturn.sort(aReturn[0].sort);
        }
        return aReturn;
    }
    
    updateCurrentStudentsTime(_bMarkCurrentAsComplete: boolean = false) {
        if(this.oRatingPerStudentInCourse && 
          ((this.nElapsed - this.oRatingPerStudentInCourse.nCorrectionDuration) > 30 || _bMarkCurrentAsComplete)) {
            
            let oUpdate = { nCorrectionDuration: this.nElapsed };
            if(_bMarkCurrentAsComplete) {
                oUpdate['bDone'] = true;
            }
            this.oDataService.updateItem(this.oRatingPerStudentInCourse, JSON.stringify(oUpdate), (_bSuccess: boolean) => {
                    if(!_bSuccess) {
                        this.oPopupService.alert(this.w('error.update'));
                    }
                });
        }
    }
    
    calcTotalTimeInSeconds() {
        let aTime: number[] = [];
        this.getRatingsPerStudentsInCourse().forEach( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                if(_oRatingPerStudentInCourse.bDone) {
                    aTime.push(_oRatingPerStudentInCourse.nCorrectionDuration);
                }
            });
        return Statistics.sum(aTime);
    }
    
    calcAvgTimeInSeconds() {
        let aTime: number[] = [];
        this.getRatingsPerStudentsInCourse().forEach( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                if(_oRatingPerStudentInCourse.bDone) {
                    aTime.push(_oRatingPerStudentInCourse.nCorrectionDuration);
                }
            });
        return Statistics.mean(aTime, 0);
    }
    
    gotoNextStudent(_bMarkCurrentAsComplete: boolean = false) {
        let bPassedCurrentStudentInCourse = false;
        let bAllDone = true;
        let bNextStudentSet = false;
        let oFirstEntryToBeGraded: RatingPerStudentInCourse;
        this.updateCurrentStudentsTime(_bMarkCurrentAsComplete);
        this.getRatingsPerStudentsInCourse().forEach( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                if(!_oRatingPerStudentInCourse.fGrade && !bNextStudentSet) {
                    bAllDone = false;
                    if(!oFirstEntryToBeGraded) {
                        oFirstEntryToBeGraded = _oRatingPerStudentInCourse;
                    }
                    if(bPassedCurrentStudentInCourse) {
                        this.jump(_oRatingPerStudentInCourse);
                        bNextStudentSet = true;
                    } else if(this.oRatingPerStudentInCourse && this.oRatingPerStudentInCourse.oStudentInCourse.nId == _oRatingPerStudentInCourse.nS2CId) {
                        bPassedCurrentStudentInCourse = true;
                    }
                }
            });
        if(!bNextStudentSet && this.eMode != Mode.notallratings) {
            if(bAllDone) {
                this.eMode = Mode.finish;
                $(window).scrollTop(0);
            } else if(oFirstEntryToBeGraded) {
                this.jump(oFirstEntryToBeGraded);
            } else {
                this.eMode = Mode.notfound;
                this.oRatingPerStudentInCourse = null;
                $(window).scrollTop(0);
            }
        }
    }
    
    isVolatile<T extends Model>(_oItem: T) {
        return this.aVolatileCorrect.indexOf(_oItem.getTableName() + ':' + _oItem.nId.toString()) >= 0;
    }
    
    onUpdateRatingGrade(_mGrade: any) {
        if(this.oRatingPerStudentInCourse.oRating.oSystem.aGrade.indexOf(+_mGrade) >= 0) {
            let sVolatileIndicator = 'stu2rat:' + this.oRatingPerStudentInCourse.nId.toString();
            this.aVolatileCorrect.push(sVolatileIndicator);
            this.oDataService.updateItem(this.oRatingPerStudentInCourse, JSON.stringify({ fGrade: +_mGrade }), ( _bSuccess: boolean) => {
                    if(_bSuccess) {
                        this.aVolatileCorrect = this.aVolatileCorrect.filter( (_sIndicator: string) => _sIndicator != sVolatileIndicator);
                        this.calculateGrade(this.oRatingPerStudentInCourse.oStudentInCourse);
                    } else {
                        this.oPopupService.alert(this.w('error.update'));
                    }
                });
        }
    }
    
    onUpdateGrade(_oGrade: Grade) {
        //check point range first
        if(!_oGrade.fPoints ||
            (_oGrade.fPoints >= _oGrade.oCriteriaInCatalogue.oCriteria.nMin &&
            _oGrade.fPoints <= _oGrade.oCriteriaInCatalogue.oCriteria.nMax)) {
            
            //now, update the item
            if(_oGrade.isDirty()) {
                let sVolatileIndicator = 'grade:' + _oGrade.nId.toString();
                this.aVolatileCorrect.push(sVolatileIndicator);
                this.oDataService.updateItem(_oGrade, _oGrade.toString(), ( _bSuccess: boolean) => {
                        if(_bSuccess) {
                            this.aVolatileCorrect = this.aVolatileCorrect.filter( (_sIndicator: string) => _sIndicator != sVolatileIndicator);
                        } else {
                            this.oPopupService.alert(this.w('error.update'));
                        }
                    });
            }
        } else {
            let oCriteriaTemp = _oGrade.oCriteriaInCatalogue.oCriteria;
            this.oPopupService.alert(this.s('error.outofrange', oCriteriaTemp.nMin, oCriteriaTemp.nMax));
            let nDiffMin = Statistics.diff(_oGrade.fPoints, oCriteriaTemp.nMin);
            let nDiffMax = Statistics.diff(_oGrade.fPoints, oCriteriaTemp.nMax);
            _oGrade.fPoints = nDiffMin < nDiffMax ? oCriteriaTemp.nMin : oCriteriaTemp.nMax;
            this.onUpdateGrade(_oGrade);
        }
    }
}