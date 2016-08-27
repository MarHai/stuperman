import { Model } from './_model';
import { Student } from './student';

export class Talk extends Model {
    sName: string = '';
    sNote: string = '';
	nStuId: number;
    oStudent: Student;
    
    constructor(_oData: Object) {
        super(_oData);
        this.update(_oData);
    }
    
    update(_oData: Object) {
        super.update(_oData);
        if(typeof(_oData['nTalId']) !== 'undefined') {
            this.nId = +_oData['nTalId'];
        }
        if(typeof(_oData['sName']) !== 'undefined') {
            this.sName = _oData['sName'];
        }
        if(typeof(_oData['sNote']) !== 'undefined') {
            this.sNote = _oData['sNote'];
        }
        if(typeof(_oData['nStuId']) !== 'undefined') {
            this.nStuId = +_oData['nStuId'];
        }
    }
    
    injectForeignKey(_sKey: string, _oItem: any) {
        switch(_sKey) {
                case 'nStuId':
                    this.oStudent = <Student>_oItem;
                    break;
                default:
                    super.injectForeignKey(_sKey, _oItem);
                    break;
        }
    }
    
    getName() {
        return this.dCreate.toLocaleDateString() + ': ' + this.sName;
    }
    
    getTableName() {
        return 'talk';
    }
    
    toString() {
        return JSON.stringify({
            sName: this.sName,
            sNote: this.sNote,
            nUseId: this.nUseId,
            nStuId: this.nStuId ? this.nStuId : null
        });
    }
}