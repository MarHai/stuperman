import { Model } from './_model';
import { Catalogue } from './catalogue';
import { Course } from './course';
import { Email } from './email';
import { Student } from './student';
import { Talk } from './talk';

export class User extends Model {
	sUser: string = '';
	sName: string = '';
	sMail: string = '';
	bAdmin: boolean = false;
	bOfflineSync: boolean;
	eLanguage: string = 'de_DE';
	eDialect: string = 'school';
    
    aCatalogue: Catalogue[] = [];
    aCourse: Course[] = [];
    aStudent: Student[] = [];
    aMail: Email[] = [];
    aTalk: Talk[] = [];
    
    constructor(_oData: Object) {
        super(_oData);
        this.update(_oData);
    }
    
    update(_oData: Object) {
        super.update(_oData);
        this.nId = this.nUseId;
        this.nUseId = null;
        if(typeof(_oData['sUser']) !== 'undefined') {
            this.sUser = _oData['sUser'];
        }
        if(typeof(_oData['sName']) !== 'undefined') {
            this.sName = _oData['sName'];
        }
        if(typeof(_oData['sMail']) !== 'undefined') {
            this.sMail = _oData['sMail'];
        }
        if(typeof(_oData['bOfflineSync']) !== 'undefined') {
            this.bOfflineSync = +_oData['bOfflineSync'] == 1 ? true : false;
        }
        if(typeof(_oData['bAdmin']) !== 'undefined') {
            this.bAdmin = +_oData['bAdmin'] == 1 ? true : false;
        }
        if(typeof(_oData['eLanguage']) !== 'undefined') {
            this.eLanguage = _oData['eLanguage'];
        }
        if(typeof(_oData['eDialect']) !== 'undefined') {
            this.eDialect = _oData['eDialect'];
        }
    }
    
    injectChildren(_sKey: string, _aItem: any[]) {
        switch(_sKey) {
            case 'catalogue':
                this.aCatalogue = _aItem;
                if(this.aCatalogue.length > 1) {
                    this.aCatalogue.sort(this.aCatalogue[0].sort);
                }
                break;
            case 'course':
                this.aCourse = _aItem;
                if(this.aCourse.length > 1) {
                    this.aCourse.sort(this.aCourse[0].sort);
                }
                break;
            case 'student':
                this.aStudent = _aItem;
                if(this.aStudent.length > 1) {
                    this.aStudent.sort(this.aStudent[0].sort);
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
    
    getName() {
        return this.sName != '' ? this.sName : this.sUser;
    }
    
    getTableName() {
        return 'user';
    }
    
    toString() {
        return JSON.stringify({
            sName: this.sName,
            sUser: this.sUser,
            sMail: this.sMail,
            eLanguage: this.eLanguage,
            eDialect: this.eDialect,
			bOfflineSync: this.bOfflineSync
        });
    }
}