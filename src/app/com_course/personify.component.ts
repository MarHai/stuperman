import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { CourseComponent } from './course.component';

import { Student } from '../model/student';
import { StudentInCourse } from '../model/student_in_course';

import { ImgComponent } from '../directive/img.component';
import { SeatmapComponent } from '../directive/seatmap.component';

declare var $: any;

@Component({
    selector: 'personify',
    templateUrl: '../../tmpl/personify.component.html'
})

export class PersonifyComponent extends CourseComponent {
    oCurrentStudentInCourse: StudentInCourse = null;
    aStudentInCourseHistory: StudentInCourse[] = [];
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
        this.oRoute.params.forEach( (_aParam: Params) =>  {
                this.oCourse = this.oDataService.getCourses(+_aParam['nCouId'])[0];
                this.gotoNextStudent();
            });
    }
    
    getStudents() {
        let aReturn = this.oCourse.aStudentInCourse;
        if(aReturn.length > 0) {
            aReturn.sort(aReturn[0].sort)
        }
        return aReturn;
    }
    
    getNotYetPersonifiedStudents() {
        let bSeatmapEnabled = this.oCourse.nWidth && this.oCourse.nHeight;
        return this.getStudents().filter( (_oStudentInCourse: StudentInCourse) => {
                if(_oStudentInCourse.oStudent.sImage) {
                    if(bSeatmapEnabled) {
                        if(typeof(_oStudentInCourse.nPosX) === 'undefined' || _oStudentInCourse.nPosX === null || 
                            typeof(_oStudentInCourse.nPosY) === 'undefined' || _oStudentInCourse.nPosY === null) {

                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            });
    }
    
    jumpFromQuicklink(_nS2CId: number) {
        if(this.oCurrentStudentInCourse !== null) {
            this.aStudentInCourseHistory.push(this.oCurrentStudentInCourse);
        }
        this.jump(this.oDataService.getStudentsInCourses(_nS2CId)[0]);
    }
    
    jump(_oStudentInCourse: StudentInCourse) {
        this.oCurrentStudentInCourse = _oStudentInCourse;
        $(window).scrollTop(0);
    }
    
    gotoNextStudent() {
        if(this.oCurrentStudentInCourse !== null) {
            this.aStudentInCourseHistory.push(this.oCurrentStudentInCourse);
        }
        let bFound = false;
        let bNoMoreNext = true;
        this.getStudents().forEach( (_oStudentInCourse: StudentInCourse) => {
                if(bFound && bNoMoreNext) {
                    bNoMoreNext = false;
                    this.jump(_oStudentInCourse);
                } else if(!bFound && (this.oCurrentStudentInCourse === null || _oStudentInCourse.nId == this.oCurrentStudentInCourse.nId)) {
                    bFound = true;
                }
            });
        if(bNoMoreNext) {
            this.goBack(true);
        }
    }
    
    goBack(_bDirectJumpToLastPage: boolean = false) {
        if(this.aStudentInCourseHistory.length > 0 && _bDirectJumpToLastPage == false) {
            this.jump(this.aStudentInCourseHistory.pop());
        } else {
            window.history.back();
        }
    }
}