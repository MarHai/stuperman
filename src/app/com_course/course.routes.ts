import { Routes }  from '@angular/router';

import { CourseAddComponent } from './course_add.component';
import { CourseGradeComponent } from './course_grade.component';
import { CorrectComponent } from './correct.component';
import { CourseComponent } from './course.component';
import { CoursesComponent } from './courses.component';
import { RatingComponent } from './rating.component';
import { CalculateComponent } from './calculate.component';
import { PersonifyComponent } from './personify.component';

export const CourseRouterProviders: Routes = [
    {
        path: 'courses',
        component: CoursesComponent
    },
    {
        path: 'course/:nCouId',
        component: CourseComponent
    },
    {
        path: 'course/:nCouId/add',
        component: CourseAddComponent
    },
    {
        path: 'course/:nCouId/grade',
        component: CourseGradeComponent
    },
    {
        path: 'course/:nCouId/personify',
        component: PersonifyComponent
    },
    {
        path: 'course/:nCouId/rating/:nRatId',
        component: RatingComponent
    },
    {
        path: 'course/:nCouId/rating/:nRatId/try/:nTry/calculate',
        component: CalculateComponent
    },
    {
        path: 'course/:nCouId/rating/:nRatId/try/:nTry/correct',
        component: CorrectComponent
    },
    {
        path: 'course/:nCouId/rating/:nRatId/try/:nTry/correct/:nS2RId',
        component: CorrectComponent
    }
];