import { Model } from './_model';
import { Rating } from './rating';
import { StudentInCourse } from './student_in_course';
import { Statistics } from '../module/statistics.module';

export class Course extends Model {
    sName: string = '';
	nWidth: number;
	nHeight: number;
    sCategory: string = '';
    
    aRating: Rating[] = [];
    aStudentInCourse: StudentInCourse[] = [];
    
    constructor(_oData: Object) {
        super(_oData);
        this.update(_oData);
    }
    
    update(_oData: Object) {
        super.update(_oData);
        if(typeof(_oData['nCouId']) !== 'undefined') {
            this.nId = +_oData['nCouId'];
        }
        if(typeof(_oData['sName']) !== 'undefined') {
            this.sName = _oData['sName'];
        }
        if(typeof(_oData['nWidth']) !== 'undefined' && typeof(_oData['nHeight']) !== 'undefined') {
            this.nWidth = +_oData['nWidth'];
            this.nHeight = +_oData['nHeight'];
        }
        if(typeof(_oData['sCategory']) !== 'undefined') {
            this.sCategory = _oData['sCategory'];
        }
    }
    
    getMeanGrade() {
        let aGrade: number[] = [];
        this.aStudentInCourse.forEach( (_oStudentInCourse: StudentInCourse) => {
                if(_oStudentInCourse.fGrade !== null) {
                    aGrade.push(_oStudentInCourse.fGrade);
                }
            });
        return Statistics.mean(aGrade);
    }
    
    calculateWeightPercentage(_nWeight: number) {
        let aNr: number[] = [];
        this.aRating.forEach( (_oRating: Rating) => {
                aNr.push(_oRating.fWeight);
            });
        let nSum = Statistics.sum(aNr);
        return nSum <= 0 ? 0 : (100*_nWeight/nSum).toFixed(2);
    }
    
    injectChildren(_sKey: string, _aItem: any[]) {
        switch(_sKey) {
            case 'rating':
                this.aRating = _aItem;
                if(this.aRating.length > 1) {
                    this.aRating.sort(this.aRating[0].sort);
                }
                break;
            case 'stu2cou':
                this.aStudentInCourse = _aItem;
                if(this.aStudentInCourse.length > 1) {
                    this.aStudentInCourse.sort(this.aStudentInCourse[0].sort);
                }
                break;
        }
    }
    
    getName() {
        return this.sName;
    }
    
    sort(_oA: Course, _oB: Course) {
        let sA = _oA.sCategory + _oA.sName;
        let sB = _oB.sCategory + _oB.sName;
        return sA < sB ? -1 : sA > sB ? 1 : 0;
    }
    
    getTableName() {
        return 'course';
    }
    
    toString() {
        return JSON.stringify({
            sName: this.sName,
            nWidth: this.nWidth,
            nHeight: this.nHeight,
            sCategory: this.sCategory
        });
    }
}