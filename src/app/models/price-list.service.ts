import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';

import {GlobalService} from './global.service';
import {UserService} from './user.service';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable()
export class PriceListService {

	constructor(
		private _globalService:GlobalService,
		private _userService:UserService,
		private _authHttp: HttpClient
	){

	}

   private getHeaders():HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this._userService.getToken(),
        });
    }  

    getList(typeID,ledgerID): Observable<any> {  
        let CompanyID = this._userService.getUserID();
        let headers = this.getHeaders();
        return this._authHttp.get(
            this._globalService.apiHost+'/PriceLists/GetPriceLists?CompanyID='+CompanyID+'&PriceListTypeId='+typeID+'&LedgerID='+ledgerID,
            {
                headers: headers
            }
        )
        .map((response) => {
            return <any>response['data'];
        })
            .catch(this.handleError);
    }

    viewDetail(priceListID): Observable<any> {  
        let CompanyID = this._userService.getUserID();
        let headers = this.getHeaders();
        return this._authHttp.get(
            this._globalService.apiHost+'/PriceLists/GetPriceListDetails?PriceListID='+priceListID,
            {
                headers: headers
            }
        )
        .map((response) => {
            return <any>response['data'];
        }).catch(this.handleError);
    }

    // Add new
    addNew(data): Observable<any> {  
        let CompanyID = this._userService.getUserID();
        let headers = this.getHeaders();

        let PriceListID = 0;
        if(data.PriceListID != 0){
            PriceListID = data.PriceListID;
        }

        let PriceListItemsArray =  [];
        for (var i = 0; i < data.PriceListItems.length; ++i) {
            let index = i+1;
            PriceListItemsArray.push({
               "StockItemID":data.PriceListItems[i].stockItemID,
               "ItemSerialNo":index,
               "ItemRate":data.PriceListItems[i].itemRate,
               "StopsRate":data.PriceListItems[i].stopsRate,
               "LengthRate":data.PriceListItems[i].lengthRate,
               "DiscountPercentage":data.PriceListItems[i].discountPercentage,
            });
        }
       //  let PriceListItemsArray =  [{
							// 	"StockItemID": 1,
							// 	"ItemSerialNo": 1,
							// 	"ItemRate": 25.55,
							// 	"StopsRate": 0,
							// 	"LengthRate": 0,
							// 	"DiscountPercentage": 0
							// }];
		// console.log('data',data);	
  //       console.log('PriceListItemsArray',PriceListItemsArray);
	
       // return;
        return this._authHttp
        .post(
            this._globalService.apiHost + '/PriceLists/UpdatePriceList',
            JSON.stringify({
                    "PriceListID": PriceListID,
                    "PriceListDate": data.PriceListDate,//"10-08-2018",
                    "PriceListTypeID": data.PriceListTypeID,//data.transaction_no,//"GSL-00001/18-19",
                    "LedgerID": data.LedgerID,//12
                    "CompanyID": CompanyID,//12
                    "PriceListItems": PriceListItemsArray

            }),
            {headers}
        )
        .map((response) => {
            console.log('service resp',response);
            return <any>response;
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
