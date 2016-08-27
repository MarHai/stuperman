import { User } from './user';

export class Model {
    nId: number;
	nUseId: number;
	oUser: User;
	dCreate: Date;
	dUpdate: Date;
	bArchive: boolean;
    
    private oInitialData: Object;
    
    constructor(_oData: Object) {}
    
    update(_oData: Object) {
        this.oInitialData = _oData;
        
        if(_oData['nUseId']) {
            this.nUseId = +_oData['nUseId'];
        }
        if(typeof(_oData['dCreate']) !== 'undefined') {
            this.dCreate = new Date(1000* +_oData['dCreate']);
        }
        if(typeof(_oData['dUpdate']) !== 'undefined') {
            this.dUpdate = new Date(1000* +_oData['dUpdate']);
        }
        if(typeof(_oData['bArchive']) !== 'undefined') {
            this.bArchive = +_oData['bArchive'] == 1 ? true : false;
        }
    }
    
    getInitialData() {
        return this.oInitialData;
    }
    
    injectForeignKey(_sKey: string, _oItem: any) {
        if(_sKey == 'nUseId') {
            this.oUser = <User>_oItem;
        }
    }
    
    injectChildren(_sTable: string, _aItem: any[]) {}
	
    getName() {
        return this.getTableName() + ' #' + this.nId.toString();
    }
    
    getTableName() {
        return '';
    }
    
    sort<T extends Model>(_oA: T, _oB: T) {
        let dA = _oA.dUpdate || _oA.dCreate;
        let dB = _oB.dUpdate || _oB.dCreate;
        return dA < dB ? -1 : dA > dB ? 1 : 0;
    }
    
    clone() {
        //without the type assertion, an error on compilation is raised
        //http://stackoverflow.com/questions/28150967/typescript-cloning-object
        //https://github.com/Microsoft/TypeScript/issues/1946
        return new (<any>this).constructor(JSON.parse(this.toString()));
    }
    
    toString() {
        return JSON.stringify({});
    }
}