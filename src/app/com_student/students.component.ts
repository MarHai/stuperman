import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

import { Student } from '../model/student';

import { QuicklinkComponent } from '../directive/quicklink.component';
import { EmailAddComponent } from '../directive/email_add.component';

@Component({
    selector: 'students',
    templateUrl: '../../tmpl/students.component.html'
})

export class StudentsComponent extends _Component {
    aStudent: Student[];
    sFilterCourse = '';
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
        this.aStudent = this.oDataService.getStudents();
        if(this.aStudent.length > 1) {
            this.aStudent.sort(this.aStudent[0].sort);
        }
    }
    
    onQuicklinkChange(_oEvent: any) {
        this.sFilterCourse = _oEvent.sLink;
    }
    
    getStudents() {
        return this.aStudent.filter( (_oStudent: Student) => {
                if(this.sFilterCourse == '') {
                    return true;
                } else {
                    for(let oStudentInCourse of _oStudent.aStudentInCourse) {
                        if(oStudentInCourse.oCourse.getName() == this.sFilterCourse) {
                            return true;
                        }
                    }
                    return false;
                }
            });
    }
    
    getStudentCourses() {
        let aCourse: string[] = [];
        for(let oStudent of this.aStudent) {
            for(let oStudentInCourse of oStudent.aStudentInCourse) {
                if(aCourse.indexOf(oStudentInCourse.oCourse.getName()) < 0) {
                    aCourse.push(oStudentInCourse.oCourse.getName());
                }
            }
        }
        return aCourse;
    }
    
    onClickStudent(_oStudent: Student) {
        this.oRouter.navigate([ 'app', 'student', _oStudent.nId ]);
    }
}
