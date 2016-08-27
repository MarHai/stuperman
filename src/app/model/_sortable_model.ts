import { Model } from './_model';

export class SortableModel extends Model {
    nSort: number;
    
    update(_oData: Object) {
        super.update(_oData);
        if(typeof(_oData['nSort']) !== 'undefined') {
            this.nSort = +_oData['nSort'];
        }
    }
    
    sort<T extends SortableModel>(_oA: T, _oB: T) {
        let nA = _oA.nSort;
        let nB = _oB.nSort;
        return nA < nB ? -1 : nA > nB ? 1 : 0;
    }
}