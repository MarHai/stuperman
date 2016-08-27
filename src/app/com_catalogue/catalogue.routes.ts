import { Routes }  from '@angular/router';

import { CatalogueComponent } from './catalogue.component';
import { CataloguesComponent } from './catalogues.component';
import { CriteriaComponent } from './criteria.component';

export const CatalogueRouterProviders: Routes = [
    {
        path: 'catalogues',
        component: CataloguesComponent
    },
    {
        path: 'catalogue/:nCatId',
        component: CatalogueComponent
    },
    {
        path: 'catalogue/:nCatId/criteria/:nC2CId',
        component: CriteriaComponent
    }
];