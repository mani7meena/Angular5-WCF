import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {PriceListComponent} from './price-list.component';
import {PriceListRoutingModule} from './price-list-routing.module';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PriceListRoutingModule,
        OwlDateTimeModule
    ],
    declarations: [
        PriceListComponent,
    ]
})
export class PriceListModule {
}
