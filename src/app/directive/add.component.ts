import { Component, EventEmitter, Renderer, OnChanges, SimpleChange, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

import { Model } from '../model/_model';
import { FocusDirective } from './focus.directive';
import { MarkdownPipe } from '../pipe/markdown.pipe';

declare var $: any;

@Component({
    selector: 'grader-add',
    templateUrl: '../../tmpl/add.component.html',
    inputs: [
        'oItem',
        'aHidden',
        'sValue',
        'sTitle',
        'sClass',
        'bDisplayNow'
    ],
    outputs: [
        'onAdd'
    ]
})

export class AddComponent<T extends Model> extends _Component implements OnChanges {
    oItem: T;
    oItemNew: T;
    sTitle: string = '';
    sValue: string;
    sClass: string = '';
    bDisplayNow: boolean = false;
    aHidden: string[] = [];
    onAdd = new EventEmitter(true);
    aField: { sName: string, sType: string, mValue: any, aDropdownValue: { nId: number, sName: string, sCategory: string }[] }[];
    bVolatile: boolean = false;
    bShow: boolean = false;
    
    @ViewChild('oModal') oModal: any;
    
    private oRenderer: Renderer; 
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService, _oRenderer: Renderer) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
        this.oRenderer = _oRenderer;
    }
    
    ngOnChanges(_oChange: { [_sProperty: string]: SimpleChange }) {
        if(_oChange && typeof(_oChange['bDisplayNow']) !== 'undefined' && this.bDisplayNow === true) {
            this.onClickAdd(this.oModal.nativeElement);
        }
    }
    
    isGroupedDropdown(_aDropdownValue: { nId: number, sName: string, sCategory: string }[]) {
        return _aDropdownValue.length > 0 && _aDropdownValue[0].sCategory !== null;
    }
    
    getDropdownCategories(_aDropdownValue: { nId: number, sName: string, sCategory: string }[]) {
        let aCategory: string[] = [];
        _aDropdownValue.forEach( (_oDropdown: { nId: number, sName: string, sCategory: string }) => {
                if(aCategory.indexOf(_oDropdown.sCategory) < 0) {
                    aCategory.push(_oDropdown.sCategory);
                }
            });
        return aCategory.sort();
    }
    
    getFilteredDropdown(_aDropdownValue: { nId: number, sName: string, sCategory: string }[], _sFilterCategory: string) {
        return _aDropdownValue.filter( (_oDropdown: { nId: number, sName: string, sCategory: string }) => _oDropdown.sCategory == _sFilterCategory).sort();
    }
    
    validate(_oField: { sName: string, sType: string, mValue: any, aDropdownValue: { nId: number, sName: string, sCategory: string }[] }) {
        switch(_oField.sType) {
            case 'foreign':
            case 'boolean':
                let bValid = false;
                _oField.aDropdownValue.forEach( (_oForeign: { nId: number, sName: string, sCategory: string }) => {
                        if(_oForeign.nId == _oField.mValue) {
                            bValid = true;
                        }
                    });
                if(!bValid) {
                    return false;
                }
                //no break; here as the number should also be checked in this case
            case 'number':
                if(isNaN(_oField.mValue) || _oField.mValue === null) {
                    this.oPopupService.alert(this.w('error.number'));
                    return false;
                }
                break;
            case 'text-short':
            case 'text-long':
            default:
                if(_oField.sName == 'sName' && _oField.mValue == '') {
                    this.oPopupService.alert(this.w('error.string'));
                    return false;
                }
                break;
        }
        return true;
    }
    
    onDropdownUpdate(_oField: { sName: string, sType: string, mValue: any, aDropdownValue: { nId: number, sName: string, sCategory: string }[] }, _nId: number) {
        _oField.mValue = _nId;
    }
    
    onClickAdd(_oModal: any) {
        this.bShow = true;
        this.aField = [];
        this.oItemNew = this.oItem.clone();
        for(let sProperty in JSON.parse(this.oItemNew.toString())) {
            if(this.aHidden.indexOf(sProperty) < 0) {
                switch(sProperty.substr(0, 1)) {
                    case 'b':
                        this.aField.push({
                            sName: sProperty,
                            sType: 'boolean',
                            mValue: this.oItemNew[sProperty] ? this.oItemNew[sProperty] : 0,
                            aDropdownValue: [
                                { nId: 0, sName: this.w('false'), sCategory: null },
                                { nId: 1, sName: this.w('true'), sCategory: null }
                            ]
                        });
                        break;
                    case 'n':
                    case 'f':
                        if(sProperty.match(/n[A-Z](2[A-Z]|[a-z]{2})Id/) === null) {
                            this.aField.push({
                                sName: sProperty,
                                sType: 'number',
                                mValue: this.oItemNew[sProperty] ? this.oItemNew[sProperty] : '',
                                aDropdownValue: []
                            });
                        } else {
                            let aForeign = this.oDataService.getPossibleForeigns(sProperty);
                            this.aField.push({
                                sName: sProperty,
                                sType: 'foreign',
                                mValue: this.oItemNew[sProperty] ? this.oItemNew[sProperty] : (aForeign.length > 0 ? aForeign[0].nId : 0),
                                aDropdownValue: aForeign
                            });
                        }
                        break;
                    case 'd':
                        this.aField.push({
                            sName: sProperty,
                            sType: 'date',
                            mValue: this.oItemNew[sProperty] ? this.oItemNew[sProperty] : '',
                            aDropdownValue: []
                        });
                        break;
                    case 's':
                    default:
                        this.aField.push({
                            sName: sProperty,
                            sType: sProperty == 'sNote' ? 'text-long' : 'text-short',
                            mValue: this.oItemNew[sProperty] ? this.oItemNew[sProperty] : '',
                            aDropdownValue: []
                        });
                        break;
                }
            }
        }
        $(_oModal).modal('show');
    }
    
    onClickAbort(_oModal: any) {
        $(_oModal).modal('hide');
        this.bShow = true;
    }
    
    onClickSubmit(_oModal: any) {
        let bValid = true;
        this.aField.forEach( (_oField: { sName: string, sType: string, mValue: any, aDropdownValue: { nId: number, sName: string, sCategory: string }[] }) => {
                if(this.validate(_oField)) {
                    this.oItemNew[_oField.sName] = _oField.mValue;
                } else {
                    bValid = false;
                }
            });
        if(bValid) {
            this.bVolatile = true;
            this.oDataService.addItem(this.oItemNew, ( _bSuccess: boolean) => {
                    this.bVolatile = false;
                    if(_bSuccess) {
                        this.onClickAbort(_oModal);
                        this.onAdd.next({ oItem: this.oItemNew });
                    } else {
                        this.oPopupService.alert(this.s('error.add', this.oItemNew.getName()));
                    }
                });
        }
    }
}