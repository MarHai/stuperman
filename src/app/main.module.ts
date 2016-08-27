import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MainComponent } from './main.component';
import { RouterProviders } from './main.routes';
import { DataService } from './data.service';
import { PopupService } from './popup.service';

import { AppComponent } from './app.component';
import { HelpComponent } from './help.component';
import { HomeComponent } from './home.component';
import { LogoutComponent } from './logout.component';
import { ProfileComponent } from './profile.component';
import { CatalogueComponent } from './com_catalogue/catalogue.component';
import { CataloguesComponent } from './com_catalogue/catalogues.component';
import { CriteriaComponent } from './com_catalogue/criteria.component';
import { CourseComponent } from './com_course/course.component';
import { CoursesComponent } from './com_course/courses.component';
import { CourseAddComponent } from './com_course/course_add.component';
import { CourseGradeComponent } from './com_course/course_grade.component';
import { CalculateComponent } from './com_course/calculate.component';
import { CorrectComponent } from './com_course/correct.component';
import { PersonifyComponent } from './com_course/personify.component';
import { RatingComponent } from './com_course/rating.component';
import { StudentComponent } from './com_student/student.component';
import { StudentsComponent } from './com_student/students.component';

import { ImprintComponent } from './directive/imprint.component';
import { SearchComponent } from './directive/search.component';
import { AddComponent } from './directive/add.component';
import { AddTryComponent } from './directive/add_try.component';
import { ChartComponent } from './directive/chart.component';
import { DownloadCsvComponent } from './directive/download_csv.component';
import { DeleteComponent } from './directive/delete.component';
import { EditComponent } from './directive/edit.component';
import { EmailAddComponent } from './directive/email_add.component';
import { FocusDirective } from './directive/focus.directive';
import { ImgComponent } from './directive/img.component';
import { QuicklinkComponent } from './directive/quicklink.component';
import { SeatmapComponent } from './directive/seatmap.component';
import { SortDirective } from './directive/sort.directive';
import { StudentInCourseComponent } from './directive/student_in_course.component';

import { ConvertSecondsToDatePipe } from './pipe/convert_seconds_to_date.pipe';
import { DatetimeStringifyPipe } from './pipe/datetime_stringify.pipe';
import { NewLinePipe } from './pipe/nl.pipe';
import { MarkdownPipe } from './pipe/markdown.pipe';

@NgModule({
    declarations: [
		EditComponent,
		EmailAddComponent,
		DeleteComponent,
		AddComponent,
        MainComponent,
        AppComponent,
        HelpComponent,
        LogoutComponent,
        ProfileComponent,
        CatalogueComponent,
        CataloguesComponent,
        CriteriaComponent,
        CourseComponent,
        CoursesComponent,
        CourseAddComponent,
        CourseGradeComponent,
        CalculateComponent,
        CorrectComponent,
        PersonifyComponent,
        RatingComponent,
        StudentComponent,
        StudentsComponent,
        HomeComponent,
		
        ConvertSecondsToDatePipe,
        DatetimeStringifyPipe,
        NewLinePipe,
        MarkdownPipe,
		ImprintComponent,
        ChartComponent,
        DownloadCsvComponent,
        FocusDirective,
        ImgComponent,
        QuicklinkComponent,
        SortDirective,
        SearchComponent,
        AddTryComponent,
        StudentInCourseComponent,
		SeatmapComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterProviders
    ],
    bootstrap: [
        MainComponent
    ],
    providers: [
        DataService,
        PopupService
    ]
})
export class MainModule {}