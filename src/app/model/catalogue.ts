import { Model } from './_model';
import { Rating } from './rating';
import { CriteriaInCatalogue } from './criteria_in_catalogue';
import { Criteria } from './criteria';

import { Statistics } from '../module/statistics.module';

export class Catalogue extends Model {
	sName: string = '';
	sNote: string = '';
    
    aRating: Rating[] = [];
    aCriteriaInCatalogue: CriteriaInCatalogue[] = [];
    
    constructor(_oData: Object) {
        super(_oData);
        this.update(_oData);
    }
	
	getMinPoints() {
		let aNr: number[] = [];
		for(let oCriteriaInCatalogue of this.aCriteriaInCatalogue) {
            if(!oCriteriaInCatalogue.oCriteria.bOptional) {
                aNr.push(oCriteriaInCatalogue.oCriteria.nMin);
            }
		}
        return aNr.length > 0 ? Statistics.sum(aNr) : 0;
	}
	
	getMaxPoints() {
		let aNr: number[] = [];
		for(let oCriteriaInCatalogue of this.aCriteriaInCatalogue) {
            aNr.push(oCriteriaInCatalogue.oCriteria.nMax);
		}
        return aNr.length > 0 ? Statistics.sum(aNr) : 0;
	}
    
    update(_oData: Object) {
        super.update(_oData);
        if(typeof(_oData['nCatId']) !== 'undefined') {
            this.nId = +_oData['nCatId'];
        }
        if(typeof(_oData['sName']) !== 'undefined') {
            this.sName = _oData['sName'];
        }
        if(typeof(_oData['sNote']) !== 'undefined') {
            this.sNote = _oData['sNote'];
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
        return 'catalogue';
    }
    
    sort(_oA: Catalogue, _oB: Catalogue) {
        let sA = _oA.getName();
        let sB = _oB.getName();
        return sA < sB ? -1 : sA > sB ? 1 : 0;
    }
    
    toString() {
        return JSON.stringify({
            sName: this.sName,
            sNote: this.sNote
        });
    }
}