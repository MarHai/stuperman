import { Component, Directive, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

import { SortableModel } from '../model/_sortable_model';

declare var dragula: any;
declare var $: any;

//https://github.com/bevacqua/dragula

@Directive({
    selector: '[sort]',
    inputs: [
        'sort'
    ]
})
export class SortDirective<T extends SortableModel> extends _Component {
    sort: T[];
    private oElement: ElementRef;
    private bSetSortable: boolean = false;
    private nDone: number;
    private nError: number;
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService, _oElement: ElementRef) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
        this.oElement = _oElement;
    }
    
    ngOnInit() {
        this.initSortable();
    }
    
    ngOnChanges() {
        this.initSortable();
    }
    
    initSortable() {
        if(!this.bSetSortable) {
            dragula([ this.oElement.nativeElement ], {
                    moves: (_oElem: any, _oSource: any, _oHandle: any, _oSibling: any) => {
                        return $(_oHandle).hasClass('move');
                    }
                })
                .on('drop', (_oElem: any, _oTarget: any, _oSource: any, _oSibling: any) => {
                    let oElemMoved: T = null;
                    let oElemNewlyBelow: T = null;
                    let nIdMoved: number = +(_oElem.id.split(':')[1]);
                    let nIdBelow: number = _oSibling ? +(_oSibling.id.split(':')[1]) : null;
                    this.sort.forEach( (_oSort: T) => {
                            if(_oSort.nId === nIdMoved) {
                                oElemMoved = _oSort;
                            }
                            if(_oSort.nId === nIdBelow) {
                                oElemNewlyBelow = _oSort;
                            }
                        });
                    this.updateOrder(oElemMoved.nId, oElemNewlyBelow ? oElemNewlyBelow.nId : 0);
                });
        }
    }
    
    findSortableById(_nId: number) {
        let oReturn: T = null;
        this.sort.forEach( (_oSort: T) => {
                if(_oSort.nId === _nId) {
                    oReturn = _oSort;
                }
            });
        return oReturn;
    }
    
    updateOrder(_nIdMoved: number, _nIdNewlyBelow: number) {
        let nSorter = 10;
        this.nDone = 0;
        this.nError = 0;
        this.sort.forEach( (_oSort: T) => {
                if(_oSort.nId == _nIdMoved) {
                    //do not do anything with this one (for now)
                } else if(_nIdNewlyBelow > 0 && _oSort.nId == _nIdNewlyBelow) {
                    this.updateSingle(this.findSortableById(_nIdMoved), nSorter);
                    nSorter += 10;
                    this.updateSingle(_oSort, nSorter);
                    nSorter += 10;
                } else if(_oSort.nSort == nSorter) {
                    this.nDone++;
                    nSorter += 10;
                } else {
                    this.updateSingle(_oSort, nSorter);
                    nSorter += 10;
                }
            });
        if(_nIdNewlyBelow === 0) {
            this.updateSingle(this.findSortableById(_nIdMoved), nSorter);
        }
    }

    updateSingle(_oElem: T, _nPosition: number) {
        this.oDataService.updateItem(_oElem, JSON.stringify({ nSort: _nPosition }), (_bSuccess: boolean) => {
                if(_bSuccess) {
                    this.nDone++;
                } else {
                    this.nError++;
                }
                if(this.nDone + this.nError == this.sort.length) {
                    
                }
            });
    }
}