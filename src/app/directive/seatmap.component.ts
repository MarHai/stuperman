import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

import { Course } from '../model/course';
import { StudentInCourse } from '../model/student_in_course';
import { Student } from '../model/student';

import { Statistics } from '../module/statistics.module';

@Component({
    selector: 'grader-seatmap',
    templateUrl: '../../tmpl/seatmap.component.html',
    inputs: [
        'oCourse',
        'oStudentInCourseToBeSeated',
        'bSeating',
        'bSeatOnly'
    ]
})

export class SeatmapComponent extends _Component {
    oCourse: Course;
    aStudentInCourse: StudentInCourse[] = [];
    nStudentInCourseToBeSeated: number = 0;
    oStudentInCourseToBeSeated: StudentInCourse = null;
    nXToBeSeated: number = null;
    nYToBeSeated: number = null;
    bSeating: boolean = false;
    aSeating: StudentInCourse[][];
    nSeatmapWidth: number;
    nSeatmapHeight: number;
    bVolatile: boolean = false;
    bSeatOnly: boolean = false;
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
        //load course participants (i.e., students in this course)
        for(let oStudentInCourse of this.oDataService.getStudentsInCourses()) {
            if(oStudentInCourse.nCouId == this.oCourse.nId) {
                this.aStudentInCourse.push(oStudentInCourse);
            }
        }
        //get size
        this.nSeatmapWidth = this.oCourse.nWidth;
        this.nSeatmapHeight = this.oCourse.nHeight;
        //set up seating
        this.setSeatings();
    }
    
    setSeatings() {
        if(this.oCourse.nHeight > 0 && this.oCourse.nWidth > 0) {
            this.aSeating = [];
            for(let i = 0; i < this.oCourse.nHeight; i++) {
                this.aSeating[i] = [];
                for(let j = 0; j < this.oCourse.nWidth; j++) {
                    this.aSeating[i][j] = null;
                }
            }
            for(let oStudentInCourse of this.aStudentInCourse) {
                if(oStudentInCourse.nPosX !== null && oStudentInCourse.nPosY != null) {
                    this.aSeating[oStudentInCourse.nPosY][oStudentInCourse.nPosX] = oStudentInCourse;
                }
            }
        }
    }
    
    abortSeating() {
        if(!this.bSeatOnly) {
            this.nXToBeSeated = null;
            this.nYToBeSeated = null;
            this.nStudentInCourseToBeSeated = 0;
            this.oStudentInCourseToBeSeated = null;
            this.bSeating = false;
        }
    }
    
    seat(_nX: number = null, _nY: number = null, _oStudentInCourse: StudentInCourse = null) {
        if(this.bSeating) {
            if(_nX !== null && _nY !== null && _oStudentInCourse) {
                this.oPopupService.confirm(this.s('seatmapdel', _oStudentInCourse.oStudent.getName()), true, (_bConfirm: boolean) => {
                        if(_bConfirm) {
                            this.oDataService.updateItem(_oStudentInCourse, JSON.stringify({ nPosX: null, nPosY: null }), (_bSuccess: boolean) => {
                                    if(_bSuccess) {
                                        this.setSeatings();
                                    } else {
                                        this.oPopupService.alert(this.w('error.update'));
                                    }
                                });
                        } else {
                            this.abortSeating();
                        }
                        _oStudentInCourse = null;
                        this.seatContinue(_nX, _nY, _oStudentInCourse);
                    });
            } else {
                this.seatContinue(_nX, _nY, _oStudentInCourse);
            }
        } else {
            this.abortSeating();
            this.bSeating = true;
            //check if seat is seated (i.e., click on a seated student)
            if(_nX !== null && _nY !== null && _oStudentInCourse) {
                this.oPopupService.confirm(this.s('seatmapdel', _oStudentInCourse.oStudent.getName()), true, (_bConfirm: boolean) => {
                        if(_bConfirm) {
                            this.oDataService.updateItem(_oStudentInCourse, JSON.stringify({ nPosX: null, nPosY: null }), (_bSuccess: boolean) => {
                                    if(_bSuccess) {
                                        this.setSeatings();
                                    } else {
                                        this.oPopupService.alert(this.w('error.update'));
                                    }
                                });
                        }
                        this.abortSeating();
                        this.seatContinue(_nX, _nY, _oStudentInCourse);
                    });
            } else {
                this.seatContinue(_nX, _nY, _oStudentInCourse);
            }
        }
    }
    
    seatContinue(_nX: number = null, _nY: number = null, _oStudentInCourse: StudentInCourse = null) {
        if(_nX !== null && _nY !== null) {
            this.nXToBeSeated = _nX;
            this.nYToBeSeated = _nY;
        }
        if(_oStudentInCourse !== null) {
            this.oStudentInCourseToBeSeated = _oStudentInCourse;
        }
        if(this.bSeating && this.nXToBeSeated !== null && this.nYToBeSeated !== null && this.oStudentInCourseToBeSeated !== null) {
            this.oDataService.updateItem(this.oStudentInCourseToBeSeated, 
                                         JSON.stringify({ nPosX: this.nXToBeSeated, nPosY: this.nYToBeSeated }), 
                                         (_bSuccess: boolean) => {
                    
                    if(_bSuccess) {
                        if(this.bSeatOnly) {
                            this.nXToBeSeated = null;
                            this.nYToBeSeated = null;
                        } else {
                            this.bSeating = false;
                        }
                        this.setSeatings();
                    } else {
                        this.oPopupService.alert(this.w('error.update'));
                    }
                });
        }
    }
    
    getUnseated(): StudentInCourse[] {
        let aUnseated: StudentInCourse[] = [];
        for(let oStudentInCourse of this.aStudentInCourse) {
            if(typeof(oStudentInCourse.nPosX) === 'undefined' || oStudentInCourse.nPosX === null || 
                typeof(oStudentInCourse.nPosY) === 'undefined' || oStudentInCourse.nPosY === null) {
            
                aUnseated.push(oStudentInCourse);
            }
        }
        if(aUnseated.length > 1) {
            aUnseated.sort(aUnseated[0].sort);
        }
        return aUnseated;
    }
    
    getRandomFreeSeat(): { nPosX: number, nPosY: number } {
        let aFreeSeat: { nPosX: number, nPosY: number }[] = [];
        for(let i = 0; i < this.oCourse.nHeight; i++) {
            for(let j = 0; j < this.oCourse.nWidth; j++) {
                if(this.aSeating[i][j] === null) {
                    aFreeSeat.push({ nPosX: j, nPosY: i });
                }
            }
        }
        return aFreeSeat.length > 0 ? aFreeSeat[Statistics.random(0, aFreeSeat.length - 1)] : null;
    }
    
    onClickRandomize() {
        this.oPopupService.confirm(this.s('seatmaprandomq', this.w('student', 2)), false, (_bConfirm: boolean) => {
                if(_bConfirm) {
                    this.getUnseated().forEach( (_oStudentInCourse: StudentInCourse) => {
                            let oSeat = this.getRandomFreeSeat();
                            if(oSeat !== null) {
                                this.aSeating[oSeat.nPosY][oSeat.nPosX] = _oStudentInCourse;
                                this.oDataService.updateItem(_oStudentInCourse, JSON.stringify(oSeat), (_bSuccess: boolean) => {
                                        if(_bSuccess) {
                                            this.setSeatings();
                                        }
                                    });
                            }
                        });
                }
            });
    }
    
    onClickEmptyAll() {
        this.oPopupService.confirm(this.s('seatmapclearseatsq', this.w('student', 2)), false, (_bConfirm: boolean) => {
                if(_bConfirm) {
                    for(let i = 0; i < this.oCourse.nHeight; i++) {
                        for(let j = 0; j < this.oCourse.nWidth; j++) {
                            if(this.aSeating[i][j] !== null) {
                                this.oDataService.updateItem(this.aSeating[i][j], JSON.stringify({ nPosX: null, nPosY: null }), (_bSuccess: boolean) => {
                                        if(_bSuccess) {
                                            this.setSeatings();
                                        }
                                    });
                            }
                        }
                    }
                }
            });
    }
    
    onClickPlaceAll() {
        this.oRouter.navigate([ '/app', 'course', this.oCourse.nId, 'personify' ]);
    }
    
    onClickPrint() {
        let oPopup = window.open('', 'StupermanSeatmapPrintout', 'width=891,height=630');
        oPopup.document.write('<table style="width: 100%; text-align: center; border: 1px solid #CCC; border-collapse: collapse;">');
        this.aSeating.forEach( (_aSeatingRow: StudentInCourse[]) => {
                let sRow = '';
                _aSeatingRow.forEach( (_oStudentInCourse: StudentInCourse) => {
                        sRow += '<td style="border: 1px solid #CCC;">';
                        if(_oStudentInCourse) {
                            if(_oStudentInCourse.oStudent.sImage) {
                                sRow += '<img src="' + _oStudentInCourse.oStudent.sImage + '" style="width: 3rem; margin: .1rem;" /><br />' + _oStudentInCourse.oStudent.getName();
                            } else {
                                sRow += _oStudentInCourse.oStudent.getName();
                            }
                        } else {
                            sRow += ' ';
                        }
                        sRow += '</td>';
                    });
                oPopup.document.write('<tr>' + sRow + '</tr>');
            });
        oPopup.document.write('</table>');
        oPopup.document.close();
        oPopup.focus();
        oPopup.window.print();
    }
    
    onPlaceUnseatedChange(_nS2CId: number) {
        this.nStudentInCourseToBeSeated = _nS2CId;
        if(_nS2CId > 0) {
            this.seat(null, null, this.aStudentInCourse.filter( (_oItem: StudentInCourse) => _oItem.nId == _nS2CId)[0]);
        } else {
            this.oStudentInCourseToBeSeated = null;
        }
    }
    
    onClickCreateSeating() {
        let nMeasure = Math.ceil(Math.sqrt(this.aStudentInCourse.length)) + 2;
        this.oDataService.updateItem(this.oCourse, JSON.stringify({ nHeight: nMeasure, nWidth: nMeasure }), (_bSuccess: boolean) => {
                if(_bSuccess) {
                    this.nSeatmapWidth = nMeasure;
                    this.nSeatmapHeight = nMeasure;
                    this.setSeatings();
                } else {
                    this.oPopupService.alert(this.w('error.reload'));
                }
            });
    }
    
    onChangeSize(_nWidth: number = null, _nHeight: number = null) {
        let bChange = false;
        if(_nWidth !== null && _nWidth != this.nSeatmapWidth) {
            this.nSeatmapWidth = _nWidth;
            bChange = true;
        }
        if(_nHeight !== null && _nHeight != this.nSeatmapHeight) {
            this.nSeatmapHeight = _nHeight;
            bChange = true;
        }
        if(bChange) {
            this.bVolatile = true;
            this.oDataService.updateItem(this.oCourse, JSON.stringify({ nHeight: this.nSeatmapHeight, nWidth: this.nSeatmapWidth }), (_bSuccess: boolean) => {
                    if(_bSuccess) {
                        this.setSeatings();
                    } else {
                        this.oPopupService.alert(this.w('error.reload'));
                    }
                    this.bVolatile = false;
                });
        }
    }
    
    onClickDeleteSeating() {
        this.oDataService.updateItem(this.oCourse, JSON.stringify({ nHeight: 0, nWidth: 0 }), (_bSuccess: boolean) => {
                if(_bSuccess) {
                    this.aSeating = null;
                    this.abortSeating();
                } else {
                    this.oPopupService.alert(this.w('error.reload'));
                }
            });
    }
}
