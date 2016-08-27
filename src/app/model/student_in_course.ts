import { Model } from './_model';
import { Student } from './student';
import { Course } from './course';
import { Rating } from './rating';
import { RatingPerStudentInCourse } from './rating_per_student_in_course';

import { i18n } from '../module/i18n.module';

export class StudentInCourse extends Model {
	nStuId: number;
	oStudent: Student;
	nCouId: number;
	oCourse: Course;
	fGrade: number;
	bGradeManual: boolean;
	nPosX: number;
	nPosY: number;
    
    private aRatingPerStudentInCourse: RatingPerStudentInCourse[] = [];
    
    constructor(_oData: Object) {
        super(_oData);
        this.update(_oData);
    }
    
    numOfTries(_nRatId: number) {
        var nMax = 0;
        this.aRatingPerStudentInCourse.forEach( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                if(_oRatingPerStudentInCourse.nRatId == _nRatId && _oRatingPerStudentInCourse.nTry > nMax) {
                    nMax = _oRatingPerStudentInCourse.nTry;
                }
            });
        return nMax;
    }
    
    getRatings(_nRatId: number = 0, _nTry: number = 1) {
        let aTry = this.aRatingPerStudentInCourse.filter( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => 
            (_oRatingPerStudentInCourse.nTry == _nTry || _nTry == 0) && (_oRatingPerStudentInCourse.nRatId == _nRatId || _nRatId == 0));
        if(aTry.length > 1) {
            aTry.sort(aTry[0].sort);
        }
        return aTry;
    }
    
    getRatingsFromFinalTry(_nRatId: number = 0) {
        let aTry: RatingPerStudentInCourse[] = [];
        this.getRatings(_nRatId).forEach( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                let nNumOfTries = this.numOfTries(_oRatingPerStudentInCourse.nRatId);
                if(nNumOfTries > 1) {
                    let aTemp = this.getRatings(_oRatingPerStudentInCourse.nRatId, nNumOfTries);
                    if(aTemp.length > 0) {
                        aTry.push(aTemp[0]);
                    }
                } else {
                    aTry.push(_oRatingPerStudentInCourse);
                }
            });
        if(aTry.length > 1) {
            aTry.sort(aTry[0].sort);
        }
        return aTry;
    }
    
    stringifyFinalGrade(_oRating: Rating) {
        let sGrade: string = '';
        let aTry = this.getRatingsFromFinalTry(_oRating.nId);
        if(aTry.length > 0) {
            if(_oRating.oSystem.aGrade.indexOf(aTry[0].fGrade) >= 0) {
                sGrade = aTry[0].fGrade.toString();
            } else if(aTry[0].nTry > 1) {
                sGrade = i18n.get('coursegradenotyet');
            }
        }
        return sGrade;
    }
    
    update(_oData: Object) {
        super.update(_oData);
        if(typeof(_oData['nS2CId']) !== 'undefined') {
            this.nId = +_oData['nS2CId'];
        }
        if(typeof(_oData['nStuId']) !== 'undefined') {
            this.nStuId = +_oData['nStuId'];
        }
        if(typeof(_oData['nCouId']) !== 'undefined') {
            this.nCouId = +_oData['nCouId'];
        }
        if(typeof(_oData['fGrade']) !== 'undefined') {
            this.fGrade = _oData['fGrade'] === null ? null : +_oData['fGrade'];
        }
        if(typeof(_oData['bGradeManual']) !== 'undefined') {
            this.bGradeManual = +_oData['bGradeManual'] == 1 ? true : false;
        }
        if(typeof(_oData['nPosX']) !== 'undefined' && typeof(_oData['nPosY']) !== 'undefined') {
            this.nPosX = _oData['nPosX'] === null ? null : +_oData['nPosX'];
            this.nPosY = _oData['nPosY'] === null ? null : +_oData['nPosY'];
        }
    }
    
    injectChildren(_sKey: string, _aItem: any[]) {
        switch(_sKey) {
            case 'stu2rat':
                this.aRatingPerStudentInCourse = _aItem;
                if(this.aRatingPerStudentInCourse.length > 1) {
                    this.aRatingPerStudentInCourse.sort(this.aRatingPerStudentInCourse[0].sort);
                }
                break;
        }
    }
    
    injectForeignKey(_sKey: string, _oItem: any) {
        switch(_sKey) {
                case 'nStuId':
                    this.oStudent = <Student>_oItem;
                    break;
                case 'nCouId':
                    this.oCourse = <Course>_oItem;
                    break;
                default:
                    super.injectForeignKey(_sKey, _oItem);
                    break;
        }
    }
    
    sort(_oA: StudentInCourse, _oB: StudentInCourse) {
        let sA = _oA.oStudent ? _oA.oStudent.getName() : _oA.nStuId;
        let sB = _oB.oStudent ? _oB.oStudent.getName() : _oB.nStuId;
        return sA < sB ? -1 : sA > sB ? 1 : 0;
    }
    
    getName() {
        return i18n.sentence('stu2cou', this.oStudent.getName(), this.oCourse.getName());
    }
    
    getTableName() {
        return 'stu2cou';
    }
    
    toString() {
        return JSON.stringify({
            nCouId: this.nCouId,
            nStuId: this.nStuId,
            fGrade: this.fGrade,
            nPosX: this.nPosX,
            nPosY: this.nPosY
        });
    }
}