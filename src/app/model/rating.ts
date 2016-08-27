import { SortableModel } from './_sortable_model';
import { Course } from './course';
import { Catalogue } from './catalogue';
import { System } from './system';
import { RatingPerStudentInCourse } from './rating_per_student_in_course';

export class Rating extends SortableModel {
	sName: string = '';
	sNote: string;
	nCouId: number = null;
	oCourse: Course;
	nCatId: number = null;
	oCatalogue: Catalogue;
	nSysId: number = null;
	oSystem: System;
	fWeight: number = 1;
    
    private aRatingPerStudentInCourse: RatingPerStudentInCourse[] = [];
    
    constructor(_oData: Object) {
        super(_oData);
        this.update(_oData);
    }
    
    numOfTries(_nS2CId: number = 0) {
        var nMax = 0;
        this.aRatingPerStudentInCourse.forEach( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
        if(_oRatingPerStudentInCourse.nTry > nMax && (_oRatingPerStudentInCourse.nS2CId == _nS2CId || _nS2CId == 0)) {
                    nMax = _oRatingPerStudentInCourse.nTry;
                }
            });
        return nMax;
    }
    
    getRatings(_nS2CId: number = 0, _nTry: number = 1) {
        let aTry = this.aRatingPerStudentInCourse.filter( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => 
            _oRatingPerStudentInCourse.nTry == _nTry && (_oRatingPerStudentInCourse.nS2CId == _nS2CId || _nS2CId == 0));
        if(aTry.length > 1) {
            aTry.sort(aTry[0].sort);
        }
        return aTry;
    }
    
    getRatingsFromFinalTry(_nS2CId: number = 0) {
        let aTry: RatingPerStudentInCourse[] = [];
        this.getRatings(_nS2CId).forEach( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                let nNumOfTries = this.numOfTries(_oRatingPerStudentInCourse.nS2CId);
                if(nNumOfTries > 1) {
                    let aTemp = this.getRatings(_oRatingPerStudentInCourse.nS2CId, nNumOfTries);
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
    
    update(_oData: Object) {
        super.update(_oData);
        if(typeof(_oData['nRatId']) !== 'undefined') {
            this.nId = +_oData['nRatId'];
        }
        if(typeof(_oData['sName']) !== 'undefined') {
            this.sName = _oData['sName'];
        }
        if(typeof(_oData['sNote']) !== 'undefined') {
            this.sNote = _oData['sNote'];
        }
        if(typeof(_oData['nCouId']) !== 'undefined') {
            this.nCouId = +_oData['nCouId'];
        }
        if(typeof(_oData['nCatId']) !== 'undefined') {
            this.nCatId = +_oData['nCatId'];
        }
        if(typeof(_oData['nSysId']) !== 'undefined') {
            this.nSysId = +_oData['nSysId'];
        }
        if(typeof(_oData['fWeight']) !== 'undefined') {
            this.fWeight = +_oData['fWeight'];
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
                case 'nCouId':
                    this.oCourse = <Course>_oItem;
                    break;
                case 'nCatId':
                    this.oCatalogue = <Catalogue>_oItem;
                    break;
                case 'nSysId':
                    this.oSystem = <System>_oItem;
                    break;
                default:
                    super.injectForeignKey(_sKey, _oItem);
                    break;
        }
    }
    
    getHistogramData() {
        let aHistogramData: number[] = [];
        this.oSystem.aGrade.forEach( (_nGrade: number) => {
                let nNr = 0;
                this.getRatingsFromFinalTry().forEach( (_oRatingPerStudentInCourse: RatingPerStudentInCourse) => {
                        if(_oRatingPerStudentInCourse.fGrade == _nGrade) {
                            nNr++;
                        }
                    });
                aHistogramData.push(nNr);
            });
        return aHistogramData;
    }
    
    getName() {
        return this.sName;
    }
    
    getTableName() {
        return 'rating';
    }
    
    toString() {
        return JSON.stringify({
            sName: this.sName,
            sNote: this.sNote,
            nCouId: this.nCouId,
            nCatId: this.nCatId,
            nSysId: this.nSysId,
            fWeight: this.fWeight
        });
    }
}