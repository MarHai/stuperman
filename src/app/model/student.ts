import { Model } from './_model';
import { StudentInCourse } from './student_in_course';
import { Email } from './email';
import { Talk } from './talk';

export class Student extends Model {
	sName: string = '';
	sMail: string;
	sNr: string = '';
	sNote: string;
	sImage: string;
    aStudentInCourse: StudentInCourse[] = [];
    aMail: Email[] = [];
    aTalk: Talk[] = [];
    
    constructor(_oData: Object) {
        super(_oData);
        this.update(_oData);
    }
    
    update(_oData: Object) {
        super.update(_oData);
        if(typeof(_oData['nStuId']) !== 'undefined') {
            this.nId = +_oData['nStuId'];
        }
        if(typeof(_oData['sName']) !== 'undefined') {
            this.sName = _oData['sName'];
        }
        if(typeof(_oData['sMail']) !== 'undefined') {
            this.sMail = _oData['sMail'];
        }
        if(typeof(_oData['sNr']) !== 'undefined') {
            this.sNr = _oData['sNr'];
        }
        if(typeof(_oData['sNote']) !== 'undefined') {
            this.sNote = _oData['sNote'];
        }
        if(typeof(_oData['sImage']) !== 'undefined') {
            this.sImage = _oData['sImage'];
        }
    }
    
    injectChildren(_sKey: string, _aItem: any[]) {
        switch(_sKey) {
            case 'stu2cou':
                this.aStudentInCourse = _aItem;
                if(this.aStudentInCourse.length > 1) {
                    this.aStudentInCourse.sort(this.aStudentInCourse[0].sort);
                }
                break;
            case 'email':
                this.aMail = _aItem;
                if(this.aMail.length > 1) {
                    this.aMail.sort(this.aMail[0].sort);
                }
                break;
            case 'talk':
                this.aTalk = _aItem;
                if(this.aTalk.length > 1) {
                    this.aTalk.sort(this.aTalk[0].sort);
                }
                break;
        }
    }
    
    sort(_oA: Student, _oB: Student) {
        let sA = _oA.getName();
        let sB = _oB.getName();
        return sA < sB ? -1 : sA > sB ? 1 : 0;
    }
    
    getName() {
        return this.sName || this.sNr || this.sMail;
    }
    
    getTableName() {
        return 'student';
    }
    
    toString() {
        return JSON.stringify({
            sName: this.sName,
            sMail: this.sMail,
            sNr: this.sNr,
            sNote: this.sNote
        });
    }
}