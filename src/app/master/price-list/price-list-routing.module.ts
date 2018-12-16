import { NgModule } from '@angular/core';
import { Routes,
    RouterModule } from '@angular/router';

import { PriceListComponent } from './price-list.component';

const routes: Routes = [
    {
        path: '',
        component: PriceListComponent,
        data: {
            title: 'Price List'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PriceListRoutingModule {}
