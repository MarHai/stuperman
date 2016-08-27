import { Component, EventEmitter, Renderer } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

import { Model } from '../model/_model';
import { MarkdownPipe } from '../pipe/markdown.pipe';

declare var $: any;
declare var Image: any;

@Component({
    selector: 'grader-img',
    templateUrl: '../../tmpl/img.component.html',
    inputs: [
        'oItem',
        'sCssClass',
		'bEdit',
        'bDirectInsert'
    ],
    outputs: [
        'onUpdate'
    ]
})

export class ImgComponent<T extends Model> extends _Component {
    oItem: T;
    sCssClass: string;
	bEdit = false;
	bDragOver = false;
    onUpdate = new EventEmitter(true);
    private sNewImage: string = '';
    private oRenderer: Renderer;
    bUpdating = false;
    bDirectInsert = false;
    private nMaxWidth = 200;
    private nMaxHeight = 200;

    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService, _oRenderer: Renderer) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
        this.oRenderer = _oRenderer;
    }
    
    ngOnInit() {
    }
    
    private resize(_oImage: any) {
        let oCanvas = $('<canvas />').get(0);
        if(_oImage.width > _oImage.height) {
            oCanvas.width = this.nMaxWidth;
            oCanvas.height = Math.round(_oImage.height/(_oImage.width/this.nMaxWidth));
        } else {
            oCanvas.height = this.nMaxHeight;
            oCanvas.width = Math.round(_oImage.width/(_oImage.height/this.nMaxHeight));
        }
        oCanvas.getContext('2d').drawImage(_oImage, 0, 0, oCanvas.width, oCanvas.height);
        return oCanvas.toDataURL('image/png');
    }
    
    private stopAndPrevent(_oEvent: any) {
        _oEvent.preventDefault();
        _oEvent.stopPropagation();
    }
    
    onDropFile(_oEvent: any) {
        this.stopAndPrevent(_oEvent);
        let oTransfer = _oEvent.dataTransfer ? _oEvent.dataTransfer : _oEvent.originalEvent.dataTransfer;
        if(oTransfer) {
            if(oTransfer.files && oTransfer.files.length > 0) {
                this.onFileChange({ target: { files: oTransfer.files } });
            } else if(oTransfer.types && oTransfer.types.length > 0 && 
                      (oTransfer.types[0].match(/image.*/) || oTransfer.items[0].type.match(/image.*/))) {
                
                this.onFileChange({ target: { files: [ oTransfer.items[0].getAsFile() ] } });
            } else {
                this.onFileChange({ target: { files: [ oTransfer.getData('Text') ] } });
            }
        }
        this.bDragOver = false;
    }
    
    onDragOver(_oEvent: any) {
        this.stopAndPrevent(_oEvent);
        this.bDragOver = true;
    }
    
    onDragLeave(_oEvent: any) {
        this.stopAndPrevent(_oEvent);
        this.bDragOver = false;
    }
    
    onClickEdit() {
        $('#img-modal').on('shown.bs.modal', (_oEvent: any) => {
                $('#img-modal').find('.modal-body').get(0).click();
            })
            .modal('show');
    }
    
    onPaste(_oEvent: any) {
        let oClipboardData = _oEvent.clipboardData;
        if(oClipboardData.types.length > 0) {
            if(oClipboardData.types[0].match(/image.*/) || oClipboardData.items[0].type.match(/image.*/)) {
                this.onFileChange({ target: { files: [ oClipboardData.items[0].getAsFile() ] } });
            } else if((oClipboardData.types[0].match(/text.*/) || oClipboardData.items[0].type.match(/text.*/)) && 
                      oClipboardData.types.length > 1 && oClipboardData.types[1] == 'Files' && oClipboardData.items.length > 1) {

                this.onFileChange({ target: { files: [ oClipboardData.items[1].getAsFile() ] }});
            }
        }
    }

    onFileChange(_oEvent: any) {
        this.bUpdating = true;
        if(_oEvent.target.files.length > 0) {
            if(typeof(_oEvent.target.files[0]) == 'string') {
                this.sNewImage = _oEvent.target.files[0];
                this.updateValue();
                if(!this.bDirectInsert) {
                    $('#img-modal').modal('hide');
                }
            } else {
                let oFileReader: FileReader = new FileReader();
                oFileReader.onloadend = (_oEvent: any) => {
                    this.sNewImage = _oEvent.target.result;
                    if(this.sNewImage != '') {
                        let oImage = new Image();
                        oImage.src = this.sNewImage;
                        this.sNewImage = this.resize(oImage);
                    }
                    this.updateValue();
                    if(!this.bDirectInsert) {
                        $('#img-modal').modal('hide');
                    }
                };
                oFileReader.readAsDataURL(_oEvent.target.files[0]);
            }
        }
    }
    
    onClickDelete() {
        this.sNewImage = '';
        this.bUpdating = true;
        this.updateValue();
        if(!this.bDirectInsert) {
            $('#img-modal').modal('hide');
        }
    }
	
	private updateValue() {
        this.oDataService.updateItem(this.oItem, JSON.stringify({ sImage: this.sNewImage }), ( _bSuccess: boolean) => {
                if(_bSuccess) {
                    this.onUpdate.next({ oItem: this.oItem });
                } else {
                    this.oPopupService.alert(this.w('error.update'));
                }
                this.bUpdating = false;
            });
    }
}