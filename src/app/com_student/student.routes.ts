import { Routes }  from '@angular/router';

import { StudentComponent } from './student.component';
import { StudentsComponent } from './students.component';

export const StudentRouterProviders: Routes = [
    {
        path: 'students',
        component: StudentsComponent
    },
    {
        path: 'student/:nStuId',
        component: StudentComponent
    }
];