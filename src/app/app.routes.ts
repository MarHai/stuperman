import { Routes }  from '@angular/router';

import { AppComponent } from './app.component';
import { ProfileComponent } from './profile.component';
import { HelpComponent } from './help.component';
import { CatalogueRouterProviders } from './com_catalogue/catalogue.routes';
import { CourseRouterProviders } from './com_course/course.routes';
import { StudentRouterProviders } from './com_student/student.routes';

export const AppRouterProviders: Routes = [
    {
        path: 'app',
        component: AppComponent,
        children: [
            ...CatalogueRouterProviders,
            ...CourseRouterProviders,
            ...StudentRouterProviders,
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'help',
                component: HelpComponent
            }
        ]
    }
];