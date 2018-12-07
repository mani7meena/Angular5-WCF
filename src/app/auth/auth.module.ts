import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginModule} from './login/login.module';
import {LogoutModule} from './logout/logout.module';
import {SignupModule} from './signup/signup.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        LoginModule,
        LogoutModule,
        SignupModule
    ],
})
export class AuthModule {
}
