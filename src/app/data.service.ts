import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Model } from './model/_model';
import { Catalogue } from './model/catalogue';
import { Course } from './model/course';
import { Criteria } from './model/criteria';
import { CriteriaInCatalogue } from './model/criteria_in_catalogue';
import { Grade } from './model/grade';
import { Rating } from './model/rating';
import { RatingPerStudentInCourse } from './model/rating_per_student_in_course';
import { Student } from './model/student';
import { StudentInCourse } from './model/student_in_course';
import { System } from './model/system';
import { User } from './model/user';
import { Email } from './model/email';
import { Talk } from './model/talk';

import { i18n } from './module/i18n.module';

//in order to prevent compile errors
declare var CryptoJS: any;
declare var sessionStorage: any;
declare var localStorage: any;

@Injectable()

export class DataService {
    private sUrl = 'https://stuperman.org/api/';
    private nUseId = 0;
    private bLogin = false;
    private sUser = '';
    private sPasswordHash = '';
    
    private bCurrentlyTryingToLogin = false;
    private bLoginHasBeenChecked = false;
    
    private aCatalogue: Catalogue[] = [];
    private aCourse: Course[] = [];
    private aCriteria: Criteria[] = [];
    private aCriteriaInCatalogue: CriteriaInCatalogue[] = [];
    private aGrade: Grade[] = [];
    private aRating: Rating[] = [];
    private aRatingPerStudentInCourse: RatingPerStudentInCourse[] = [];
    private aStudent: Student[] = [];
    private aStudentInCourse: StudentInCourse[] = [];
    private aSystem: System[] = [];
    private aMail: Email[] = [];
    private aTalk: Talk[] = [];
    private aUser: User[] = [];
    
    bIsOnline: boolean = true;
    private nOfflineRetry: number = 0;
    private nOfflineRetryMax: number = 1;
    bCurrentlySynchronizing: boolean = false;
    private nSyncLogLength: number;
    private nSyncLogStatus: number;
    private oTimerOffline: any;
    
    constructor(private oHttp: Http) {
    }
    
	
	
    checkPriorLogin(_fCallback: (_bSuccess: boolean) => any) {
        if(typeof(sessionStorage) !== 'undefined') {
            if(typeof(sessionStorage.sUser) !== 'undefined' && typeof(sessionStorage.sHash) !== 'undefined') {
                if(sessionStorage.sUser != '' && sessionStorage.sHash != '') {
                    this.sUser = sessionStorage.sUser.trim();
                    this.sPasswordHash = sessionStorage.sHash.trim();
                    this.login( (_nStatus: number) => {
                        _fCallback(_nStatus == 1);
                    });
                } else {
                    _fCallback(false);
                }
            } else {
                _fCallback(false);
            }
        } else {
            _fCallback(false);
        }
    }
    
    isLoggedIn() {
        return this.bLogin;
    }
    
    login(_fCallback?: (_nStatus: number) => any, _sUser?: string, _sPassword?: string) {
        if(this.bCurrentlyTryingToLogin) {
            if(_fCallback) {
                _fCallback(-1);
            }
        } else {
            this.bCurrentlyTryingToLogin = true;
            if(_sUser) {
                this.sUser = _sUser.trim();
            }
            if(_sPassword) {
                this.sPasswordHash = CryptoJS.MD5(_sPassword).toString();
            }
            this.collectAllData( (_bSuccess: boolean) => {
                    this.bLoginHasBeenChecked = true;
                    this.bCurrentlyTryingToLogin = false;
                    if(_bSuccess) {
                        this.bLogin = true;
                        if(typeof(sessionStorage) !== 'undefined') {
                            sessionStorage.sUser = this.sUser;
                            sessionStorage.sHash = this.sPasswordHash;
                        }
                        if(_fCallback) {
                            _fCallback(1);
                        }
                    } else {
                        if(_fCallback) {
                            _fCallback(0);
                        }
                    }
                });
        }
    }
    
    logout() {
        this.bLogin = false;
        this.sUser = '';
        this.sPasswordHash = '';
        if(typeof(sessionStorage) !== 'undefined') {
            sessionStorage.clear();
        }
    }
    
	
	
	
	
    private collectAllData(_fCallback: (_bSuccess: boolean) => any) {
        this.getAPIdata('all', (_oData: Object) => {
            if(typeof(_oData['user']) === 'undefined') {
                _fCallback(false);
            } else {
                if(_oData['user'].length > 0 && typeof(_oData['cat2cri']) !== 'undefined') {
                    this.setupAllData(_oData);
                    this.getUsers().forEach( (_oUserTemp: User) => {
                            if(_oUserTemp.sUser == this.sUser && !_oUserTemp.bArchive) {
                                this.nUseId = _oUserTemp.nId;
                                //if user wants offline sync, transfer data to localStorage
                                if(_oUserTemp.bOfflineSync) {
                                    this.updateAllCache();
                                }
                            }
                        });
                    _fCallback(true);
                } else {
                    _fCallback(false);
                }
            }
        });
    }
	
	private setupAllData(_oData: Object) {
		//first, fill the lists
		if(typeof(_oData['cat2cri']) !== 'undefined') this.aCriteriaInCatalogue = this.setupData(CriteriaInCatalogue, _oData['cat2cri']);
		if(typeof(_oData['catalogue']) !== 'undefined') this.aCatalogue = this.setupData(Catalogue, _oData['catalogue']);
		if(typeof(_oData['course']) !== 'undefined') this.aCourse = this.setupData(Course, _oData['course']);
		if(typeof(_oData['criteria']) !== 'undefined') this.aCriteria = this.setupData(Criteria, _oData['criteria']);
		if(typeof(_oData['grade']) !== 'undefined') this.aGrade = this.setupData(Grade, _oData['grade']);
		if(typeof(_oData['rating']) !== 'undefined') this.aRating = this.setupData(Rating, _oData['rating']);
		if(typeof(_oData['stu2cou']) !== 'undefined') this.aStudentInCourse = this.setupData(StudentInCourse, _oData['stu2cou']);
		if(typeof(_oData['stu2rat']) !== 'undefined') this.aRatingPerStudentInCourse = this.setupData(RatingPerStudentInCourse, _oData['stu2rat']);
		if(typeof(_oData['student']) !== 'undefined') this.aStudent = this.setupData(Student, _oData['student']);
		if(typeof(_oData['system']) !== 'undefined') this.aSystem = this.setupData(System, _oData['system']);
		if(typeof(_oData['email']) !== 'undefined') this.aMail = this.setupData(Email, _oData['email']);
		if(typeof(_oData['talk']) !== 'undefined') this.aTalk = this.setupData(Talk, _oData['talk']);
		if(typeof(_oData['user']) !== 'undefined') this.aUser = this.setupData(User, _oData['user']);
		//second, combine them (foreign = parent, sub-lists = children; e.g., criteria-parent = catalogue, catalogue-children = criteria)
        this.setupAllRelations(_oData);
        //third, push them to the cache
        this.updateAllCache();
    }
    
    private setupAllRelations(_oData: Object) {
		if(typeof(_oData['cat2cri']) !== 'undefined') {
			this.injectForeignKeys(this.aCriteriaInCatalogue, _oData['cat2cri'], 'nC2CId');
			this.injectChildren(this.aCriteriaInCatalogue, _oData['cat2cri'], 'nC2CId');
		}
		if(typeof(_oData['catalogue']) !== 'undefined') {
			this.injectForeignKeys(this.aCatalogue, _oData['catalogue'], 'nCatId');
			this.injectChildren(this.aCatalogue, _oData['catalogue'], 'nCatId');
		}
		if(typeof(_oData['course']) !== 'undefined') {
			this.injectForeignKeys(this.aCourse, _oData['course'], 'nCouId');
			this.injectChildren(this.aCourse, _oData['course'], 'nCouId');
		}
		if(typeof(_oData['criteria']) !== 'undefined') {
			this.injectForeignKeys(this.aCriteria, _oData['criteria'], 'nCriId');
			this.injectChildren(this.aCriteria, _oData['criteria'], 'nCriId');
		}
		if(typeof(_oData['grade']) !== 'undefined') {
			this.injectForeignKeys(this.aGrade, _oData['grade'], 'nGraId');
			this.injectChildren(this.aGrade, _oData['grade'], 'nGraId');
		}
		if(typeof(_oData['rating']) !== 'undefined') {
			this.injectForeignKeys(this.aRating, _oData['rating'], 'nRatId');
			this.injectChildren(this.aRating, _oData['rating'], 'nRatId');
		}
		if(typeof(_oData['stu2cou']) !== 'undefined') {
			this.injectForeignKeys(this.aStudentInCourse, _oData['stu2cou'], 'nS2CId');
			this.injectChildren(this.aStudentInCourse, _oData['stu2cou'], 'nS2CId');
		}
		if(typeof(_oData['stu2rat']) !== 'undefined') {
			this.injectForeignKeys(this.aRatingPerStudentInCourse, _oData['stu2rat'], 'nS2RId');
			this.injectChildren(this.aRatingPerStudentInCourse, _oData['stu2rat'], 'nS2RId');
		}
		if(typeof(_oData['student']) !== 'undefined') {
			this.injectForeignKeys(this.aStudent, _oData['student'], 'nStuId');
			this.injectChildren(this.aStudent, _oData['student'], 'nStuId');
		}
		if(typeof(_oData['system']) !== 'undefined') {
			this.injectForeignKeys(this.aSystem, _oData['system'], 'nSysId');
			this.injectChildren(this.aSystem, _oData['system'], 'nSysId');
		}
		if(typeof(_oData['email']) !== 'undefined') {
			this.injectForeignKeys(this.aMail, _oData['email'], 'nEmaId');
			this.injectChildren(this.aMail, _oData['email'], 'nEmaId');
		}
		if(typeof(_oData['talk']) !== 'undefined') {
			this.injectForeignKeys(this.aTalk, _oData['talk'], 'nTalId');
			this.injectChildren(this.aTalk, _oData['talk'], 'nTalId');
		}
		if(typeof(_oData['user']) !== 'undefined') {
			this.injectForeignKeys(this.aUser, _oData['user'], 'nUseId');
			this.injectChildren(this.aUser, _oData['user'], 'nUseId');
		}
	}
	
	
	
    
	
	
	/**
	 * Sets up a list of models, based on data coming from the API.
	 * @param	_oClassConstructor	class to generate list from
	 * @param	_aData	array of API objects on one certain model
	 * @return	array of class objects
	 */
    private setupData<T>(_oClassConstructor: { new(...args: any[]): T; }, _aData: Object[]) {
        //http://stackoverflow.com/questions/32971814/declaring-function-where-the-parameter-is-a-class-returning-an-instance-of-that
        let aData: T[] = [];
        for(let oData of _aData) {
            aData.push(new _oClassConstructor(oData));
        }
        return aData;
    }
    
	/**
	 * Runs through list of API data objects looking for 'foreign' configurations therein.
	 * If found, according object of API data object from collection is used and gets foreign object injected (as specified via the foreign configuration).
	 * Example: injectForeignKeys(this.aCourse, _aCourseData) runs through courses and pushes User foreign object to it
	 *
	 * @param	_aCollection	object array representing the child table (whose objects get injected with parent objects)
	 * @param	_aData	according array of API objects to look for foreign configurations
	 * @return	void
	 */
    private injectForeignKeys(_aCollection: any[], _aData: Object[], _sPrimaryKey: string) {
        for(let oData of _aData) {
            for(let sKey in oData['foreign']) {
                if(this.getItems(_aCollection, oData[_sPrimaryKey]).length > 0) {
                    this.getItems(_aCollection, oData[_sPrimaryKey])[0].injectForeignKey(sKey, this.getItemsFromTable(oData['foreign'][sKey], oData[sKey])[0]);
                }
            }
        }
    }
    
	/**
	 * Runs through list of API data objects looking for 'children' configurations therein.
	 * If found	, according object of API data object from collection is used and gets child objects injected (as specified via the children configuration).
	 * Example: injectChildren(this.aCourse, _aCourseData) runs through courses and pushes StudentsInCourse[] lists to it
	 *
	 * @param _aCollection	object array representing the child table (whose objects get injected with parent objects)
	 * @param _aData	according array of API objects to look for foreign configurations
	 * @return	void
	 */
    private injectChildren(_aCollection: any[], _aData: Object[], _sPrimaryKey: string) {
        for(let oData of _aData) {
            for(let oConfig of oData['children']) {
                if(this.getItems(_aCollection, oData[_sPrimaryKey]).length > 0) {
				    this.getItems(_aCollection, oData[_sPrimaryKey])[0].injectChildren(
                        oConfig['sTable'], 
                        this.getItemsFromTable(oConfig['sTable'], +oData[_sPrimaryKey], oConfig['sColumn'])
                    );
                }
            }
        }
    }
	
	/**
	 * Looks at one specific object (submitted to this function) and updates other objects that include this one as children.
	 * Example: updateChildren(oCourse, _oCourseData) would update a user's sub list of courses by injecting it the a new sub list
	 *
	 * @param	_oItem	the object to start from
	 * @param	_oData	the corresponding API object
	 * @return	void
	 */
	private updateChild<T extends Model>(_oItem: T, _oData: Object) {
		for(let sKey in _oData['foreign']) {
			let oDataParent: Object = {};
			oDataParent[sKey] = _oData[sKey];
			oDataParent['children'] = [ { sTable: _oItem.getTableName(), sColumn: sKey } ];
			this.injectChildren(this.getItemsFromTable(_oData['foreign'][sKey], +_oData[sKey]), [ oDataParent ], sKey);
		}
	}
	
	/**
	 * Looks at one specific object (submitted to this function) and delete all objects that include this one as foreign key.
	 * Example: deleteParent(oCourse, _oCourseData) would delete all StudentInCourse objects which are referenced to this oCourse.
	 *
	 * @param	_oItem	the object to start from
	 * @param	_oData	the corresponding API object
	 * @return	void
	 */
	private deleteParent<T extends Model>(_oItem: T, _oData: Object) {
		for(let oConfig of _oData['children']) {
            if(oConfig['sTable'] != 'email') {
                for(let oChildItem of this.getItemsFromTable(oConfig['sTable'], _oItem.nId, oConfig['sColumn'])) {
                    this.deleteItem(oChildItem, ( _bSuccess: boolean) => {
                            if(!_bSuccess) {
                                this.handleError(new Response(new ResponseOptions({
                                        body: i18n.sentence('error.data.deletechild', oChildItem.getTableName(), oChildItem.nId),
                                        status: 500
                                    })));
                            }
                        });
                }
            }
		}
	}
	
	
	
	
    /**
	 * Returns all matching items, specified via nothing (returns all items), a numeric (indicating objects' nId), or a value and its corresponding key.
	 *
	 * @param	_aItem	list of objects to filter from (typically, this.aCourse or the like)
	 * @param	_nId	nId numeric or other value
	 * @param	_sIdProperty	name of _nId value to match with
	 * @return	filtered list of _aItem
	 */
    private getItems<T extends Model>(_aItem: T[], _nId?: number, _sIdProperty = 'nId'): T[] {
        if(_nId >= 0) {
            let aItem = new Array<T>();
            for(let oItem of _aItem) {
                if(+oItem[_sIdProperty] > 0 && +oItem[_sIdProperty] == _nId) {
                    aItem.push(oItem);
                }
            }
            return aItem;
        } else {
            return _aItem;
        }
    }
	
	/**
	 * Same as this.getItems(...) but without the specification of a given lists.
	 * Builds on this.a___ instead.
	 *
	 * @see	getItems
	 */
    private getItemsFromTable(_sTable: string, _nId?: number, _sIdProperty = 'nId'): any[] {
        try {
            if(isNaN(_nId)) {
                _nId = 0;
            }
            switch(_sTable) { 
                case 'cat2cri':
                    return this.getItems(this.aCriteriaInCatalogue, _nId, _sIdProperty);
                case 'catalogue':
                    return this.getItems(this.aCatalogue, _nId, _sIdProperty);
                case 'course':
                    return this.getItems(this.aCourse, _nId, _sIdProperty);
                case 'criteria':
                    return this.getItems(this.aCriteria, _nId, _sIdProperty);
                case 'grade':
                    return this.getItems(this.aGrade, _nId, _sIdProperty);
                case 'rating':
                    return this.getItems(this.aRating, _nId, _sIdProperty);
                case 'stu2cou':
                    return this.getItems(this.aStudentInCourse, _nId, _sIdProperty);
                case 'stu2rat':
                    return this.getItems(this.aRatingPerStudentInCourse, _nId, _sIdProperty);
                case 'student':
                    return this.getItems(this.aStudent, _nId, _sIdProperty);
                case 'system':
                    return this.getItems(this.aSystem, _nId, _sIdProperty);
                case 'email':
                    return this.getItems(this.aMail, _nId, _sIdProperty);
                case 'talk':
                    return this.getItems(this.aTalk, _nId, _sIdProperty);
                case 'user':
                    return this.getItems(this.aUser, _nId, _sIdProperty);
            }
        } catch(_oError) {
            this.handleError(new Response(new ResponseOptions({
                    body: i18n.sentence('error.data.foreign', _sTable, _nId),
					status: 404
				})));
        }
    }
    
    private handleError(_oError: Response) {
        console.log(_oError.text());
        return Observable.throw(_oError.text());
    }
	
	
	
	
	
	
    /**
	 * Add a new item. Therefore create a new instance of a model and submit it to this method.
	 * The method adds the model object to the database, all necessary lists, and the general system.
	 *
	 * @param	_oItem	new instance to be set
	 * @param	_fCallback	function to be called afterwards with a boolean value indicating success or not
	 * @return	void
	 */
    addItem<T extends Model>(_oItem: T, _fCallback: (_bSuccess: boolean) => any) {
        this.postAPIdata(_oItem.getTableName(), _oItem.toString(), (_oData: Object) => {
                if(typeof(_oData['foreign']) === 'undefined') {
                    _fCallback(false);
                } else {
					//update it (due to creation date and the like)
                    _oItem.update(_oData);
					//add it to the correct list and inject foreign keys to it (no children can be available at this point)
                    //double cast encessary here: http://stackoverflow.com/questions/18735178/casting-typescript-generics
					switch(_oItem.getTableName()) { 
						case 'cat2cri':
							this.aCriteriaInCatalogue.push(<CriteriaInCatalogue><any>_oItem);
							this.injectForeignKeys(this.aCriteriaInCatalogue, [ _oData ], 'nC2CId');
							break;
						case 'catalogue':
							this.aCatalogue.push(<Catalogue><any>_oItem);
							this.injectForeignKeys(this.aCatalogue, [ _oData ], 'nCatId');
							break;
						case 'course':
							this.aCourse.push(<Course><any>_oItem);
							this.injectForeignKeys(this.aCourse, [ _oData ], 'nCouId');
							break;
						case 'criteria':
							this.aCriteria.push(<Criteria><any>_oItem);
							this.injectForeignKeys(this.aCriteria, [ _oData ], 'nCriId');
							break;
						case 'grade':
							this.aGrade.push(<Grade><any>_oItem);
							this.injectForeignKeys(this.aGrade, [ _oData ], 'nGraId');
							break;
						case 'rating':
							this.aRating.push(<Rating><any>_oItem);
							this.injectForeignKeys(this.aRating, [ _oData ], 'nRatId');
							break;
						case 'stu2cou':
							this.aStudentInCourse.push(<StudentInCourse><any>_oItem);
							this.injectForeignKeys(this.aStudentInCourse, [ _oData ], 'nS2CId');
							break;
						case 'stu2rat':
							this.aRatingPerStudentInCourse.push(<RatingPerStudentInCourse><any>_oItem);
							this.injectForeignKeys(this.aRatingPerStudentInCourse, [ _oData ], 'nS2RId');
							break;
						case 'student':
							this.aStudent.push(<Student><any>_oItem);
							this.injectForeignKeys(this.aStudent, [ _oData ], 'nStuId');
							break;
						case 'system':
							this.aSystem.push(<System><any>_oItem);
							this.injectForeignKeys(this.aSystem, [ _oData ], 'nSysId');
							break;
						case 'email':
							this.aMail.push(<Email><any>_oItem);
							this.injectForeignKeys(this.aMail, [ _oData ], 'nEmaId');
							break;
						case 'talk':
							this.aTalk.push(<Talk><any>_oItem);
							this.injectForeignKeys(this.aTalk, [ _oData ], 'nTalId');
							break;
						case 'user':
							this.aUser.push(<User><any>_oItem);
							this.injectForeignKeys(this.aUser, [ _oData ], 'nUseId');
							break;
					}
					//update items that rely on this list
					this.updateChild(_oItem, _oData);
                    //update cache
                    this.updateCache(_oItem.getTableName());
					//go on
                    _fCallback(true);
                }
            });
    }
    
	/**
	 * Deletes an item from the database, deletes all its children, and updates children lists that rely on it.
	 *
	 * @param	_oItem	the item to delete
	 * @param	_fCallback callback function to call when this item is deleted (not necessarily all its children) with a boolean indicating success
	 * @return	void
	 */
    deleteItem<T extends Model>(_oItem: T, _fCallback: (_bSuccess: boolean) => any) {
        this.deleteAPIdata(_oItem.getTableName() + '/' + _oItem.nId, (_oData: Object) => {
                if(typeof(_oData['bArchive']) === 'undefined') {
                    _fCallback(false);
                } else {
					//update it (for the sake of completeness)
                    _oItem.update(_oData);
					//delete it from the corresponding list
					switch(_oItem.getTableName()) {
						case 'cat2cri':
							this.aCriteriaInCatalogue = this.aCriteriaInCatalogue.filter( (_oListItem: CriteriaInCatalogue) => _oListItem.nId != _oItem.nId);
							break;
						case 'catalogue':
							this.aCatalogue = this.aCatalogue.filter( (_oListItem: Catalogue) => _oListItem.nId != _oItem.nId);
							break;
						case 'course':
							this.aCourse = this.aCourse.filter( (_oListItem: Course) => _oListItem.nId != _oItem.nId);
							break;
						case 'criteria':
							this.aCriteria = this.aCriteria.filter( (_oListItem: Criteria) => _oListItem.nId != _oItem.nId);
							break;
						case 'grade':
							this.aGrade = this.aGrade.filter( (_oListItem: Grade) => _oListItem.nId != _oItem.nId);
							break;
						case 'rating':
							this.aRating = this.aRating.filter( (_oListItem: Rating) => _oListItem.nId != _oItem.nId);
							break;
						case 'stu2cou':
							this.aStudentInCourse = this.aStudentInCourse.filter( (_oListItem: StudentInCourse) => _oListItem.nId != _oItem.nId);
							break;
						case 'stu2rat':
							this.aRatingPerStudentInCourse = this.aRatingPerStudentInCourse.filter( (_oListItem: RatingPerStudentInCourse) => _oListItem.nId != _oItem.nId);
							break;
						case 'student':
							this.aStudent = this.aStudent.filter( (_oListItem: Student) => _oListItem.nId != _oItem.nId);
							break;
						case 'system':
							this.aSystem = this.aSystem.filter( (_oListItem: System) => _oListItem.nId != _oItem.nId);
							break;
						case 'email':
							this.aMail = this.aMail.filter( (_oListItem: Email) => _oListItem.nId != _oItem.nId);
							break;
						case 'talk':
							this.aTalk = this.aTalk.filter( (_oListItem: Talk) => _oListItem.nId != _oItem.nId);
							break;
						case 'user':
							this.aUser = this.aUser.filter( (_oListItem: User) => _oListItem.nId != _oItem.nId);
							break;
					}
					//update items that rely on this list
					this.updateChild(_oItem, _oData);
					//delete all items that are children to this one
					this.deleteParent(_oItem, _oData);
                    //update cache
                    this.updateCache(_oItem.getTableName());
					//next
                    _fCallback(true)
                }
            });
    }
    
	/**
	 * Update a specific item.
	 *
	 * @param	_oItem	the item to update
	 * @param	_sUpdateBody	JSON string representation indicating changes to the object
	 * @param	_fCallback	callback function with a boolean indicating success
	 * @return	void
	 */
    updateItem<T extends Model>(_oItem: T, _sUpdateBody: string, _fCallback: (_bSuccess: boolean) => any) {
        this.putAPIdata(_oItem.getTableName() + '/' + _oItem.nId, _sUpdateBody, (_oData: Object) => {
                if(typeof(_oData['foreign']) === 'undefined') {
                    _fCallback(false);
                } else {
                    _oItem.update(_oData);
                    this.injectForeignKeys([ _oItem ], [ _oData ], this.getPrimaryFromTableName(_oItem.getTableName()));
                    this.updateCache(_oItem.getTableName());
                    _fCallback(true);
                }
            });
    }
    
	/**
	 * Change a user's password. Either the own (with "sPassword" set) or, as an admin, another user's (with "nUseId" set).
	 *
	 * @param	_sUpdateBody	JSON string representation indicating changes to the object (incl. either "sPassword" or "nUseId")
	 * @param	_fCallback	callback function with a boolean indicating success
	 * @return	void
	 */
    changePassword(_sUpdateBody: string, _fCallback: (_bSuccess: boolean) => any) {
        this.putAPIdata('password', _sUpdateBody, (_oData: Object) => {
                if(typeof(_oData['foreign']) === 'undefined') {
                    _fCallback(false);
                } else {
                    _fCallback(true);
                }
            });
    }
    
    /**
     * Sends an email through the API to either users (admins only) or students (only own ones).
     * sendMail(oUser, 'your grade', 'hi there, you passed!', (_bMail: boolean) => console.log(_bMail))
     *
     * @param   _oRecipient either a student or a user object to which the email will be sent
     * @param   _sSubject   the email's subject
     * @param   _sMessage   the email's message (API sends plain-text mails only)
     * @param   _fCallback  function to call after the mail was sent, boolean success indicator as parameter
     * @return  void
     */
    sendMail<T extends Model>(_oRecipient: T, _sSubject: string, _sMessage: string, _fCallback: (_bSuccess: boolean) => any) {
        this.postAPIdata('email', JSON.stringify({
                to: _oRecipient.getTableName() + ':' + _oRecipient.nId.toString(),
                subject: _sSubject,
                body: _sMessage
            }), (_oData: Object) => {

                if(typeof(_oData['foreign']) === 'undefined') {
                    _fCallback(false);
                } else {
                    this.aMail.push(new Email(_oData));
                    this.injectForeignKeys(this.aMail, [ _oData ], 'nEmaId');
                    this.updateCache('email');
                    _fCallback(true);
                }
            });
    }
    
    /**
     * Sends a contact email through the API to the webmaster.
     * sendMail('John Doe<john@doe.org>', 'the system', 'hi there, what is this about?', (_bMail: boolean) => console.log(_bMail))
     *
     * @param   _sSender    sender
     * @param   _sSubject   the email's subject
     * @param   _sMessage   the email's message (API sends plain-text mails only)
     * @param   _fCallback  function to call after the mail was sent, boolean success indicator as parameter
     * @return  void
     */
    sendContactMail(_sSender: string, _sSubject: string, _sMessage: string, _fCallback: (_bSuccess: boolean) => any) {
        this.postAPIdata('contact', JSON.stringify({
                from: _sSender,
                subject: _sSubject,
                body: _sMessage
            }), (_oData: Object) => {

                _fCallback(_oData['bMail'] || false);
            });
    }
    
	
	
    getTableNameFromForeign(_sForeignKey: string) {
        switch(_sForeignKey) {
            case 'nC2CId':
                return 'cat2cri';
            case 'nCatId':
                return 'catalogue';
            case 'nCouId':
                return 'course';
            case 'nCriId':
                return 'criteria';
            case 'nGraId':
                return 'grade';
            case 'nRatId':
                return 'rating';
            case 'nS2CId':
                return 'stu2cat';
            case 'nS2RId':
                return 'stu2rat';
            case 'nStuId':
                return 'student';
            case 'nSysId':
                return 'system';
            case 'nUseId':
                return 'user';
            case 'nEmaId':
                return 'email';
            case 'nTalId':
                return 'talk';
        }
    }
    
    getPrimaryFromTableName(_sTable: string) {
        switch(_sTable) {
            case 'cat2cri':
                return 'nC2CId';
            case 'catalogue':
                return 'nCatId';
            case 'course':
                return 'nCouId';
            case 'criteria':
                return 'nCriId';
            case 'grade':
                return 'nGraId';
            case 'rating':
                return 'nRatId';
            case 'stu2cat':
                return 'nS2CId';
            case 'stu2rat':
                return 'nS2RId';
            case 'student':
                return 'nStuId';
            case 'system':
                return 'nSysId';
            case 'user':
                return 'nUseId';
            case 'email':
                return 'nEmaId';
            case 'talk':
                return 'nTalId';
        }
    }
    
	
	/**
     * Retrieve a list of possible foreign keys.
     * Example: getPossibleForeigns('nCouId') returns an array of objects with nId and sName and sCategory set.
     *
     * @param   _sForeignKey    the name of the foreign key
     * @return  array of objects with nId and sName and sCategory (retrieved from _model->getName()) set
     */
    getPossibleForeigns(_sForeignKey: string): { nId: number, sName: string, sCategory: string }[] {
        let aReturn: { nId: number, sName: string, sCategory: string }[] = [];
        switch(_sForeignKey) {
            case 'nC2CId':
                this.getCriteriaInCatalogues().forEach( (_oItem: CriteriaInCatalogue) => {
                        aReturn.push({ nId: _oItem.nId, sName: _oItem.oCriteria.getName(), sCategory: _oItem.oCatalogue.getName() });
                    });
                break;
            case 'nCatId':
                this.getCatalogues().forEach( (_oItem: Catalogue) => {
                        aReturn.push({ nId: _oItem.nId, sName: _oItem.getName(), sCategory: null });
                    });
                break;
            case 'nCouId':
                this.getCourses().forEach( (_oItem: Course) => {
                        aReturn.push({ nId: _oItem.nId, sName: _oItem.getName(), sCategory: _oItem.sCategory });
                    });
                break;
            case 'nCriId':
                this.getCriteria().forEach( (_oItem: Criteria) => {
                        aReturn.push({ nId: _oItem.nId, sName: _oItem.getName(), sCategory: null });
                    });
                break;
            case 'nGraId':
                this.getGradings().forEach( (_oItem: Grade) => {
                        aReturn.push({ nId: _oItem.nId, sName: _oItem.getName(), sCategory: null });
                    });
                break;
            case 'nRatId':
                this.getRatings().forEach( (_oItem: Rating) => {
                        aReturn.push({ nId: _oItem.nId, sName: _oItem.getName(), sCategory: _oItem.oCourse.getName() });
                    });
                break;
            case 'nS2CId':
                this.getStudentsInCourses().forEach( (_oItem: StudentInCourse) => {
                        aReturn.push({ nId: _oItem.nId, sName: _oItem.oStudent.getName(), sCategory: _oItem.oCourse.getName() });
                    });
                break;
            case 'nS2RId':
                this.getRatingsForStudentsInCourses().forEach( (_oItem: RatingPerStudentInCourse) => {
                        aReturn.push({ nId: _oItem.nId, sName: _oItem.getName(), sCategory: null });
                    });
                break;
            case 'nStuId':
                this.getStudents().forEach( (_oItem: Student) => {
                        aReturn.push({ nId: _oItem.nId, sName: _oItem.getName(), sCategory: null });
                    });
                break;
            case 'nSysId':
                this.getSystems().forEach( (_oItem: System) => {
                        aReturn.push({ nId: _oItem.nId, sName: _oItem.sName, sCategory: _oItem.sGroup });
                    });
                break;
            case 'nUseId':
                this.getUsers().forEach( (_oItem: User) => {
                        aReturn.push({ nId: _oItem.nId, sName: _oItem.getName(), sCategory: null });
                    });
                break;
            case 'nEmaId':
                this.getEmails().forEach( (_oItem: Email) => {
                        aReturn.push({ nId: _oItem.nId, sName: _oItem.getName(), sCategory: null });
                    });
                break;
            case 'nTalId':
                this.getTalks().forEach( (_oItem: Talk) => {
                        aReturn.push({ nId: _oItem.nId, sName: _oItem.getName(), sCategory: _oItem.oStudent.getName() });
                    });
                break;
        }
        return aReturn;
    }
    
    getCatalogues(_nId?: number) {
        return this.getItems(this.aCatalogue, _nId);
    }
    
    getCourses(_nId?: number) {
        return this.getItems(this.aCourse, _nId);
    }
    
    getRatings(_nId?: number) {
        return this.getItems(this.aRating, _nId);
    }
    
    getCriteria(_nId?: number) {
        return this.getItems(this.aCriteria, _nId);
    }
    
    getStudentsInCourses(_nId?: number) {
        return this.getItems(this.aStudentInCourse, _nId);
    }
    
    getRatingsForStudentsInCourses(_nId?: number) {
        return this.getItems(this.aRatingPerStudentInCourse, _nId);
    }
    
    getCriteriaInCatalogues(_nId?: number) {
        return this.getItems(this.aCriteriaInCatalogue, _nId);
    }
    
    getSystems(_nId?: number) {
        return this.getItems(this.aSystem, _nId);
    }
    
    getStudents(_nId?: number) {
        return this.getItems(this.aStudent, _nId);
    }
    
    getGradings(_nId?: number) {
        return this.getItems(this.aGrade, _nId);
    }
    
    getEmails(_nId?: number) {
        return this.getItems(this.aMail, _nId);
    }
    
    getTalks(_nId?: number) {
        return this.getItems(this.aTalk, _nId);
    }
    
    getUsers(_nId?: number) {
        return this.getItems(this.aUser, _nId);
    }
    
    getCurrentUser() {
        let aUserTemp = this.getUsers();
        if(aUserTemp.length > 0) {
            return aUserTemp.filter((_oUser: User) => _oUser.nId == this.nUseId)[0];
        } else {
            return null;
        }
    }
    
	
	
	
	
	
	
	/************************************
	 * Online/Offline part starts here.	*
	 ************************************/
	
	/**
	 * Setup a HTTP header according to the API specifications.
	 * No data is sent here.
	 *
	 * @param	_sUrl	 URL to call
	 * @param	_sBody	 final body to submit; if empty, no content-type is set
	 * @return	header   object to be included in this.oHttp calls
	 */
    private APIheader(_sUrl: string, _sBody: string = '') {
        let sNonce = CryptoJS.lib.WordArray.random(16).toString();
        let oHeader = new Headers({
                'X-Grader-Authorization': 'GraderDigest ' + [
                    'user="' + this.sUser + '"',
                    'nonce="' + sNonce + '"',
                    'method="sha1"',
                    'signature="' + CryptoJS.HmacSHA1(_sUrl + this.sUser + sNonce + _sBody, this.sPasswordHash).toString() + '"'
                ].join(',')
            });
        if(_sBody != '') {
            oHeader.append('Content-Type', 'application/json');
        }
        return { headers: oHeader };
    }
    
	/**
	 * PUT data to API. Used for updating an entry.
	 *
	 * @param	_sUrlSuffix	everything to append to the URL, usually table/id
	 * @param	_sData	JSON-representing string to submit
	 * @param	_fCallback	function to call when finished including the JSON object of the entry
	 */
    private putAPIdata(_sUrlSuffix: string, _sData: string, _fCallback: (_oData: Object) => any) {
        if(this.bIsOnline) {
            let sUrl = this.sUrl + _sUrlSuffix;
            this.oHttp.put(sUrl, _sData, this.APIheader(sUrl, _sData))
                .map( (_oResponse: any) => _oResponse.json() )
                .subscribe(
                    (_aData: Object[]) => {
                        this.onlineSignal();
                        //_oData = { 'nUseId' => ..., 'foreign' => [...], ... }
                        if(_aData.length == 1) {
                            _fCallback(_aData[0]);
                        } else {
                            _fCallback({});
                        }
                    },
                    err => {
                        if(this.nOfflineRetry <= this.nOfflineRetryMax) {
                            if(this.nOfflineRetry == this.nOfflineRetryMax) {
                                this.setOffline();
                            }
                            this.nOfflineRetry++;
                            this.putAPIdata(_sUrlSuffix, _sData, _fCallback);
                        } else {
                            _fCallback({});
                        }
                    }
                );
        } else {
            let oConf = {};
            if(_sUrlSuffix == 'password') {
                this.handleError(new Response(new ResponseOptions({
                        body: i18n.sentence('error.data.offlinepw'),
                        status: 404
                    })));
            } else {
                this.logOfflineAction('putAPIdata', [ _sUrlSuffix, _sData ]);
                //find item
                let aConf = _sUrlSuffix.split('/');
                oConf = this.getItemsFromTable(aConf[0], +aConf[1])[0].getInitialData();
                //update infos
                oConf['dUpdate'] = new Date();
                aConf = JSON.parse(_sData);
                for(let sKey in aConf) {
                    oConf[sKey] = aConf[sKey];
                }
            }
            _fCallback(oConf);
        }
    }
    
	/**
	 * POST data to API. Used for creating a new entry.
	 *
	 * @param	_sUrlSuffix	everything to append to the URL, usually table
	 * @param	_sData	JSON-representing string to submit
	 * @param	_fCallback	function to call when finished including the JSON object of the entry
	 */
    private postAPIdata(_sUrlSuffix: string, _sData: string, _fCallback: (_oData: Object) => any) {
        if(this.bIsOnline) {
            let sUrl = this.sUrl + _sUrlSuffix;
            this.oHttp.post(sUrl, _sData, this.APIheader(sUrl, _sData))
                .map( (_oResponse: any) => _oResponse.json() )
                .subscribe(
                    (_aData: Object[]) => {
                        this.onlineSignal();
                        //_oData = { 'nUseId' => ..., 'foreign' => [...], ... }
                        if(_aData.length == 1) {
                            _fCallback(_aData[0]);
                        } else {
                            _fCallback({});
                        }
                    },
                    err => {
                        if(this.nOfflineRetry <= this.nOfflineRetryMax) {
                            if(this.nOfflineRetry == this.nOfflineRetryMax) {
                                this.setOffline();
                            }
                            this.nOfflineRetry++;
                            this.postAPIdata(_sUrlSuffix, _sData, _fCallback);
                        } else {
                            _fCallback({});
                        }
                    }
                );
        } else {
            let oConf = {};
            if(_sUrlSuffix == 'contact' || _sUrlSuffix == 'email') {
                this.handleError(new Response(new ResponseOptions({
                        body: i18n.sentence('error.data.offlinemail'),
                        status: 404
                    })));
            } else {
                this.logOfflineAction('postAPIdata', [ _sUrlSuffix, _sData ]);
                oConf = JSON.parse(_sData);
                oConf['dCreate'] = new Date();
                oConf['nUseId'] = this.nUseId;
                oConf[this.getPrimaryFromTableName(_sUrlSuffix)] = Math.round(-1000000*Math.random());
            }
            _fCallback(oConf);
        }
    }
    
	/**
	 * DELETE data to API. Used for archiving an entry.
	 *
	 * @param	_sUrlSuffix	everything to append to the URL, usually table/id
	 * @param	_fCallback	function to call when finished including the JSON object of the entry
	 */
    private deleteAPIdata(_sUrlSuffix: string, _fCallback: (_oData: Object) => any) {
        if(this.bIsOnline) {
            let sUrl = this.sUrl + _sUrlSuffix;
            this.oHttp.delete(sUrl, this.APIheader(sUrl))
                .map( (_oResponse: any) => _oResponse.json() )
                .subscribe(
                    (_aData: Object[]) => {
                        this.onlineSignal();
                        //_oData = { 'nUseId' => ..., 'foreign' => [...], ... }
                        if(_aData.length == 1) {
                            _fCallback(_aData[0]);
                        } else {
                            _fCallback({});
                        }
                    },
                    err => {
                        if(this.nOfflineRetry <= this.nOfflineRetryMax) {
                            if(this.nOfflineRetry == this.nOfflineRetryMax) {
                                this.setOffline();
                            }
                            this.nOfflineRetry++;
                            this.deleteAPIdata(_sUrlSuffix, _fCallback);
                        } else {
                            _fCallback({});
                        }
                    }
                );
        } else {
            this.logOfflineAction('deleteAPIdata', [ _sUrlSuffix ]);
            //find item
            let aConf = _sUrlSuffix.split('/');
            let oConf = this.getItemsFromTable(aConf[0], +aConf[1])[0].getInitialData();
            //mark it deleted
            oConf.bArchive = true;
            oConf.dUpdate = new Date();
            //return
            _fCallback(oConf);
        }
    }
    
	/**
	 * GET data from API. Used for fetching entries.
	 *
	 * @param	_sUrlSuffix	everything to append to the URL, usually table or table/id or table/id/archived
	 * @param	_fCallback	function to call when finished including a JSON object with table names as keys and array of entries as their values
	 */
    private getAPIdata(_sType: string, _fCallback: (_oData: Object) => any) {
        if(this.bIsOnline) {
            let sUrl = this.sUrl + _sType;
            this.oHttp.get(sUrl, this.APIheader(sUrl))
                .map( (_oResponse: any) => _oResponse.json() )
                .subscribe(
                    (_oData: Object) => {
                        this.onlineSignal();
                        //_oData = { 'user' => [...], 'cat2cri' => [...], ... }
                        if(typeof(_oData['foreign']) === 'undefined') {
                            _fCallback(_oData);
                        } else {
                            _fCallback({});
                        }
                    },
                    err => {
                        if(this.nOfflineRetry <= this.nOfflineRetryMax) {
                            if(this.nOfflineRetry == this.nOfflineRetryMax) {
                                this.setOffline();
                            }
                            this.nOfflineRetry++;
                            this.getAPIdata(_sType, _fCallback);
                        } else {
                            _fCallback({});
                        }
                    }
                );
        } else if(!this.isInCache(_sType)) {
            this.handleError(new Response(new ResponseOptions({
                    body: i18n.sentence('error.data.offlinedata'),
                    status: 404
                })));
            _fCallback({});
        } else {
            if(_sType == 'all') {
                let oDataFromCache = {};
                for(let sKey in localStorage) {
                    if(sKey.substring(0, 1) != '_' && sKey != 'sUser' && sKey != 'sHash') {
                        oDataFromCache[sKey] = this.loadFromCache(sKey);
                    }
                }
                _fCallback(oDataFromCache);
            } else {
                _fCallback(this.loadFromCache(_sType));
            }
        }
    }
    
    
    
    
    
    
	/************************************
	 * Caching methods and mechanisms.	*
	 ************************************/

    updateAllCache() {
        this.updateCache('cat2cri');
        this.updateCache('catalogue');
        this.updateCache('course');
        this.updateCache('criteria');
        this.updateCache('grade');
        this.updateCache('rating');
        this.updateCache('stu2cou');
        this.updateCache('stu2rat');
        this.updateCache('student');
        this.updateCache('system');
        this.updateCache('email');
        this.updateCache('talk');
        this.updateCache('user');
        if(typeof(localStorage) !== 'undefined') {
            localStorage['_sUser'] = CryptoJS.AES.encrypt(this.sUser, this.sPasswordHash);
        }
    }
    
    private updateCache(_sType: string) {
        if(typeof(localStorage) !== 'undefined') {
            localStorage[_sType] = CryptoJS.AES.encrypt(JSON.stringify(this.getItemsFromTable(_sType, -1).map( (_oItem) => _oItem.getInitialData())), this.sPasswordHash);
        }
    }
    
    private isInCache(_sType: string): boolean {
        if(typeof(localStorage) !== 'undefined') {
            if(_sType == 'all') {
                return this.isInCache('cat2cri') &&
                       this.isInCache('catalogue') &&
                       this.isInCache('course') &&
                       this.isInCache('criteria') &&
                       this.isInCache('grade') &&
                       this.isInCache('rating') &&
                       this.isInCache('stu2cou') &&
                       this.isInCache('stu2rat') &&
                       this.isInCache('student') &&
                       this.isInCache('system') &&
                       this.isInCache('email') &&
                       this.isInCache('talk') &&
                       this.isInCache('user');
            } else if(typeof(localStorage[_sType]) !== 'undefined' && localStorage[_sType] != '') {
                return true;
            }
        }
        return false;
    }
    
    private loadFromCache(_sType: string) {
        if(this.isInCache(_sType)) {
            if(typeof(localStorage['_sUser']) !== 'undefined') {
                if(CryptoJS.AES.decrypt(localStorage['_sUser'], this.sPasswordHash).toString(CryptoJS.enc.Utf8) == this.sUser) {
                    return JSON.parse(CryptoJS.AES.decrypt(localStorage[_sType], this.sPasswordHash).toString(CryptoJS.enc.Utf8));
                }
            }
        }
        return [];
    }
    
    private onlineSignal() {
        if(!this.bIsOnline) {
            this.bIsOnline = true;
            this.oTimerOffline = null;
            this.collectAllData( (_bSuccess: boolean) => {
                    if(_bSuccess) {
                        this.sync();
                    }
                });
        }
    }
    
    private setOffline() {
        this.bIsOnline = false;
        this.oTimerOffline = Observable.timer(60000, 120000);
        this.oTimerOffline.subscribe( (_nNr: number) => {
                if(!this.bIsOnline) {
                    let sUrl = this.sUrl + 'user';
                    this.oHttp.get(sUrl, this.APIheader(sUrl))
                        .map( (_oResponse: any) => _oResponse.json() )
                        .subscribe(
                            (_oData: Object) => {
                                this.onlineSignal();
                            }
                        );
                }
            });
    }
    
    private logOfflineAction(_sAction: string, _aParam: any[]) {
        let aOfflineLog: { sAction: string, aParam: any[] }[] = [];
        if(typeof(localStorage._offline) !== 'undefined') {
            aOfflineLog = JSON.parse(localStorage._offline);
        }
        aOfflineLog.push({ sAction: _sAction, aParam: _aParam });
        localStorage._offline = JSON.stringify(aOfflineLog);
    }
    
    private sync() {
        if(this.bIsOnline && typeof(localStorage._offline) !== 'undefined') {
            let aOfflineLog: { sAction: string, aParam: any[] }[] = JSON.parse(localStorage._offline);
            this.nSyncLogLength = aOfflineLog.length;
            if(this.nSyncLogLength > 0) {
                this.bCurrentlySynchronizing = true;
                this.nSyncLogStatus = 0;
                for(let i = 0; i < this.nSyncLogLength; i++) {
                    aOfflineLog[i].aParam.push( (_oData: Object) => this.syncCheckDone());
                    this[aOfflineLog[i].sAction].apply(this, aOfflineLog[i].aParam);
                }
            }
        }
    }
    
    //weird syntax due to "this" context
    private syncCheckDone = () => {
        this.nSyncLogStatus++;
        if(this.nSyncLogStatus == this.nSyncLogLength) {
            localStorage.clear('_offline');
            this.bCurrentlySynchronizing = false;
        }
    }
    
    clearCache() {
        if(typeof(localStorage) !== 'undefined') {
            localStorage.clear();
        }
    }
}