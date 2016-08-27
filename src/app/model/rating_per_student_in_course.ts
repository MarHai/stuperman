import { Model } from './_model';
import { StudentInCourse } from './student_in_course';
import { Rating } from './rating';
import { Grade } from './grade';

import { Statistics } from '../module/statistics.module';

export class RatingPerStudentInCourse extends Model {
	nS2CId: number;
	oStudentInCourse: StudentInCourse;
	nRatId: number;
	oRating: Rating;
	fGrade: number;
	nTry: number = 1;
	sNote: string = '';
    bDone: boolean = false;
    nCorrectionDuration: number = 0;
    
    aGrade: Grade[] = [];
    
    constructor(_oData: Object) {
        super(_oData);
        this.update(_oData);
    }
    
    update(_oData: Object) {
        super.update(_oData);
        if(typeof(_oData['nS2RId']) !== 'undefined') {
            this.nId = +_oData['nS2RId'];
        }
        if(typeof(_oData['nS2CId']) !== 'undefined') {
            this.nS2CId = +_oData['nS2CId'];
        }
        if(typeof(_oData['nRatId']) !== 'undefined') {
            this.nRatId = +_oData['nRatId'];
        }
        if(typeof(_oData['fGrade']) !== 'undefined') {
            this.fGrade = +_oData['fGrade'];
        }
        if(typeof(_oData['nTry']) !== 'undefined') {
            this.nTry = +_oData['nTry'];
        }
        if(typeof(_oData['bDone']) !== 'undefined') {
            this.bDone = +_oData['bDone'] == 1 ? true : false;
        }
        if(typeof(_oData['nCorrectionDuration']) !== 'undefined') {
            this.nCorrectionDuration = +_oData['nCorrectionDuration'];
        }
        if(typeof(_oData['sNote']) !== 'undefined') {
            this.sNote = _oData['sNote'];
        }
    }
    
    sort(_oA: RatingPerStudentInCourse, _oB: RatingPerStudentInCourse): number {
        if(_oA.oStudentInCourse) {
            let sA = _oA.oStudentInCourse.oStudent.getName();
            let sB = _oB.oStudentInCourse.oStudent.getName();
            return sA < sB ? -1 : sA > sB ? 1 : (_oA.nTry < _oB.nTry ? -1 : _oA.nTry > _oB.nTry ? 1 : 0);
        } else {
            return super.sort(_oA, _oB);
        }
    }
    
    getGrade(_nC2CId: number) {
        let aTemp = this.aGrade.filter( (_oGrade: Grade) => _oGrade.nC2CId == _nC2CId);
        return aTemp.length == 0 ? null : aTemp[0];
    }
    
    getSumOfPoints() {
        let aPoint: number[] = [];
        this.aGrade.forEach( (_oGrade: Grade) => {
                if(_oGrade.fPoints !== null) {
                    aPoint.push(_oGrade.fPoints);
                }
            });
        return Statistics.sum(aPoint);
    }
    
    injectChildren(_sKey: string, _aItem: any[]) {
        switch(_sKey) {
            case 'grade':
                this.aGrade = _aItem;
                if(this.aGrade.length > 1) {
                    this.aGrade.sort(this.aGrade[0].sort);
                }
                break;
        }
    }
    
    injectForeignKey(_sKey: string, _oItem: any) {
        switch(_sKey) {
                case 'nS2CId':
                    this.oStudentInCourse = <StudentInCourse>_oItem;
                    break;
                case 'nRatId':
                    this.oRating = <Rating>_oItem;
                    break;
                default:
                    super.injectForeignKey(_sKey, _oItem);
                    break;
        }
    }
    
    getTableName() {
        return 'stu2rat';
    }
    
    toString() {
        return JSON.stringify({
            nS2CId: this.nS2CId,
            nRatId: this.nRatId,
            nTry: this.nTry,
            fGrade: this.fGrade,
			sNote: this.sNote
        });
    }
}