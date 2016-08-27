import { Model } from './_model';
import { User } from './user';
import { Student } from './student';

export class Email extends Model {
	sRecipient: string = '';
	sSubject: string = '';
	sMail: string = '';
	sHeader: string;
    
	nUseId: number;
	nRecipientStuId: number = null;
	nRecipientUseId: number = null;
    
    oSender: User;
    oRecipient: any;
    
    constructor(_oData: Object) {
        super(_oData);
        this.update(_oData);
    }
    
    update(_oData: Object) {
        super.update(_oData);
        if(typeof(_oData['nEmaId']) !== 'undefined') {
            this.nId = +_oData['nEmaId'];
        }
        if(typeof(_oData['sRecipient']) !== 'undefined') {
            this.sRecipient = _oData['sRecipient'];
        }
        if(typeof(_oData['sSubject']) !== 'undefined') {
            this.sSubject = _oData['sSubject'];
        }
        if(typeof(_oData['sMail']) !== 'undefined') {
            this.sMail = _oData['sMail'];
        }
        if(typeof(_oData['sHeader']) !== 'undefined') {
            this.sHeader = _oData['sHeader'];
        }
        if(typeof(_oData['nRecipientStuId']) !== 'undefined') {
            this.nRecipientStuId = +_oData['nRecipientStuId'];
        }
        if(typeof(_oData['nRecipientUseId']) !== 'undefined') {
            this.nRecipientUseId = +_oData['nRecipientUseId'];
        }
        if(typeof(_oData['nUseId']) !== 'undefined') {
            this.nUseId = +_oData['nUseId'];
        }
    }
    
    injectForeignKey(_sKey: string, _oItem: any) {
        switch(_sKey) {
                case 'nRecipientStuId':
                    this.oRecipient = <Student>_oItem;
                    break;
                case 'nRecipientUseId':
                    this.oRecipient = <User>_oItem;
                    break;
                case 'nUseId':
                    this.oSender = <User>_oItem;
                    break;
                default:
                    super.injectForeignKey(_sKey, _oItem);
                    break;
        }
    }
    
    getName() {
        return this.sSubject;
    }
    
    getTableName() {
        return 'email';
    }
    
    toString() {
        return JSON.stringify({
            sRecipient: this.sRecipient,
            sSubject: this.sSubject,
            sMail: this.sMail,
            sHeader: this.sHeader,
            nUseId: this.nUseId,
            nRecipientStuId: this.nRecipientStuId,
            nRecipientUseId: this.nRecipientUseId
        });
    }
}