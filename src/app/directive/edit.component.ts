import { Component, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

import { Model } from '../model/_model';

@Component({
    selector: 'grader-edit',
    templateUrl: '../../tmpl/edit.component.html',
    inputs: [
		'sName',
        'oItem',
		'bRequired',
        'aLink',
        'bPre',
        'aOption'
    ],
    outputs: [
        'onUpdate'
    ]
})

export class EditComponent<T extends Model> extends _Component {
    sName: string;
    oItem: T;
	bRequired = false;
    onUpdate = new EventEmitter(true);
    
	sValueEdit: string;
    aValueEditDropdown: { nId: number, sName: string, sCategory: string }[];
    sType = 'text-short';
	bEdit = false;
    aLink: any[];
    aOption: string[] = [];
    bPre: boolean = false;

    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
        if(this.sName == 'sNote') {
            this.sType = 'text-long';
        } else if(this.sName.substr(0, 1) == 'e' && this.aOption.length > 0) {
            this.sType = 'enum';
        } else {
            switch(this.sName.substr(0, 1)) {
                case 'b':
                    this.sType = 'boolean';
                    break;
                case 'n':
                    this.sType = this.sName.match(/n[A-Z](2[A-Z]|[a-z]{2})Id/) === null ? 'number' : 'foreign';
                    break;
                case 'd':
                    this.sType = 'date';
                    break;
                case 's':
                default:
                    this.sType = 'text-short';
                    break;
            }
        }
        this.sValueEdit = this.getValue();
    }
    
    getDropdownCategories() {
        let aCategory: string[] = [];
        this.aValueEditDropdown.forEach( (_oDropdown: { nId: number, sName: string, sCategory: string }) => {
                if(aCategory.indexOf(_oDropdown.sCategory) < 0) {
                    aCategory.push(_oDropdown.sCategory);
                }
            });
        aCategory.sort();
        return aCategory;
    }
    
    getFilteredDropdown(_sFilterCategory: string) {
        return this.aValueEditDropdown.filter( (_oDropdown: { nId: number, sName: string, sCategory: string }) => _oDropdown.sCategory == _sFilterCategory);
    }
    
    getValue() {
        let sValue = '';
        if(this.sType == 'boolean') {
            sValue = this.w(this.oItem[this.sName] ? 'true' : 'false');
        } else if(this.sName.match(/n[A-Z](2[A-Z]|[a-z]{2})Id/) === null) {
            sValue = this.sType.indexOf('text-') == 0 ? this.oItem[this.sName].trim() : this.oItem[this.sName].toString();
        } else {
            this.oDataService.getPossibleForeigns(this.sName).forEach( (_oForeign: { nId: number, sName: string, sCategory: string }) => {
                    if(_oForeign.nId == this.oItem[this.sName]) {
                        sValue = _oForeign.sName;
                    }
                });
        }
        return sValue;
    }
    
    onDropdownUpdate(_nId: number) {
        if(this.validateDropdown(_nId)) {
            this.sValueEdit = _nId.toString();
        }
    }
    
    onClickEdit() {
        this.bEdit = true;
        if(this.sType == 'boolean') {
            this.aValueEditDropdown = [
                { nId: 0, sName: this.w('false'), sCategory: null },
                { nId: 1, sName: this.w('true'), sCategory: null }
            ];
            this.sValueEdit = this.oItem[this.sName] ? '1' : '0';
        } else if(this.sName.match(/n[A-Z](2[A-Z]|[a-z]{2})Id/) !== null) {
            this.aValueEditDropdown = this.oDataService.getPossibleForeigns(this.sName);
            this.sValueEdit = this.oItem[this.sName].toString();
        } else if(this.sType == 'enum') {
            this.aValueEditDropdown = [];
            this.aOption.forEach( (_sOption: string) => {
                    if(this.oItem[this.sName].toString() == _sOption) {
                        this.sValueEdit = this.aValueEditDropdown.length.toString();
                    }
                    this.aValueEditDropdown.push({ nId: this.aValueEditDropdown.length, sName: _sOption, sCategory: null });
                });
        }
	}
    
    onClickAbort() {
        this.sValueEdit = this.sValueEdit.toString().trim();
        if(this.oItem[this.sName] == this.sValueEdit) {
            this.sValueEdit = this.getValue();
            this.bEdit = false;
        } else if(this.oItem[this.sName] != this.sValueEdit) {
            this.oPopupService.confirm(this.w('edit.really'), true, (_bConfirm: boolean) => {
                    if(_bConfirm) {
                        this.sValueEdit = this.getValue();
                        this.bEdit = false;
                    }
                });
        }
        return false;
	}
    
    validateNumber(_nValue: number) {
        if(isNaN(_nValue) || _nValue === null) {
            this.oPopupService.alert(this.w('error.number'));
            return false;
        }
        return true;
    }
    
    validateDropdown(_nValue: number) {
        let bValid = false;
        if(this.validateNumber(_nValue)) {
            this.aValueEditDropdown.forEach( (_oForeign: { nId: number, sName: string, sCategory: string }) => {
                    if(_oForeign.nId == _nValue) {
                        bValid = true;
                    }
                });
        }
        return bValid;
    }
    
    validateString(_sValue: string) {
        if(this.bRequired && _sValue == '') {
            this.oPopupService.alert(this.w('error.string'));
            return false;
        }
        return true;
    }
	
    onSubmitEdit() {
		this.sValueEdit = this.sValueEdit.toString().trim();
        if(this.oItem[this.sName] != this.sValueEdit && this.sName.match(/n[A-Z](2[A-Z]|[a-z]{2})Id/) !== null) {
			switch(this.sName.substr(0, 1)) {
				case 'n':
                    if(!this.validateNumber(+this.sValueEdit)) {
                        return false;
                    }
					break;
				case 's':
                    if(!this.validateString(this.sValueEdit)) {
                        return false;
                    }
					break;
			}
        } else if(this.sType == 'enum') {
            this.sValueEdit = this.aOption[+this.sValueEdit];
        }
		this.bEdit = false;
		this.updateValue();
	}
	
	private updateValue() {
        let oData = {};
        oData[this.sName] = this.sValueEdit;
        this.oDataService.updateItem(this.oItem, JSON.stringify(oData), ( _bSuccess: boolean) => {
                if(_bSuccess) {
                    this.onUpdate.next({ oItem: this.oItem });
                } else {
                    this.oPopupService.alert(this.w('error.update'));
                }
            });
    }
}