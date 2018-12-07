import {Component, OnInit} from '@angular/core';
import {UserService} from '../models/user.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {

    public userData: any = {};

    constructor(public _userService: UserService) {
    }

    public disabled = false;
    public status: { isopen: boolean } = {isopen: false};

    public toggled(open: boolean): void {
    }

    public toggleDropdown($event: MouseEvent): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    ngOnInit(): void {
        const jwtValue: any = this._userService.getJWTValue();
        this.userData = jwtValue ? jwtValue.data : {};

    }
}
