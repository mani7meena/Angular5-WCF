import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';

import {GlobalService} from './global.service';
import {UserService} from './user.service';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable()
export class DataService {

    constructor(private _globalService:GlobalService,
                private _userService:UserService,
                private _authHttp: HttpClient){
    }


    private getHeaders():HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this._userService.getToken(),
        });
    }
    
    getTxs(): Observable<any> {  
        //console.log('ser',this._userService.getCompanyID());
        let CompanyID = this._userService.getCompanyID();
        let TransactionTypeID = 1;
        let FromDate = '01/07/2011';
        let ToDate = '15/08/2018';

        let headers = this.getHeaders();
        return this._authHttp.get(
            this._globalService.apiHost+'/Transactions/GetTransactionsList?CompanyID='+CompanyID+
            '&TransactionTypeID='+TransactionTypeID+'&FromDate='+FromDate+'&ToDate='+ToDate,
            {
                headers: headers
            }
        )
        .map((response) => {
            return <any>response['data'];
        })
            .catch(this.handleError);
    }

    private handleError (error: Response | any) {
        let errorMessage:any = {};

        console.log('er',error);
        // Connection error
        if(error.status == 0) {
            errorMessage = {
                success: false,
                status: 0,
                data: "Sorry, there was a connection error occurred. Please try again.",
            };
        }
        else {
            errorMessage = error.json();
        }
        return Observable.throw(errorMessage);
    }
}
