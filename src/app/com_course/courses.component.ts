import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../data.service';
import { PopupService } from '../popup.service';
import { _Component } from '../_.component';

import { Course } from '../model/course';

import { AddComponent } from '../directive/add.component';
import { QuicklinkComponent } from '../directive/quicklink.component';

@Component({
    selector: 'courses',
    templateUrl: '../../tmpl/courses.component.html'
})

export class CoursesComponent extends _Component {
    aCourse: Course[] = [];
    aCategory: string[] = [];
    private sFilterCategory = '';
    
    constructor(_oRouter: Router, _oRoute: ActivatedRoute, _oDataService: DataService, _oPopupService: PopupService) {
        super(_oRouter, _oRoute, _oDataService, _oPopupService);
    }
    
    ngOnInit() {
        this.updateLists();
    }
    
    updateLists() {
        //find courses and sort (descending) by last modify date
        this.aCourse = this.oDataService.getCourses();
        this.aCourse.sort( (_oA: Course, _oB: Course) => {
                let dA = _oA.dUpdate;
                let dB = _oB.dUpdate;
                return dA < dB ? 1 : dA > dB ? -1 : 0;
            });
        //extract categories from the courses (which are then sorted by modification date)
        let oCategoryDate = {};
        this.aCourse.forEach( (_oCourse: Course) => {
                if(this.aCategory.indexOf(_oCourse.sCategory) < 0) {
                    this.aCategory.push(_oCourse.sCategory);
                    oCategoryDate[_oCourse.sCategory] = _oCourse.dUpdate || _oCourse.dCreate;
                }
            });
        //re-sort the courses into categories (according to their sorting) and by their names
        this.aCourse.sort( (_oA: Course, _oB: Course) => {
                let sA = oCategoryDate[_oA.sCategory].toString() + _oA.getName();
                let sB = oCategoryDate[_oB.sCategory].toString() + _oB.getName();
                return sA < sB ? -1 : sA > sB ? 1 : 0;
            });
    }
    
    getCategories() {
        return this.aCategory;
    }
    
    getEmptyCourse(_sCategory?: string) {
        return new Course(_sCategory ? { sCategory: _sCategory } : {});
    }
    
    onQuicklinkChange(_oEvent: any) {
        this.sFilterCategory = _oEvent.sLink;
    }
    
    isCategoryVisible(_sCategory: string) {
        return this.sFilterCategory == '' || this.sFilterCategory == _sCategory;
    }
    
    filterCoursesOnCategory(_sCategory: string) {
        let aCourseFiltered = this.aCourse.filter(_oCourse => _oCourse.sCategory === _sCategory);
        if(aCourseFiltered.length > 1) {
            aCourseFiltered.sort(aCourseFiltered[0].sort);
        }
        return aCourseFiltered;
    }
    
    onClickCourse(_oCourse: Course) {
        this.oRouter.navigate(['app', 'course', _oCourse.nId ]);
    }
}