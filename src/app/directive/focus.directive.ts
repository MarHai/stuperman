import { Directive, Input, Renderer, ElementRef } from '@angular/core';

//http://stackoverflow.com/questions/31582113/angular-2-set-focus-to-another-input

@Directive({
    selector: '[focus]',
    inputs: [
        'focus'
    ]
})
export class FocusDirective {
    focus: boolean;
    private oElement: ElementRef;
    private oRenderer: Renderer;
    
    constructor(_oElement: ElementRef, _oRenderer: Renderer) {
        this.oElement = _oElement;
        this.oRenderer = _oRenderer;
        this.setFocus();
    }
    
    ngOnChanges() {
        this.setFocus();
    }
    
    setFocus() {
        if(this.focus && this.oElement) {
            this.oRenderer.invokeElementMethod(this.oElement.nativeElement, 'select', []);
            this.oRenderer.invokeElementMethod(this.oElement.nativeElement, 'focus', []);
        }
    }
}