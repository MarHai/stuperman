import { Component, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

import { User } from '../model/user';
import { StudentInCourse } from '../model/student_in_course';
import { RatingPerStudentInCourse } from '../model/rating_per_student_in_course';
import { Grade } from '../model/grade';

import { DeleteComponent } from './delete.component';
import { ChartComponent } from './chart.component';
import { ImgComponent } from './img.component';
import { EmailAddComponent } from './email_add.component';

import { Statistics } from '../module/statistics.module';

declare var $: any;

@Component({
    selector: 'grader-stu2cou',
    templateUrl: '../../tmpl/student_in_course.component.html',
    inputs: [
        'oStudentInCourse',
        'bShow',
        'nS2RIdOpen'
    ],
    outputs: [
        'onHide'
    ]
})

export class StudentInCourseComponent extends _Component {
    bShow: boolean = true;
    oStudentInCourse: StudentInCourse;
	nS2RIdOpen = 0;
    onHide = new EventEmitter(true);
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() { 
    }
    
    ngOnChanges() {
        if(this.bShow) {
            $('#stu2cou-modal')
                .modal('show')
                .on('hidden.bs.modal', (_oEvent: any) => {
                        this.bShow = false;
                        this.onHide.next( {} );
                    });
        }
    }
    
    getMessageBody(_oRatingPerStudentInCourse: RatingPerStudentInCourse) {
        let aBody: string[] = [];
        _oRatingPerStudentInCourse.aGrade.forEach( (_oGrade: Grade) => {
                aBody.push(this.s(
                    'stu2cousendbodysingle',
                    _oGrade.oCriteriaInCatalogue.oCriteria.getName(),
                    _oGrade.fPoints,
                    _oGrade.oCriteriaInCatalogue.oCriteria.nMax,
                    this.w('fPoints', _oGrade.fPoints),
                    _oGrade.sNote
                ));
            });
        return this.s(
            'stu2cousendbody',
            _oRatingPerStudentInCourse.oStudentInCourse.oStudent.getName(),
            this.w('rating'),
            _oRatingPerStudentInCourse.oRating.getName(),
            aBody.join('\n\n'),
            _oRatingPerStudentInCourse.getSumOfPoints(),
            this.w('fPointsTotal', _oRatingPerStudentInCourse.getSumOfPoints()),
            this.w('fGrade'),
            _oRatingPerStudentInCourse.fGrade.toString(),
            _oRatingPerStudentInCourse.nTry.toString(),
            this.oDataService.getCurrentUser().getName()
        );
    }
    
    getMeanGrade() {
        return Statistics.mean(this.getChartData());
    }
    
    getChartData() {
        var aData: number[] = [];
        this.oStudentInCourse.getRatingsFromFinalTry().forEach( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                aData.push(_oRatingPerStudentInCourse.fGrade);
            });
        return aData;
    }
    
    getChartLabels() {
        var aData: string[] = [];
        this.oStudentInCourse.getRatingsFromFinalTry().forEach( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                aData.push(_oRatingPerStudentInCourse.oRating.getName());
            });
        return aData;
    }
}