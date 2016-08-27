import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

import { SeatmapComponent } from '../directive/seatmap.component';
import { QuicklinkComponent } from '../directive/quicklink.component';
import { EditComponent } from '../directive/edit.component';
import { DeleteComponent } from '../directive/delete.component';
import { AddComponent } from '../directive/add.component';
import { SortDirective } from '../directive/sort.directive';
import { ChartComponent } from '../directive/chart.component';
import { DownloadCsvComponent } from '../directive/download_csv.component';
import { StudentInCourseComponent } from '../directive/student_in_course.component';
import { AddTryComponent } from '../directive/add_try.component';

import { Statistics } from '../module/statistics.module';

import { Course } from '../model/course';
import { RatingPerStudentInCourse } from '../model/rating_per_student_in_course';
import { Rating } from '../model/rating';
import { Student } from '../model/student';
import { StudentInCourse } from '../model/student_in_course';

@Component({
    selector: 'course',
    templateUrl: '../../tmpl/course.component.html',
    inputs: [ 'oCourse' ]
})

export class CourseComponent extends _Component {
    oCourse: Course;
    aRatingPerStudentInCourse = {};
    private sFilter = '';
    private aVolatile: number[] = [];
    
    aHistogramData: number[];
    aHistogramLabel: number[];
	
	aCsvData: string[][] = [];
	aCsvHead: string[] = [];
    
    oStudentInCourseToShow: StudentInCourse = null;
    oRatingToAddTry: Rating = null;
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
        this.oRoute.params.forEach( (_aParam: Params) =>  {
                this.oCourse = this.oDataService.getCourses(+_aParam['nCouId'])[0];
                this.setDownloadStudents();
                this.setHistogramData();
            });
    }
    
    calculateAllGrades() {
        this.oCourse.aStudentInCourse.forEach( (_oStudentInCourse: StudentInCourse) => {
                this.calculateGrade(_oStudentInCourse);
            });
    }
    
    calculateGrade(_oStudentInCourse: StudentInCourse, _bForceCalculation: boolean = false, _fCallback: (_bSuccess: boolean) => any = null) {
        let aGrade: number[] = [];
        let aWeight: number[] = [];
        _oStudentInCourse.getRatingsFromFinalTry().forEach( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                if(_oRatingPerStudentInCourse.fGrade && _oRatingPerStudentInCourse.oRating.fWeight > 0) {
                    aGrade.push(_oRatingPerStudentInCourse.fGrade);
                    aWeight.push(_oRatingPerStudentInCourse.oRating.fWeight);
                }
            });
        let fGrade = Statistics.weightedMean(aGrade, aWeight);
        if(fGrade !== null && (_oStudentInCourse.fGrade === null || _oStudentInCourse.fGrade.toString() != fGrade)) {
            if(_oStudentInCourse.bGradeManual) {
                if(_bForceCalculation) {
                    this.oDataService.updateItem(_oStudentInCourse, JSON.stringify({ fGrade: fGrade, bGradeManual: 0 }), ( _bSuccess: boolean) => {
                            if(!_bSuccess) {
                                this.oPopupService.alert(this.w('error.update'));
                            }
                            if(_fCallback !== null) {
                                _fCallback(_bSuccess);
                            }
                        });
                } else {
                    this.oPopupService.confirm(this.s('courseoverwritemanualgradeforx', _oStudentInCourse.oStudent.getName(), _oStudentInCourse.fGrade.toString(), fGrade.toString()),
                        true, (_bConfirm: boolean) => {
                           
                            if(_bConfirm) {
                                this.oDataService.updateItem(_oStudentInCourse, JSON.stringify({ fGrade: fGrade, bGradeManual: 0 }), ( _bSuccess: boolean) => {
                                        if(!_bSuccess) {
                                            this.oPopupService.alert(this.w('error.update'));
                                        }
                                        if(_fCallback !== null) {
                                            _fCallback(_bSuccess);
                                        }
                                    });
                            }
                        });
                }
            } else {
                this.oDataService.updateItem(_oStudentInCourse, JSON.stringify({ fGrade: fGrade }), ( _bSuccess: boolean) => {
                        if(!_bSuccess) {
                            this.oPopupService.alert(this.w('error.update'));
                        }
                        if(_fCallback !== null) {
                            _fCallback(_bSuccess);
                        }
                    });
            }
        }
        return fGrade;
    }
    
    getTries(_oRating: Rating) {
        var aTry: number[] = [];
        for(let i = 1; i <= _oRating.numOfTries(); i++) {
            aTry.push(i);
        }
        return aTry;
    }
    
    getSeatings(): any[][] {
        let aSeating: any[][] = [];
        for(let i = 0; i < this.oCourse.nHeight; i++) {
            aSeating[i] = [];
            for(let j = 0; j < this.oCourse.nWidth; j++) {
                aSeating[i][j] = null;
            }
        }
        for(let oStudentInCourse of this.oCourse.aStudentInCourse) {
            if(oStudentInCourse.nPosX && oStudentInCourse.nPosY) {
                aSeating[oStudentInCourse.nPosY][oStudentInCourse.nPosX] = oStudentInCourse;
            }
        }
        return aSeating;
    }
    
    getEmptyRating() {
        let oRatingNew = new Rating({ nCouId: this.oCourse.nId });
        if(this.oCourse.aRating.length > 1) {
            let aRatingWeight: number[] = [];
            this.oCourse.aRating.forEach( (_oRating: Rating) => {
                    aRatingWeight.push(_oRating.fWeight);
                });
            aRatingWeight = Statistics.mode(aRatingWeight);
            if(aRatingWeight.length > 0) {
                oRatingNew.fWeight = aRatingWeight[0];
            }
        }
        return oRatingNew;
    }
    
    isVolatile(_oRating: Rating) {
        return this.aVolatile.indexOf(_oRating.nId) >= 0;
    }
    
    setDownloadStudents() {
        this.aCsvData = [];
        this.getStudentsInCourse().forEach( (_oStudentInCourse: StudentInCourse) => {
                this.aCsvData.push([ 
                    _oStudentInCourse.oStudent.getName(), 
                    _oStudentInCourse.oStudent.sNr, 
                    _oStudentInCourse.oStudent.sMail, 
                    _oStudentInCourse.oStudent.sNote, 
                    _oStudentInCourse.fGrade ? _oStudentInCourse.fGrade.toString() : ''
                ]);
            });
		this.aCsvHead = [ this.w('sName'), this.w('sNr'), this.w('sMail'), this.w('sNote'), this.w('fGrade') ];
    }
    
    setHistogramData() {
        this.aHistogramData = [];
        this.aHistogramLabel = [];
        let aGradeTemp: number[] = [];
        this.getStudentsInCourse().forEach( (_oStudentInCourse: StudentInCourse) => {
                if(_oStudentInCourse.fGrade) {
                    aGradeTemp.push(_oStudentInCourse.fGrade)
                }
            });
        let oGradeTemp = Statistics.countOccurences(aGradeTemp);
        let aGradeCountTemp: { grade: number, count: number }[] = [];
        for(let fGradeTemp in oGradeTemp) {
            aGradeCountTemp.push({
                grade: +fGradeTemp,
                count: +oGradeTemp[fGradeTemp]
            });
        }
        aGradeCountTemp.sort( (a: { grade: number, count: number }, b: { grade: number, count: number }) => {
                return a.grade - b.grade;
            });
        for(let oGradeCountTemp of aGradeCountTemp) {
            this.aHistogramLabel.push(oGradeCountTemp.grade);
            this.aHistogramData.push(oGradeCountTemp.count);
        }
    }
    
    onUpdateWeight(_oRating: Rating) {
        this.aVolatile.push(_oRating.nId);
        this.oDataService.updateItem(_oRating, JSON.stringify({ fWeight: _oRating.fWeight }), ( _bSuccess: boolean) => {
                if(_bSuccess) {
                    this.aVolatile = this.aVolatile.filter( (_nId: number) => _nId != _oRating.nId);
                    this.calculateAllGrades();
                } else {
                    this.oPopupService.alert(this.w('error.update'));
                }
            });
    }
    
    onClickCreateSeating() {
        let nMeasure = Math.ceil(Math.sqrt(this.oCourse.aStudentInCourse.length)) + 2;
        this.oCourse.nHeight = nMeasure;
        this.oCourse.nWidth = nMeasure;
    }
    
    onClickRating(_oRating: Rating) {
        this.oRouter.navigate([ '/app', 'course', this.oCourse.nId, 'rating', _oRating.nId ]);
    }
    
    onClickAddTry(_oRating: Rating, _oEvent: any) {
        _oEvent.preventDefault();
        _oEvent.stopPropagation();
        this.oRatingToAddTry = _oRating;
    }
    
    onHideStudentInCourse(_oEvent: any) {
        this.oStudentInCourseToShow = null;
    }
    
    onHideRatingToAddTry(_oEvent: any) {
        this.oRatingToAddTry = null;
    }
    
    onClickStudentInCourse(_oStudentInCourse: StudentInCourse) {
        this.oStudentInCourseToShow = _oStudentInCourse;
    }
    
    getStudentsInCourse() {
        let aTemp = this.oCourse.aStudentInCourse.filter( (_oStudentInCourse: StudentInCourse) => {
                if(this.sFilter == '') {
                    return true;
                } else {
                    if(this.sFilter == this.w('correctionfilternotdone')) {
                        return _oStudentInCourse.fGrade === null;
                    } else {
                        return _oStudentInCourse.fGrade !== null;
                    }
                }
            });
        if(aTemp.length > 1) {
            aTemp.sort(aTemp[0].sort);
        }
        return aTemp;
    }
    
    getRatingsPerStudentInCourse(_oStudentInCourse: StudentInCourse) {
        let aReturn: RatingPerStudentInCourse[] = [];
        for(let oRating of this.oCourse.aRating) {
            let bFound = false;
            for(let oRatingPerStudentInCourse of _oStudentInCourse.getRatings(oRating.nId)) {
                aReturn.push(oRatingPerStudentInCourse);
                bFound = true;
                break;
            }
            if(!bFound) {
                aReturn.push(null);
            }
        }
        return aReturn;
    }
}