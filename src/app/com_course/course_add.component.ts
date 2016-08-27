import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { CourseComponent } from './course.component';

import { Course } from '../model/course';
import { Student } from '../model/student';
import { StudentInCourse } from '../model/student_in_course';

enum Status { create = 1, exists = 2 };
enum Step { overview = 1, import_choosecolumn = 2, validate = 3, add = 4, error = 5 };
declare var Papa: any;

@Component({
    selector: 'course-add',
    templateUrl: '../../tmpl/course_add.component.html',
    inputs: [ 'oCourse' ]
})

export class CourseAddComponent extends CourseComponent {
    oNew: { sName: string, sNr: string, sMail: string, sNote: string };
    aStudentTemp: { sName: string, sNr: string, sMail: string, sNote: string, oStudent: Student, eStatus: Status }[] = [];
    aStudent: Student[] = [];
    eStep = Step.overview;
    oColumn: { sName: number, sNr: number, sMail: number, sNote: number };
    aDataTemp: string[][] = [];
    aColumn: string[];
    oProgress: { create: number, link: number, error: string[] };
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
        super.ngOnInit();
        this.aStudent = this.oDataService.getStudents();
        if(this.aStudent.length > 1) {
            this.aStudent.sort(this.aStudent[0].sort);
        }
        this.resetNew();
    }
    
    findStudent(_oStudentData: { sName: string, sNr: string, sMail: string, sNote: string, eStatus?: Status, oStudent?: Student }) {
        let oStudent: Student;
        this.aStudent.forEach( (_oStudent: Student) => {
                if((!_oStudentData.sName || _oStudentData.sName == _oStudent.sName) &&
                    (!_oStudentData.sNr || _oStudentData.sNr == _oStudent.sNr) &&
                    (!_oStudentData.sMail || _oStudentData.sMail == _oStudent.sMail) &&
                    (!_oStudentData.sNote || _oStudentData.sNote == _oStudent.sNote)) {

                    oStudent = _oStudent;
                }
            });
        return oStudent ? oStudent : new Student(_oStudentData);
    }
    
    fillStatus(_oStudentTemp: { sName: string, sNr: string, sMail: string, sNote: string, eStatus?: Status, oStudent?: Student }) {
        if(typeof(_oStudentTemp.eStatus) !== 'undefined' && 
            _oStudentTemp.sName == '' &&
            _oStudentTemp.sNr == '' &&
            _oStudentTemp.sMail == '' &&
            _oStudentTemp.sNote == '') {
            
            //ugly explicit type conversion
            this.remove(<{ sName: string, sNr: string, sMail: string, sNote: string, oStudent: Student, eStatus: Status }>_oStudentTemp);
        }
        _oStudentTemp.oStudent = this.findStudent(_oStudentTemp);
        _oStudentTemp.eStatus = Status.create;
        let oReturn = <{ sName: string, sNr: string, sMail: string, sNote: string, oStudent: Student, eStatus: Status }>_oStudentTemp;
        if(oReturn.oStudent.nId > 0) {
            oReturn.eStatus = Status.exists;
            this.resetEdit(oReturn);
        }
        return oReturn;
    }
    
    
    add(_bSuppressAlert = false) {
        this.oNew.sName = this.oNew.sName.trim() || '';
        this.oNew.sNr = this.oNew.sNr.trim() || '';
        this.oNew.sMail = this.oNew.sMail.trim() || '';
        this.oNew.sNote = this.oNew.sNote.trim() || '';
        if(this.oNew.sName != '' || this.oNew.sNr != '' || this.oNew.sMail != '') {
            let oStudentTemp = this.fillStatus({ sName: this.oNew.sName, sNr: this.oNew.sNr, sMail: this.oNew.sMail, sNote: this.oNew.sNote });
            if(this.hasStudentAlreadyBeenAdded(oStudentTemp)) {
                if(!_bSuppressAlert) {
                    this.oPopupService.alert(this.s('error.duplicate', oStudentTemp.sName || oStudentTemp.sNr || oStudentTemp.sMail));
                }
                return false;
            } else {
                this.aStudentTemp.push(oStudentTemp);
                return true;
            }
        }
        return false;
    }
    
    remove(_oStudentTemp: { sName: string, sNr: string, sMail: string, sNote: string, oStudent: Student, eStatus: Status }) {
        this.aStudentTemp = this.aStudentTemp.filter( (_oStudentTempIterator) => _oStudentTemp != _oStudentTempIterator);
    }
    
    hasStudentAlreadyBeenAdded(_oStudentTemp: 
        { sName: string, sNr: string, sMail: string, sNote: string, oStudent: Student, eStatus: Status }) {
        
        return this.isStudentInCurrentList(_oStudentTemp) == true || this.isStudentInCurrentCourse(_oStudentTemp) == true;
    }
    
    isStudentInCurrentList(_oStudent: { sName: string, sNr: string, sMail: string, sNote: string, oStudent: Student, eStatus: Status }) {
        let bFound = false;
        this.aStudentTemp.forEach( (_oStudentTempIterator: 
            { sName: string, sNr: string, sMail: string, sNote: string, oStudent: Student, eStatus: Status }) => {
                if(_oStudent.eStatus == Status.exists &&
                    _oStudentTempIterator.eStatus == Status.exists && 
                    _oStudentTempIterator.oStudent.nId == _oStudent.oStudent.nId) {
                    
                    bFound = true;
                    return true;
                } else if(_oStudent.eStatus == Status.create &&
                          _oStudent.sName == _oStudentTempIterator.sName &&
                          _oStudent.sNr == _oStudentTempIterator.sNr &&
                          _oStudent.sMail == _oStudentTempIterator.sMail &&
                          _oStudent.sNote == _oStudentTempIterator.sNote) {
                    
                    bFound = true;
                    return true;
                }
            });
        return bFound;
    }
    
    isStudentInCurrentCourse(_oStudent: { sName: string, sNr: string, sMail: string, sNote: string, oStudent: Student, eStatus: Status }) {
        let bFound = false;
        if(_oStudent.eStatus == Status.exists) {
            this.oCourse.aStudentInCourse.forEach( (_oStudentInCourse: StudentInCourse) => {
                    if(_oStudentInCourse.nStuId == _oStudent.oStudent.nId) {
                        bFound = true;
                        return true;
                    }
                });
        }
        return bFound;
    }
    
    importData(_aRow: string[][]) {
        if(_aRow.length > 0 && typeof(_aRow[0].length) !== 'undefined' && _aRow[0].length > 0) {
            this.aDataTemp = _aRow;
            this.oColumn = { 
                sName: 1, 
                sNr: _aRow[0].length > 1 ? 2 : 0, 
                sMail: _aRow[0].length > 2 ? 3 : 0, 
                sNote: _aRow[0].length > 3 ? 4 : 0
            };
            this.aColumn = [];
            this.aColumn.push(this.w('course_add.column_choose.option.skip'));
            for(let i in <string[]>_aRow[0]) {
                this.aColumn.push(this.s('course_add.column_choose.option', +i+1, _aRow[0][i]));
            }
            this.eStep = Step.import_choosecolumn;
        }
    }
    
    checkAddFinality() {
        if((this.oProgress.create + this.oProgress.link + this.oProgress.error.length) == this.aStudentTemp.length) {
            if(this.oProgress.error.length > 0) {
                this.eStep = Step.error;
            } else {
                this.oRouter.navigate([ 'app', 'course', this.oCourse.nId ]);
            }
        }
    }
    
    
    
    
    onClickValidate(_bReally = false) {
        if(_bReally) {
            this.oProgress = { create: 0, link: 0, error: [] };
            this.eStep = Step.add;
            this.aStudentTemp.forEach( (_oStudent) => {
                    if(_oStudent.eStatus == Status.create) {
                        this.oDataService.addItem(_oStudent.oStudent, ( _bSuccess: boolean) => {
                                if(_bSuccess) {
                                    this.oProgress.create++;
                                    this.oDataService.addItem(
                                        new StudentInCourse({ nStuId: _oStudent.oStudent.nId, nCouId: this.oCourse.nId }),
                                        ( _bSuccess: boolean) => {

                                            if(_bSuccess) {
                                                this.oProgress.link++;
                                            } else {
                                                this.oProgress.error.push(this.s('error.add', this.w('connection') + 
                                                    '(' + _oStudent.sName || _oStudent.sNr || _oStudent.sMail + ')'));
                                            }
                                            this.checkAddFinality();
                                        });
                                } else {
                                    this.oProgress.error.push(this.s('error.add', _oStudent.sName || _oStudent.sNr || _oStudent.sMail));
                                }
                                this.checkAddFinality();
                            });
                    } else {
                        if(this.isStudentInCurrentCourse(_oStudent)) {
                            this.oProgress.error.push(this.s('error.duplicate', _oStudent.sName || _oStudent.sNr || _oStudent.sMail));
                            this.checkAddFinality();
                        } else {
                            this.oDataService.addItem(new StudentInCourse({ nStuId: _oStudent.oStudent.nId, nCouId: this.oCourse.nId }),
                                ( _bSuccess: boolean) => {

                                    if(_bSuccess) {
                                        this.oProgress.link++;
                                    } else {
                                        this.oProgress.error.push(this.s('error.add', this.w('connection') + 
                                            '(' + _oStudent.sName || _oStudent.sNr || _oStudent.sMail + ')'));
                                    }
                                    this.checkAddFinality();
                                });
                        }
                    }
                });
        } else {
            this.aDataTemp = [ [], [] ];
            this.aStudentTemp.forEach( (_oStudent) => {
                    this.aDataTemp[_oStudent.eStatus == Status.create ? 0 : 1].push(_oStudent.sName || _oStudent.sNr || _oStudent.sMail);
                });
            this.eStep = Step.validate;
        }
    }
    
    onSubmitColumnChoose() {
        let nColName = (+this.oColumn.sName) - 1;
        let nColNr = (+this.oColumn.sNr) - 1;
        let nColMail = (+this.oColumn.sMail) - 1;
        let nColNote = (+this.oColumn.sNote) - 1;
        if(nColName >= 0 || nColNr >= 0 || nColMail >= 0) {
            this.aDataTemp.forEach( (_aRow: string[]) => {
                    this.resetNew();
                    if(nColName >= 0 && _aRow[nColName]) {
                        this.oNew.sName = _aRow[nColName];
                    }
                    if(nColNr >= 0 && _aRow[nColNr]) {
                        this.oNew.sNr = _aRow[nColNr];
                    }
                    if(nColMail >= 0 && _aRow[nColMail]) {
                        this.oNew.sMail = _aRow[nColMail];
                    }
                    if(nColNote >= 0 && _aRow[nColNote]) {
                        this.oNew.sNote = _aRow[nColNote];
                    }
                    this.add(true);
                });
        }
        this.eStep = Step.overview;
    }
    
    resetNew() {
        this.oNew = { sName: '', sNr: '', sMail: '', sNote: '' };
    }
    
    resetEdit(_oStudentTemp: { sName: string, sNr: string, sMail: string, sNote: string, oStudent: Student, eStatus: Status }) {
        _oStudentTemp.sName = _oStudentTemp.oStudent.sName;
        _oStudentTemp.sNr = _oStudentTemp.oStudent.sNr;
        _oStudentTemp.sMail = _oStudentTemp.oStudent.sMail;
        _oStudentTemp.sNote = _oStudentTemp.oStudent.sNote;
    }
    
    
    
    onClickBack() {
        if(this.eStep == 1) {
            this.oRouter.navigate([ 'app', 'course', this.oCourse.nId ]);
        } else {
            this.eStep--;
        }
    }
    
    onKeyEdit(_oStudentTemp: { sName: string, sNr: string, sMail: string, sNote: string, oStudent: Student, eStatus: Status }, _oEvent: any) {
        if(_oEvent.keyCode == 13) {
            this.fillStatus(_oStudentTemp);
        } else if(_oEvent.keyCode == 27) {
            this.resetEdit(_oStudentTemp);
        }
    }
    
    onPasteNew(_sField: string, _sPaste: string) {
        let oCsv = Papa.parse(_sPaste.trim());
        if(oCsv.errors.length == 1 && oCsv.errors[0].code == 'UndetectableDelimiter') {
            oCsv.data.forEach( (_aRow: string[]) => {
                    this.resetNew();
                    this.oNew[_sField] = _aRow[0].trim();
                    this.add(true);
                });
            this.resetNew();
        } else if(oCsv.errors.length > 0) {
            this.oPopupService.alert(this.w('error.import'));
            oCsv.errors.forEach( (_oError: Object) => console.log(_oError['message'], _oError));
        } else {
            this.importData(oCsv.data);
        }
        return false;
    }
    
    onUploadFile(_aFile: File[]) {
        if(_aFile.length > 0) {
            Papa.parse(_aFile[0], {
                complete: ( _oResult: { errors: any[], data: string[][], meta: any }) => {
                    if(_oResult.errors.length == 1 && _oResult.errors[0].code == 'UndetectableDelimiter') {
                        this.importData(_oResult.data);
                    } else if(_oResult.errors.length > 0) {
                        this.oPopupService.alert(this.w('error.import'));
                        _oResult.errors.forEach( (_oError: Object) => console.log(_oError['message'], _oError));
                    } else {
                        this.importData(_oResult.data);
                    }
                }
            });
        }
    }
    
    onKeyNew(_oEvent: any) {
        switch(_oEvent.keyCode) {
            case 13: //enter
                if(this.add()) {
                    this.resetNew();
                }
                break;
            case 27: //esc
                this.resetNew();
                break;
        }
    }
}
