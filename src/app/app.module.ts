import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { FixedPluginModule} from './shared/fixedplugin/fixedplugin.module';
import { NguiMapModule} from '@ngui/map';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { UserComponent }   from './user/user.component';
import { TableComponent }   from './table/table.component';
import { TypographyComponent }   from './typography/typography.component';
import { IconsComponent }   from './icons/icons.component';
import { MapsComponent }   from './maps/maps.component';
import { NotificationsComponent }   from './notifications/notifications.component';
import { UpgradeComponent }   from './upgrade/upgrade.component';

import {SimpleLayoutComponent} from "./layouts/simple-layout.component";
import {FullLayoutComponent} from "./layouts/full-layout.component";
import {P404Component} from './pages/404.component';
import {JwtModule} from '@auth0/angular-jwt';
import {HttpClientModule} from '@angular/common/http';
import {AuthModule} from "./auth/auth.module";
import {AuthGuard} from './models/auth.guard';
import {UserService} from './models/user.service';
import {GlobalService} from './models/global.service';
import {DataService} from './models/data.service';

import {PriceListService} from './models/price-list.service';
import {SharedModule} from './shared/shared.module';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DatePipe} from '@angular/common';
import {MasterModule} from './master/master.module';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UserComponent,
    TableComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    P404Component,
    SimpleLayoutComponent,
    FullLayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes),
    SidebarModule,
    NavbarModule,
    FooterModule,
    FixedPluginModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=YOUR_KEY_HERE'}),
    AuthModule,
    HttpClientModule,
    JwtModule.forRoot({
        config: {
            tokenGetter: () => {
                return localStorage.getItem('access_token');
            },
            whitelistedDomains: ['localhost:3001'],
            throwNoTokenError: false
        }
    }),
    SharedModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    MasterModule
  ],
  providers: [GlobalService, UserService, DataService,PriceListService, AuthGuard,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
