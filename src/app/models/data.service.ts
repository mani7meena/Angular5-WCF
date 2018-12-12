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
    
    // Get transactions by type ID
    getTxs(typeID): Observable<any> {  
        //console.log('ser',this._userService.getUserID());
        let CompanyID = this._userService.getUserID();
        let TransactionTypeID = typeID;
        let FromDate = '01/07/2011';
        let ToDate = '30/12/2018';

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

    // Get details of a transaction by ID
    viewDetail(transactionID): Observable<any> {  
        //console.log('ser',this._userService.getUserID());
        let CompanyID = this._userService.getUserID();
        
        let headers = this.getHeaders();
        return this._authHttp.get(
            this._globalService.apiHost+'/Transactions/GetTransactionDetails?TransactionID='+transactionID,
            {
                headers: headers
            }
        )
        .map((response) => {
            return <any>response['data'];
        })
            .catch(this.handleError);
    }

    // get all customer list
    getCustomerList(): Observable<any> {  
        //console.log('ser',this._userService.getUserID());
        let CompanyID = this._userService.getUserID();

        let headers = this.getHeaders();
        return this._authHttp.get(
            this._globalService.apiHost+'/Masters/GetCustomerList?CompanyID='+CompanyID,
            {
                headers: headers
            }
        )
        .map((response) => {
            return <any>response['data'];
        })
            .catch(this.handleError);
    }

    // get all locations
    getLocationList(): Observable<any> {  
        //console.log('ser',this._userService.getUserID());
        let CompanyID = this._userService.getUserID();

        let headers = this.getHeaders();
        return this._authHttp.get(
            this._globalService.apiHost+'/Masters/GetLocationList?CompanyID='+CompanyID,
            {
                headers: headers
            }
        )
        .map((response) => {
            return <any>response['data'];
        })
            .catch(this.handleError);
    }

    // get transaction type series
    getTransactionTypeSeries(transactionTypeID): Observable<any> {  
        //console.log('ser',this._userService.getUserID());
        let CompanyID = this._userService.getUserID();

        let headers = this.getHeaders();
        return this._authHttp.get(
            this._globalService.apiHost+'/Transactions/GetTransactionTypeSeries?TransactionTypeID='+transactionTypeID,
            {
                headers: headers
            }
        )
        .map((response) => {
            return <any>response['data'];
        })
            .catch(this.handleError);
    }

    // get all pos
    getPOList(): Observable<any> {  
        let CompanyID = this._userService.getUserID();
        let headers = this.getHeaders();
        return this._authHttp.get(
            this._globalService.apiHost+'/Transactions/GetPendingSalesOrderList?CompanyID='+CompanyID,
            {
                headers: headers
            }
        )
        .map((response) => {
            return <any>response['data'];
        })
            .catch(this.handleError);
    }

    // get POs by Supplier ID
    getPOListByID(CompanyID): Observable<any> {  
        //let CompanyID = this._userService.getUserID();
        let headers = this.getHeaders();
        return this._authHttp.get(
            this._globalService.apiHost+'/Transactions/GetPendingSalesOrderList?CompanyID='+CompanyID,
            {
                headers: headers
            }
        )
        .map((response) => {
            return <any>response['data'];
        })
            .catch(this.handleError);
    }

    // get currency list
    getCurrency(): Observable<any> {  
        let CompanyID = this._userService.getUserID();
        let headers = this.getHeaders();
        return this._authHttp.get(
            this._globalService.apiHost+'/Masters/GetCurrencyList?CompanyID='+CompanyID,
            {
                headers: headers
            }
        )
        .map((response) => {
            return <any>response['data'];
        })
            .catch(this.handleError);
    }

    // get stock items
    getStockItems(): Observable<any> {  
        let CompanyID = this._userService.getUserID();
        let headers = this.getHeaders();
        return this._authHttp.get(
            this._globalService.apiHost+'/Stockitem/GetStockItems?CompanyID='+CompanyID,
            {
                headers: headers
            }
        )
        .map((response) => {
            return <any>response['data'];
        })
            .catch(this.handleError);
    }

    // get Tax Ledger List
    getTaxLedgerList(): Observable<any> {  
        let CompanyID = this._userService.getUserID();
        let headers = this.getHeaders();
        return this._authHttp.get(
            this._globalService.apiHost+'/Ledger/GetTaxLedgerList?CompanyID='+CompanyID,
            {
                headers: headers
            }
        )
        .map((response) => {
            return <any>response['data'];
        })
            .catch(this.handleError);
    }

    // Add new
    addNew(data): Observable<any> {  
        let CompanyID = this._userService.getUserID();
        let headers = this.getHeaders();
        console.log('data',data);
        //return;
        let transactionID = 0;
        if(data.transaction_id != 0){
            transactionID = data.transactionID;
        }

        let transactionNo = 'GSL-00001/18-19';
        if(data.transaction_no != ''){
            transactionNo = data.transactionNo;
        }
        
        return this._authHttp
        .post(
            this._globalService.apiHost + '/Transactions/UpdateTransaction',
            JSON.stringify({
                    "transactionID": transactionID,
                    "transactionDate": data.transaction_date,//"10-08-2018",
                    "transactionNo": transactionNo,//data.transaction_no,//"GSL-00001/18-19",
                    "transactionTypeId": data.transactionTypeId,//12
                    "transactionSeriesID": data.transaction_series,//12
                    "transactionSerialNo": 1,//hold
                    "ledgerID": data.supplier,//1,
                    "transactionLinkID": data.po_no,//0,
                    "transactionLinkRef": data.po_no,//"NA",
                    "companyID": CompanyID,//1,
                    "locationID": data.location_name,//1,
                    "transaction_Remarks": "NA",
                    "transaction_Amount": 500,//data.transaction_amount,//500,
                    "transaction_PendingAmount": 500,//data.transaction_amount,//500,
                    "currencyID": data.currencyID,//1,
                    "transactionDueDate": "30-12-2018",//data.transaction_due_date,//"09-08-2018",
                    "userID": data.supplier,//0,
                    "transItemDetails": [
                        {
                            "transactionID": transactionID,
                            "stockitemID": data.stock_item,//1,
                            "transactionItem_AdditionalDesciption": data.additional_desc,//"",
                            "locationID": data.location_name,//1,
                            "itemQty": data.qty,//1,
                            "itemReceived_Qty": data.qty,//0,
                            "itemChallan_Qty": data.qty,//0,
                            "itemPending_Qty": 0,
                            "itemRate": data.rate,//2566,
                            "itemAmount": data.id_amount,//2566,
                            "itemStops": "0",
                            "itemLength": "0",
                            "itemBatchApplicable": 0,
                            "packingBoxStockItemID": 0,
                            "transactionItemSerialNo": 1
                        },
                        // {
                        //     "transactionID": 4,
                        //     "stockitemID": 5,
                        //     "transactionItem_AdditionalDesciption": "",
                        //     "locationID": 1,
                        //     "itemQty": 1,
                        //     "itemReceived_Qty": 0,
                        //     "itemChallan_Qty": 0,
                        //     "itemPending_Qty": 0,
                        //     "itemRate": 2566,
                        //     "itemAmount": 2566,
                        //     "itemStops": "0",
                        //     "itemLength": "0",
                        //     "itemBatchApplicable": 0,
                        //     "packingBoxStockItemID": 0,
                        //     "transactionItemSerialNo": 1
                        // }
                    ],
                    "transLedgerDetails": [
                        {
                            "transactionID": transactionID,
                            "ledgerID": data.tax_ledger_name,//,10,
                            "taxRate": data.tax_rate,//6,
                            "ledgerAmount": data.ld_amount,//,153.96
                        },
                        // {
                        //     "transactionID": 4,
                        //     "ledgerID": 4,
                        //     "taxRate": 6,
                        //     "ledgerAmount": 153.96
                        // }
                    ],
                    "transBoxDetails": [],
                    "transBatchDetails": [],
                    "transPOTerms": [],
                    "transGRNTerms": [],
                    "transInvoiceTerms": [
                        {
                            "transactionID": transactionID,
                            "transporterLedgerID": 1,
                            "transporterLRNO": "ARC LTD",
                            "transporterLRDate": "30AARRRRR",
                            "transporterGSTIN": "LRNO",
                            "gstEwayBillNo": "EOOWOq",
                            "gsteWayBillDate": "01-08-2018"
                        }
                    ],
                    "transWorkCompletionDetails": []
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
