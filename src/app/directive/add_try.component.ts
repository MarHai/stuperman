import { Component, EventEmitter, Renderer, ViewChild, OnChanges, SimpleChange } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

import { FocusDirective } from './focus.directive';

import { Rating } from '../model/rating';
import { StudentInCourse } from '../model/student_in_course';
import { RatingPerStudentInCourse } from '../model/rating_per_student_in_course';

declare var $: any;

@Component({
    selector: 'grader-addtry',
    templateUrl: '../../tmpl/add_try.component.html',
    inputs: [
        'oRating',
        'aStudentInCourse',
        'bDisplayNow'
    ],
    outputs: [
        'onAdd',
        'onHide'
    ]
})

export class AddTryComponent extends _Component implements OnChanges {
    oRating: Rating = null;
    aStudentInCourse: StudentInCourse[] = [];
    bDisplayNow: boolean = false;
    
    nTry: number = 1;
    nProgress: number;
    bVolatile: boolean = false;
    sStudentSearch: string = '';
    nActiveIndex: number = -1;
    aResult: StudentInCourse[] = [];
    
    onAdd = new EventEmitter(true);
    onHide = new EventEmitter(true);
    
    @ViewChild('oModal') oModal: any;
    
    private oRenderer: Renderer; 
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService, _oRenderer: Renderer) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
        this.oRenderer = _oRenderer;
    }
    
    ngOnInit() {
        if(this.bDisplayNow) {
            this.show();
        }
    }
    
    ngOnChanges(_oChange: { [_sProperty: string]: SimpleChange }) {
        if(_oChange && (typeof(_oChange['bDisplayNow']) !== 'undefined' || typeof(_oChange['oRating']) !== 'undefined')) {
            if(this.bDisplayNow === true) {
                this.show();
            } else {
                this.onClickAbort();
            }
        }
    }
    
    show() {
        if(this.oRating !== null) {
            this.nTry = this.oRating.numOfTries() + 1;
            this.bDisplayNow = true;
            $(this.oModal.nativeElement)
                .modal('show')
                .on('hidden.bs.modal', (_oEvent: any) => {
                        this.aResult = [];
                        this.sStudentSearch = '';
                        this.nActiveIndex = -1;
                        this.aStudentInCourse = [];
                        this.oRating = null;
                        this.bDisplayNow = false;
                        this.onHide.next( {} );
                    });
        }
    }
    
    getAllPossibleStudents() {
        let aReturn = this.oRating.oCourse.aStudentInCourse;
        if(aReturn.length > 0) {
            aReturn.sort(aReturn[0].sort);
        }
        return aReturn;
    }
    
    addStudentInCourse(_oStudentInCourse: StudentInCourse) {
        let bFound = false;
        this.aStudentInCourse.forEach( (_oStudentInCourseAlreadySet: StudentInCourse) => {
                if(_oStudentInCourseAlreadySet.nId == _oStudentInCourse.nId) {
                    bFound = true;
                }
            });
        if(!bFound) {
            this.aStudentInCourse.push(_oStudentInCourse);
            this.aStudentInCourse.sort(this.aStudentInCourse[0].sort);
        }
    }
    
    onClickStudentInCourse(_oStudentInCourse: StudentInCourse) {
        this.addStudentInCourse(_oStudentInCourse);
        this.aResult = [];
        this.sStudentSearch = '';
        this.nActiveIndex = -1;
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
    
    getTryPossibilities() {
        let aReturn: number[] = [];
        for(let i = 2; i <= this.oRating.numOfTries()+1; i++) {
            aReturn.push(i);
        }
        if(aReturn.length == 0) {
            aReturn.push(2);
        }
        return aReturn;
    }
    
    onChangeTry(_nTry: number) {
        this.nTry = _nTry;
    }
    
    onStudentSearch(_oEvent: any) {
        switch(_oEvent.keyCode) {
            case 13: //enter
                if(this.nActiveIndex >= 0 && typeof(this.aResult[this.nActiveIndex]) !== 'undefined') {
                    this.onClickStudentInCourse(this.aResult[this.nActiveIndex]);
                }
                _oEvent.preventDefault();
                _oEvent.stopPropagation();
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
                this.sStudentSearch = this.sStudentSearch.trim();
                if(this.sStudentSearch.length > 0) {
                this.getAllPossibleStudents().forEach( (_oStudentInCourse: StudentInCourse) => {
                            let bFound = false;
                            this.aStudentInCourse.forEach( (_oStudentInCourseAlreadySet: StudentInCourse) => {
                                    if(_oStudentInCourseAlreadySet.nId == _oStudentInCourse.nId) {
                                        bFound = true;
                                    }
                                });
                            if(!bFound && _oStudentInCourse.oStudent.getName().toLowerCase().indexOf(this.sStudentSearch.toLowerCase()) >= 0) {
                                this.aResult.push(_oStudentInCourse);
                            }
                        });
                }
                break;
        }
    }
    
    onClickAddNegative() {
        this.getAllPossibleStudents().forEach( (_oStudentInCourse: StudentInCourse) => {
                let nTryCount = _oStudentInCourse.numOfTries(this.oRating.nId);
                if(nTryCount > 0) {
                    let bFailed = false;
                    for(let i = 1; i <= nTryCount; i++) {
                        _oStudentInCourse.getRatings(this.oRating.nId, i).forEach(
                            (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                            
                                if(this.oRating.oSystem.aGradeFail.indexOf(_oRatingPerStudentInCourse.fGrade) >= 0) {
                                    bFailed = true;
                                }
                            });
                    }
                    if(bFailed) {
                        this.addStudentInCourse(_oStudentInCourse);
                    }
                }
            });
    }

    onClickAddNotYetGraded() {
        this.getAllPossibleStudents().forEach( (_oStudentInCourse: StudentInCourse) => {
                let nTryCount = _oStudentInCourse.numOfTries(this.oRating.nId);
                if(nTryCount == 0) {
                    this.addStudentInCourse(_oStudentInCourse);
                } else {
                    let bGraded = false;
                    for(let i = 1; i <= nTryCount; i++) {
                        _oStudentInCourse.getRatings(this.oRating.nId, i).forEach( 
                            (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                                
                                if(this.oRating.oSystem.aGrade.indexOf(_oRatingPerStudentInCourse.fGrade) >= 0) {
                                    bGraded = true;
                                }
                            });
                    }
                    if(!bGraded) {
                        this.addStudentInCourse(_oStudentInCourse);
                    }
                }
            });
    }
    
    onClickAddAll() {
        this.getAllPossibleStudents().forEach( (_oStudentInCourse: StudentInCourse) => {
                this.addStudentInCourse(_oStudentInCourse);
            });
    }
    
    onClickRemove(_oStudentInCourse: StudentInCourse) {
        this.aStudentInCourse = this.aStudentInCourse.filter( (_oStudentInCourseAlreadySet: StudentInCourse) => 
                _oStudentInCourseAlreadySet.nId != _oStudentInCourse.nId
            );
    }
    
    onClickRemoveAll() {
        this.aStudentInCourse = [];
    }
    
    onClickSubmit() {
        this.bVolatile = true;
        this.nProgress = 0;
        this.aStudentInCourse.forEach( (_oStudentInCourse: StudentInCourse) => {
            console.log(_oStudentInCourse.oStudent.getName(), _oStudentInCourse.getRatings(this.oRating.nId, this.nTry));
                if(_oStudentInCourse.getRatings(this.oRating.nId, this.nTry).length == 0) {
                    this.oDataService.addItem(new RatingPerStudentInCourse({ nRatId: this.oRating.nId, nS2CId: _oStudentInCourse.nId, nTry: this.nTry }), 
                        ( _bSuccess: boolean) => {
                            
                            this.nProgress++;
                            if(this.nProgress == this.aStudentInCourse.length) {
                                this.onAdd.next( {} );
                                this.onClickAbort();
                                this.bVolatile = false;
                            }
                        });
                }
            });
    }
    
    onClickAbort() {
        $(this.oModal.nativeElement).modal('hide');
    }
}