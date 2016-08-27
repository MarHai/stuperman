import { Model } from './_model';
import { CriteriaInCatalogue } from './criteria_in_catalogue';
import { RatingPerStudentInCourse } from './rating_per_student_in_course';

export class Grade extends Model {
	nC2CId: number;
	oCriteriaInCatalogue: CriteriaInCatalogue;
	nS2RId: number;
	oRatingPerStudentInCourse: RatingPerStudentInCourse;
	private _fPoints: number;
    private _sNote: string;
    private bDirty: boolean = false;
    
    constructor(_oData: Object) {
        super(_oData);
        this.update(_oData);
    }
    
    get fPoints(): number {
        return this._fPoints ? this._fPoints : null;
    }

    set fPoints(_nValue: number) {
        if(this._fPoints != _nValue) {
            this.bDirty = true;
            this._fPoints = _nValue;
        }
    }
    
    get sNote(): string {
        return this._sNote;
    }

    set sNote(_sValue: string) {
        if(this._sNote != _sValue) {
            this.bDirty = true;
            this._sNote = _sValue;
        }
    }
    
    isDirty() {
        return this.bDirty;
    }
    
    update(_oData: Object) {
        super.update(_oData);
        if(typeof(_oData['nGraId']) !== 'undefined') {
            this.nId = +_oData['nGraId'];
        }
        if(typeof(_oData['nC2CId']) !== 'undefined') {
            this.nC2CId = +_oData['nC2CId'];
        }
        if(typeof(_oData['nS2RId']) !== 'undefined') {
            this.nS2RId = +_oData['nS2RId'];
        }
        if(typeof(_oData['fPoints']) !== 'undefined') {
            this.fPoints = +_oData['fPoints'];
        }
        if(typeof(_oData['sNote']) !== 'undefined') {
            this.sNote = _oData['sNote'];
        }
        this.bDirty = false;
    }
    
    injectForeignKey(_sKey: string, _oItem: any) {
        switch(_sKey) {
                case 'nC2CId':
                    this.oCriteriaInCatalogue = <CriteriaInCatalogue>_oItem;
                    break;
                case 'nS2RId':
                    this.oRatingPerStudentInCourse = <RatingPerStudentInCourse>_oItem;
                    break;
                default:
                    super.injectForeignKey(_sKey, _oItem);
                    break;
        }
    }
    
    getTableName() {
        return 'grade';
    }
    
    toString() {
        return JSON.stringify({
            nC2CId: this.nC2CId,
            nS2RId: this.nS2RId,
            sNote: this.sNote,
            fPoints: this.fPoints
        });
    }
}