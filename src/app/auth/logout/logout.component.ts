import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {UserService} from '../../models/user.service';

@Component({
    selector: 'app-logout',
    template: '<strong>Logging out...</strong>',
})
export class LogoutComponent implements OnInit {

    public submitted = false;
    public error = '';

    constructor(private _userService: UserService, private _router: Router) { }

    ngOnInit() {
        this._userService.logout();
        this._router.navigate(['/']);
    }


}
