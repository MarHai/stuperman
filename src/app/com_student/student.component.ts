import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';
import { Observable } from 'rxjs/Rx';

import { Student } from '../model/student';
import { StudentInCourse } from '../model/student_in_course';
import { Talk } from '../model/talk';

import { QuicklinkComponent } from '../directive/quicklink.component';
import { EditComponent } from '../directive/edit.component';
import { DeleteComponent } from '../directive/delete.component';
import { AddComponent } from '../directive/add.component';
import { EmailAddComponent } from '../directive/email_add.component';
import { ImgComponent } from '../directive/img.component';
import { StudentInCourseComponent } from '../directive/student_in_course.component';

import { DatetimeStringifyPipe } from '../pipe/datetime_stringify.pipe';

@Component({
    selector: 'student',
    templateUrl: '../../tmpl/student.component.html'
})

export class StudentComponent extends _Component {
    oStudent: Student;
    sFilterCategory = '';
    sTimer = '10:00';
    bTimerStarted: boolean = false;
    bTimerEnded: boolean = false;
    oTimer: any;
    nElapsed: number = 0;
    
    oStudentInCourseToShow: StudentInCourse = null;
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
        this.oRoute.params.forEach( (_aParam: Params) =>  {
                this.oStudent = this.oDataService.getStudents(+_aParam['nStuId'])[0];
            });
        this.oTimer = Observable.timer(1000, 1000);
        this.oTimer.subscribe( (_nNr: number) => {
                if(this.bTimerStarted) {
                    this.nElapsed++;
                    if(this.convertTimeStringIntoSeconds() <= this.nElapsed) {
                        this.bTimerStarted = false;
                        this.bTimerEnded = true;
                    }
                }
            });
    }
    
    getStudentInCourses() {
        return this.oStudent.aStudentInCourse.filter( (_oStudentInCourse: StudentInCourse) => 
            this.sFilterCategory == '' || _oStudentInCourse.oCourse.sCategory == this.sFilterCategory);
    }
    
    getEmptyTalk() {
        return new Talk({ nStuId: this.oStudent.nId });
    }
    
    getCategories() {
        let aCategory: string[] = [];
        for(let oStudentInCourse of this.oStudent.aStudentInCourse) {
            if(aCategory.indexOf(oStudentInCourse.oCourse.sCategory) < 0) {
                aCategory.push(oStudentInCourse.oCourse.sCategory);
            }
        }
        aCategory.sort();
        return aCategory;
    }
    
    convertTimeStringIntoSeconds() {
        let aTime = this.sTimer.trim().split(':');
        let nMinute = +aTime[0],
            nSecond = 0;
        if(aTime.length > 1) {
            nSecond = +aTime[1];
        }
        return nMinute*60 + nSecond;
    }
    
    onTimerChange(_sTime: string) {
        let aTime = _sTime.trim().split(':');
        let nMinute = +aTime[0],
            nSecond = 0;
        if(nMinute < 0) {
            nMinute *= -1;
        }
        while(nMinute > 59) {
            nMinute -= 60;
        }
        if(aTime.length > 1) {
            nSecond = +aTime[1];
            if(nSecond < 0) {
                nSecond *= -1;
            }
            while(nSecond > 59) {
                nSecond -= 60;
            }
        }
        this.sTimer = (nMinute < 10 ? ('0' + nMinute.toString()) : nMinute.toString()) + ':' + 
            (nSecond < 10 ? ('0' + nSecond.toString()) : nSecond.toString());
    }
    
    onTimerStart() {
        this.nElapsed = 0;
        this.bTimerStarted = true;
        this.bTimerEnded = false;
    }
    
    onTimerAbort() {
        this.bTimerStarted = false;
        this.bTimerEnded = false;
    }
    
    onHideStudentInCourse(_oEvent: any) {
        this.oStudentInCourseToShow = null;
    }
    
    onClickStudentInCourse(_oStudentInCourse: StudentInCourse) {
        this.oStudentInCourseToShow = _oStudentInCourse;
    }
    
    onQuicklinkChange(_oEvent: any) {
        this.sFilterCategory = _oEvent.sLink;
    }
}
