import { Model } from './_model';
import { Rating } from './rating';

export class System extends Model {
	sGroup: string = '';
	sName: string = '';
	aGrade: number[] = [];
	nGradeBest: number;
	aGradeFail: number[] = [];
    
    aRating: Rating[] = [];
    
    constructor(_oData: Object) {
        super(_oData);
        this.update(_oData);
    }
    
    update(_oData: Object) {
        super.update(_oData);
        if(typeof(_oData['nSysId']) !== 'undefined') {
            this.nId = +_oData['nSysId'];
        }
        if(typeof(_oData['sName']) !== 'undefined') {
            this.sName = _oData['sName'];
        }
        if(typeof(_oData['sGroup']) !== 'undefined') {
            this.sGroup = _oData['sGroup'];
        }
        if(typeof(_oData['sGrade']) !== 'undefined') {
            this.aGrade = [];
            this.aGradeFail = [];
            _oData['sGrade'].split(',').forEach( (_sGrade: string) => {
                this.aGrade.push(+_sGrade.trim());
            });
            if(typeof(_oData['sGradeFail']) !== 'undefined') {
                _oData['sGradeFail'].split(',').forEach( (_sGrade: string) => {
                    let nGrade = +_sGrade.trim();
                    if(this.aGrade.indexOf(nGrade) >= 0) {
                        this.aGradeFail.push(nGrade);
                    }
                });
            }
            if(typeof(_oData['sGradeBest']) !== 'undefined') {
                let nGrade = +_oData['sGradeBest'].trim();
                if(this.aGrade.indexOf(nGrade) >= 0) {
                    this.nGradeBest = nGrade;
                }
            }
        }
    }
    
    injectChildren(_sKey: string, _aItem: any[]) {
        switch(_sKey) {
            case 'rating':
                this.aRating = _aItem;
                if(this.aRating.length > 1) {
                    this.aRating.sort(this.aRating[0].sort);
                }
                break;
        }
    }
    
    getName() {
        return this.sName + (this.sGroup.length > 1 ? (' (' + this.sGroup + ')') : '');
    }
    
    getTableName() {
        return 'system';
    }
    
    sort(_oA: System, _oB: System) {
        let sA = _oA.sGroup + _oA.sName;
        let sB = _oB.sGroup + _oB.sName;
        return sA < sB ? -1 : sA > sB ? 1 : 0;
    }
    
    toString() {
        return JSON.stringify({
            sGroup: this.sGroup,
            sName: this.sName,
            sGrade: this.aGrade.join(','),
            sGradeFail: this.aGradeFail.join(','),
            sGradeBest: this.nGradeBest
        });
    }
}