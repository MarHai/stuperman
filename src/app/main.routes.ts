import { Routes, RouterModule }  from '@angular/router';

import { HomeComponent } from './home.component';
import { LogoutComponent } from './logout.component';

import { AppRouterProviders } from './app.routes';

const routes: Routes = [
    ...AppRouterProviders,
    {
        path: 'login',
        component: HomeComponent
    },
    {
        path: 'logout',
        component: LogoutComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: '**',
        component: HomeComponent
    }
];

export const RouterProviders = RouterModule.forRoot(routes);
//export const RouterProviders = [
//  provideRouter(routes)
//];