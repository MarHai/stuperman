import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { CourseComponent } from './course.component';

import { Course } from '../model/course';
import { Student } from '../model/student';
import { StudentInCourse } from '../model/student_in_course';

import { FocusDirective } from '../directive/focus.directive';
import { MarkdownPipe } from '../pipe/markdown.pipe';

@Component({
    selector: 'course-grade',
    templateUrl: '../../tmpl/course_grade.component.html'
})

export class CourseGradeComponent extends CourseComponent {
    nFocus: number = 0;
    private aVolatileGrade: number[] = [];
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
        this.oRoute.params.forEach( (_aParam: Params) =>  {
                this.oCourse = this.oDataService.getCourses(+_aParam['nCouId'])[0];
                if(this.oCourse.aStudentInCourse.length > 1) {
                    this.oCourse.aStudentInCourse.sort(this.oCourse.aStudentInCourse[0].sort);
                }
            });
    }
    
    isVolatileGrade(_nId: number) {
        return this.aVolatileGrade.indexOf(_nId) >= 0;
    }
    
    onChangeManual(_oStudentInCourse: StudentInCourse, _bManualGrading: boolean) {
        if(!_bManualGrading) {
            this.aVolatileGrade.push(_oStudentInCourse.nId);
            this.oDataService.updateItem(_oStudentInCourse, JSON.stringify({ fGrade: null, bGradeManual: false }), ( _bSuccess: boolean) => {
                    if(!_bSuccess) {
                        this.oPopupService.alert(this.w('error.update'));
                    }
                    this.calculateGrade(_oStudentInCourse, true, ( _bSuccess: boolean) => {
                            this.aVolatileGrade.splice(this.aVolatileGrade.indexOf(_oStudentInCourse.nId), 1);
                        });
                });
        } else {
            this.nFocus = _oStudentInCourse.nId;
        }
    }
    
    onChangeGrade(_oStudentInCourse: StudentInCourse, _fGrade: number) {
        this.aVolatileGrade.push(_oStudentInCourse.nId);
        this.oDataService.updateItem(_oStudentInCourse, JSON.stringify({ fGrade: _fGrade, bGradeManual: true }), ( _bSuccess: boolean) => {
                if(!_bSuccess) {
                    this.oPopupService.alert(this.w('error.update'));
                }
                this.aVolatileGrade.splice(this.aVolatileGrade.indexOf(_oStudentInCourse.nId), 1);
            });
    }
}