import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';


@Injectable()
export class GlobalService {

    public setting: any = {};
    public apiHost: string;

    constructor() {
        if (environment.production === true) {
            this.apiHost = 'http://apietrax.iflotech.in/Api';
        } else {
            this.apiHost = 'http://apietrax.iflotech.in/Api';
        }
    }

    loadGlobalSettingsFromLocalStorage(): void {
        if (localStorage.getItem('web-setting') != null) {
            this.setting = JSON.parse(localStorage.getItem('web-setting'));
        }
    }
}
