import { SortableModel } from './_sortable_model';
import { Catalogue } from './catalogue';
import { Criteria } from './criteria';
import { Grade } from './grade';

import { i18n } from '../module/i18n.module';
import { Statistics } from '../module/statistics.module';

export class CriteriaInCatalogue extends SortableModel {
	nCatId: number;
	oCatalogue: Catalogue;
	nCriId: number;
	oCriteria: Criteria;
    
    aGrade: Grade[] = [];
    
    constructor(_oData: Object) {
        super(_oData);
        this.update(_oData);
    }
    
    update(_oData: Object) {
        super.update(_oData);
        if(typeof(_oData['nC2CId']) !== 'undefined') {
            this.nId = +_oData['nC2CId'];
        }
        if(typeof(_oData['nCatId']) !== 'undefined') {
            this.nCatId = +_oData['nCatId'];
        }
        if(typeof(_oData['nCriId']) !== 'undefined') {
            this.nCriId = +_oData['nCriId'];
        }
    }
    
    injectChildren(_sKey: string, _aItem: any[]) {
        switch(_sKey) {
            case 'grade':
                this.aGrade = _aItem;
                if(this.aGrade.length > 1) {
                    this.aGrade.sort(this.aGrade[0].sort);
                }
                break;
        }
    }
    
    injectForeignKey(_sKey: string, _oItem: any) {
        switch(_sKey) {
                case 'nCatId':
                    this.oCatalogue = <Catalogue>_oItem;
                    break;
                case 'nCriId':
                    this.oCriteria = <Criteria>_oItem;
                    break;
                default:
                    super.injectForeignKey(_sKey, _oItem);
                    break;
        }
    }
    
    getMinPoints() {
        var nMin: number = null;
        this.aGrade.forEach( (_oGrade: Grade) => {
                if(_oGrade.fPoints !== null && (nMin === null || _oGrade.fPoints < nMin)) {
                    nMin = _oGrade.fPoints;
                }
            });
        return nMin;
    }
    
    getMaxPoints() {
        var nMax: number = null;
        this.aGrade.forEach( (_oGrade: Grade) => {
                if(_oGrade.fPoints !== null && (nMax === null || _oGrade.fPoints > nMax)) {
                    nMax = _oGrade.fPoints;
                }
            });
        return nMax;
    }
    
    getMeanPoints() {
        var aNr: number[] = [];
        this.aGrade.forEach( (_oGrade: Grade) => {
                if(_oGrade.fPoints !== null) {
                    aNr.push(_oGrade.fPoints);
                }
            });
        return Statistics.mean(aNr);
    }
    
    getName() {
        return i18n.sentence('cat2cri', this.oCriteria.getName(), this.oCatalogue.getName());
    }
    
    getTableName() {
        return 'cat2cri';
    }
    
    toString() {
        return JSON.stringify({
            nCatId: this.nCatId,
            nCriId: this.nCriId
        });
    }
}