import { Model } from './_model';
import { CriteriaInCatalogue } from './criteria_in_catalogue';

export class Criteria extends Model {
	sName: string = '';
	sNote: string = '';
	nMin: number = 1;
	nMax: number = 10;
	bOptional: boolean = false;
    
    aCriteriaInCatalogue: CriteriaInCatalogue[] = [];
    
    constructor(_oData: Object) {
        super(_oData);
        this.update(_oData);
    }
    
    update(_oData: Object) {
        super.update(_oData);
        if(typeof(_oData['nCriId']) !== 'undefined') {
            this.nId = +_oData['nCriId'];
        }
        if(typeof(_oData['sName']) !== 'undefined') {
            this.sName = _oData['sName'];
        }
        if(typeof(_oData['sNote']) !== 'undefined') {
            this.sNote = _oData['sNote'];
        }
        if(typeof(_oData['nMin']) !== 'undefined') {
            this.nMin = +_oData['nMin'];
        }
        if(typeof(_oData['nMax']) !== 'undefined') {
            this.nMax = +_oData['nMax'];
        }
        if(typeof(_oData['bOptional']) !== 'undefined') {
            this.bOptional = +_oData['bOptional'] == 1 ? true : false;
        }
    }
    
    injectChildren(_sKey: string, _aItem: any[]) {
        switch(_sKey) {
            case 'cat2cri':
                this.aCriteriaInCatalogue = _aItem;
                if(this.aCriteriaInCatalogue.length > 1) {
                    this.aCriteriaInCatalogue.sort(this.aCriteriaInCatalogue[0].sort);
                }
                break;
        }
    }
    
    getName() {
        return this.sName;
    }
    
    getTableName() {
        return 'criteria';
    }
    
    toString() {
        return JSON.stringify({
            sName: this.sName,
            sNote: this.sNote,
            nMin: this.nMin,
            nMax: this.nMax,
            bOptional: this.bOptional
        });
    }
}
