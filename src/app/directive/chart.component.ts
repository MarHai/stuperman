import { Component, EventEmitter, Renderer, OnChanges, SimpleChange, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

declare var $: any;
declare var Chart: any;

@Component({
    selector: 'grader-chart',
    template: '<canvas #oCanvas></canvas>',
    inputs: [
        'sType',
        'aData',
        'aLabel',
        'aSeries'
    ],
    outputs: [
        'onHover',
        'onClick'
    ]
})
//http://www.chartjs.org/docs/#advanced-usage
export class ChartComponent extends _Component implements OnChanges {
    //has to be 'histogram' or 'development'
    sType: string = 'histogram';
    onHover = new EventEmitter(true);
    onClick = new EventEmitter(true);
    aData: number[] = [];
    aLabel: string[] = [];
    aSeries: string[] = [];
    
    @ViewChild('oCanvas') oCanvas: any;
    
    private oChart: any;
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
    }
    
    ngAfterViewInit() {
        switch(this.sType) {
            case 'histogram':
                this.initHistogram();
                break;
            case 'development':
                this.initDevelopment();
                break;
        }
    }
    
    ngOnChanges(_oChange: { [_sProperty: string]: SimpleChange }) {
        if(_oChange && typeof(_oChange['aData']) !== 'undefined' && this.oChart) {
            this.oChart.data.datasets[0].data = this.aData;
            this.oChart.update();
        }
    }
    
    private initHistogram() {
        this.oChart = new Chart($(this.oCanvas.nativeElement), {
                type: 'bar',
                data: {
                    labels: this.aLabel,
                    datasets: [{
                        label: this.aSeries[0],
                        data: this.aData
                    }]
                },
                options: {
                    hover: {
                        onHover: this.onMouseHover,
                        mode: 'label'
                    },
                    onClick: this.onMouseClick,
                    scales: {
                        yAxes: [{
                            ticks: {
                                min: 0
                            }
                        }]
                    }
                }
            }
        );
    }

    private initDevelopment() {
        this.oChart = new Chart($(this.oCanvas.nativeElement), {
                type: 'line',
                data: {
                    labels: this.aLabel,
                    datasets: [{
                        label: this.aSeries[0],
                        data: this.aData,
                        fill: false,
                        lineTension: 0,
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBorderWidth: 2
                    }]
                },
                options: {
                    hover: {
                        onHover: (_aItem: any[]) => this.onMouseHover(_aItem),
                        mode: 'label'
                    },
                    onClick: (_oEvent: any, _aItem: any[]) => this.onMouseClick(_oEvent, _aItem)
                }
            }
        );
    }
    
    //weird syntax in order to get into the right this context
    onMouseHover = (_aItem: any[]) => {
        if(_aItem.length > 0) {
            this.onHover.next({ nLabel: this.aLabel[_aItem[0]._index], nCount: this.aData[_aItem[0]._index] });
        }
    }
    
    onMouseClick = (_oEvent: any, _aItem: any[]) => {
        if(_aItem.length > 0) {
            this.onClick.next({ nLabel: this.aLabel[_aItem[0]._index], nCount: this.aData[_aItem[0]._index] });
        }
    }
}