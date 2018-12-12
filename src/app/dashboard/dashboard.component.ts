import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';


declare var $:any;
declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}


import { UserService } from '../models/user.service';
import { DataService } from '../models/data.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html',
})

export class DashboardComponent implements OnInit{
    public tableData1: TableData;
    public orderType:string = 'Purchase Order';
    public orderTypeID:number = 1;
    public loadingData:boolean = false;
    public showAddEditForm:boolean = false;
    public transactionDetails:any = {};
    
    public _addForm: FormGroup;
    public _formErrors: any;
    public _submitted = false;
    public _errorMessage = '';

    public success_msg = '';

    public allCustomers:any = [];
    public allLocations:any = [];
    public allLedgers:any = [];
    public allTransactionSeries:any = [];
    public allPOs:any = [];
    public currency:any = [];
    public allStockItems:any = [];
    public gstRate:any = [];
    public total_amount:number = 0;
    public transactionID:number = 0;
    public selectedItems:any = [];

    constructor(
        private _userService: UserService,
        private _dataService: DataService,
        private _formBuilder: FormBuilder,
        private datePipe: DatePipe
    ) {
        this._addForm = this._formBuilder.group({
            transaction_no: [{value:'',disabled: true}, Validators.required,],
            transaction_date: ['', Validators.required],
            //transaction_due_date: ['', Validators.required],
            transaction_series: ['', Validators.required],
            customer: ['', Validators.required],
            stock_item: ['', Validators.required],
            additional_desc: ['', Validators.required],
            location_name: ['', Validators.required],
            qty: ['', Validators.required],
            received_qty: ['', Validators.required],
            challan_qty: ['', Validators.required],
            rate: ['', Validators.required],
            id_amount: [{value:'',disabled: true}, Validators.required],
            tax_ledger_name: ['', Validators.required],
            tax_rate: [{value:'',disabled: true}, Validators.required],
            ld_amount: [{value:'',disabled: true}, Validators.required],
            due_date: ['', Validators.required],
            po_transporter: ['', Validators.required],
            supplier_ref: ['', Validators.required],
            delivery_terms: ['', Validators.required],
            payment_terms: ['', Validators.required],
            packing_terms: ['', Validators.required],
            freight_terms: ['', Validators.required],
            inward_no: ['', Validators.required],
            inward_date: ['', Validators.required],
            grn_transporter: ['', Validators.required],
            dc_no: ['', Validators.required],
            dc_date: ['', Validators.required],
            invoice_no: ['', Validators.required],
            invoice_date: ['', Validators.required],
            supplier: ['', Validators.required],
            po_no:['', Validators.required],
            //transaction_link_ref:[''],
            //transaction_remarks:['', Validators.required],
            transaction_amount:['', Validators.required],
        });
        this._addForm.valueChanges
            .subscribe(data => this.onValueChanged(data));
        
    }

    private _setFormErrors(errorFields: any): void {
        for (const key in errorFields) {
            // skip loop if the property is from prototype
            if (!errorFields.hasOwnProperty(key)) {
                continue;
            }

            const message = errorFields[key];
            this._formErrors[key].valid = false;
            this._formErrors[key].message = message;
        }
    }

    private _resetFormErrors(): void {
        this._formErrors = {
            transaction_no: {valid: true, message: ''},
            transaction_date: {valid: true, message: ''},
            transaction_series: {valid: true, message: ''},
            customer: {valid: true, message: ''},
            stock_item: {valid: true, message: ''},
            additional_desc: {valid: true, message: ''},
            location_name: {valid: true, message: ''},
            qty: {valid: true, message: ''},
            rate: {valid: true, message: ''},
            id_amount: {valid: true, message: ''},
            tax_ledger_name: {valid: true, message: ''},
            tax_rate: {valid: true, message: ''},
            ld_amount: {valid: true, message: ''},
            due_date: {valid: true, message: ''},
            po_transporter: {valid: true, message: ''},
            supplier_ref: {valid: true, message: ''},
            delivery_terms: {valid: true, message: ''},
            payment_terms: {valid: true, message: ''},
            packing_terms: {valid: true, message: ''},
            freight_terms: {valid: true, message: ''},
            inward_no: {valid: true, message: ''},
            inward_date: {valid: true, message: ''},
            grn_transporter: {valid: true, message: ''},
            dc_no: {valid: true, message: ''},
            dc_date: {valid: true, message: ''},
            invoice_no: {valid: true, message: ''},
            invoice_date: {valid: true, message: ''},
            supplier:{valid: true, message: ''},
            po_no:{valid: true, message: ''},
            //transaction_link_ref:{valid: true, message: ''},
        };
    }

    public _isValid(field): boolean {
        let isValid = false;

        // If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
        if (this._addForm.controls[field].touched === false) {
            isValid = true;
            // If the field is touched and valid value, then it is considered as valid.
        } else if (this._addForm.controls[field].touched === true && this._addForm.controls[field].valid === true) {
            isValid = true;
        }
        return isValid;
    }

    public onValueChanged(data?: any) {
        if (!this._addForm) { return; }
        const form = this._addForm;
        for (const field in this._formErrors) {
            if (this._formErrors.hasOwnProperty(field)) {
                // clear previous error message (if any)
                const control = form.get(field);
                if (control && control.dirty) {
                    this._formErrors[field].valid = true;
                    this._formErrors[field].message = '';
                }
            }
        }
    }

    ngOnInit(){
        this._resetFormErrors();
        this.loadingData = true;
        this.tableData1 = {
            headerRow: [ 'Transaction ID', 'Transaction No', 'Transaction Amount', 'Ledger Name', 'Location Name','Action'],
            dataRows: []
        };
        //console.log('1',this.tableData1);
        this._dataService.getTxs(this.orderTypeID)
        .subscribe(
            result => {
                console.log('allTx',result);
                this.loadingData = false;
                let arr = [];
                for (let index = 0; index < result.length; index++) {
                    const element = result[index];
                    arr.push([
                        element.transactionID,
                        element.transactionNo,
                        element.transaction_Amount,
                        element.ledgerName,
                        element.locationName,
                    ]);                   
                }
               // console.log('arr',arr);
                this.tableData1.dataRows = arr;
                //console.log('2',this.tableData1);
                // if (result.success) {
                //     this._router.navigate(['/dashboard']);
                // } else {
                //     this._errorMessage = 'Email or password is incorrect.';
                // }
            },
            error => {
                this.loadingData = false;
                // Validation error
                // if (error.status === 422) {
                //     this._resetFormErrors();
                //     const errorFields = JSON.parse(error.data.message);
                //     this._setFormErrors(errorFields);
                // } else {
                //     this._errorMessage = error.data;
                // }
            }
        );

        var dataSales = {
          labels: ['9:00AM', '12:00AM', '3:00PM', '6:00PM', '9:00PM', '12:00PM', '3:00AM', '6:00AM'],
          series: [
             [287, 385, 490, 562, 594, 626, 698, 895, 952],
            [67, 152, 193, 240, 387, 435, 535, 642, 744],
            [23, 113, 67, 108, 190, 239, 307, 410, 410]
          ]
        };

        var optionsSales = {
          low: 0,
          high: 1000,
          showArea: true,
          height: "245px",
          axisX: {
            showGrid: false,
          },
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 3
          }),
          showLine: true,
          showPoint: false,
        };

        var responsiveSales: any[] = [
          ['screen and (max-width: 640px)', {
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0];
              }
            }
          }]
        ];

        new Chartist.Line('#chartHours', dataSales, optionsSales, responsiveSales);


        var data = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          series: [
            [542, 543, 520, 680, 653, 753, 326, 434, 568, 610, 756, 895],
            [230, 293, 380, 480, 503, 553, 600, 664, 698, 710, 736, 795]
          ]
        };

        var options = {
            seriesBarDistance: 10,
            axisX: {
                showGrid: false
            },
            height: "245px"
        };

        var responsiveOptions: any[] = [
          ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0];
              }
            }
          }]
        ];

        new Chartist.Line('#chartActivity', data, options, responsiveOptions);

        var dataPreferences = {
            series: [
                [25, 30, 20, 25]
            ]
        };

        var optionsPreferences = {
            donut: true,
            donutWidth: 40,
            startAngle: 0,
            total: 100,
            showLabel: false,
            axisX: {
                showGrid: false
            }
        };

        new Chartist.Pie('#chartPreferences', dataPreferences, optionsPreferences);

        new Chartist.Pie('#chartPreferences', {
          labels: ['62%','32%','6%'],
          series: [62, 32, 6]
        });
    }

    onClickType(type,id){
        this.loadingData = true;
        this.orderType = type;
        this.orderTypeID = id;    
        this.showAddEditForm = false;

        // this.tableData1 = {
        //     headerRow: [ 'Transaction ID', 'Transaction No', 'Transaction Amount', 'Ledger Name', 'Location Name'],
        //     dataRows: []
        // };
        this.tableData1.dataRows = [];
        //console.log('1',this.tableData1);
        this._dataService.getTxs(this.orderTypeID)
        .subscribe(
            result => {
                this.loadingData = false;
               // console.log('res',result);
                let arr = [];
                for (let index = 0; index < result.length; index++) {
                    const element = result[index];
                    arr.push([
                        element.transactionID,
                        element.transactionNo,
                        element.transaction_Amount,
                        element.ledgerName,
                        element.locationName,
                    ]);                   
                }
               // console.log('arr',arr);
                this.tableData1.dataRows = arr;
                //console.log('2',this.tableData1);
                // if (result.success) {
                //     this._router.navigate(['/dashboard']);
                // } else {
                //     this._errorMessage = 'Email or password is incorrect.';
                // }
            },
            error => {
                this.loadingData = false;
                // Validation error
                // if (error.status === 422) {
                //     this._resetFormErrors();
                //     const errorFields = JSON.parse(error.data.message);
                //     this._setFormErrors(errorFields);
                // } else {
                //     this._errorMessage = error.data;
                // }
            }
        );
    }

    editDetail(transactionID){
        this.loadingData = true;
        this.transactionID = transactionID;
        this._addForm.reset();
        //this.orderType = type;
        //this.orderTypeID = id;    

        // this.tableData1 = {
        //     headerRow: [ 'Transaction ID', 'Transaction No', 'Transaction Amount', 'Ledger Name', 'Location Name'],
        //     dataRows: []
        // };
        this.tableData1.dataRows = [];
        this.loadAPIData();
        
        this._dataService.viewDetail(transactionID)
        .subscribe(
            result => {
                this.loadingData = false;
                this.showAddEditForm = true;
                this.transactionDetails = result;   
                
                
                var parts = result[0].transactionDate.split("-");
                let transaction_date = new Date(parts[2], parts[1] - 1, parts[0]);
                
                this._addForm.setValue({
                    transaction_no      : result[0].transactionNo,
                    transaction_date    : transaction_date,
                    //transaction_due_date: ['', Validators.required],
                    transaction_series  : result[0].transactionSeriesID,
                    customer            : result[0].companyID,
                    stock_item          : result[0].transItemDetails[0].stockitemID,
                    additional_desc     : result[0].transItemDetails[0].transactionItem_AdditionalDesciption,
                    location_name       : result[0].locationID,
                    qty                 : result[0].transItemDetails[0].itemQty,
                    received_qty        : result[0].transItemDetails[0].itemQty,
                    challan_qty         : result[0].transItemDetails[0].itemQty,
                    rate                : result[0].transItemDetails[0].itemRate,
                    id_amount           : result[0].transItemDetails[0].itemAmount,
                    tax_ledger_name     : result[0].transLedgerDetails[0].ledgerID,
                    tax_rate            : result[0].transLedgerDetails[0].taxRate,
                    ld_amount           : result[0].transLedgerDetails[0].ledgerAmount,
                    due_date            : '',
                    po_transporter      : '',
                    supplier_ref        : '',
                    delivery_terms      : '',
                    payment_terms       : '',
                    packing_terms       : '',
                    freight_terms       : '',
                    inward_no           : '',
                    inward_date         : '',
                    grn_transporter     : '',
                    dc_no               : '',
                    dc_date             : '',
                    invoice_no          : '',
                    invoice_date        : '',
                    supplier            : result[0].ledgerID,
                    po_no               : result[0].transactionLinkID,
                    //transaction_link_ref: '',
                    //transaction_remarks : '',
                    transaction_amount  : result[0].transaction_Amount,
                });           
            },
            error => {
                console.log('error',error);
            }
        );
    }

    showAddForm(){
        this._addForm.reset();
        this.showAddEditForm = true;
        this.loadAPIData();        
    }
    loadAPIData(){
        // Transaction Series List
        this._dataService.getTransactionTypeSeries(this.orderTypeID)
        .subscribe(
            result => {
                console.log('transaction series',result);
                this.allTransactionSeries = result;
            },
            error => {
                console.log('error',error);
            }
        );

        // Customer List
        this._dataService.getCustomerList()
        .subscribe(
            result => {
                console.log('customers',result);
                this.allCustomers = result;
            },
            error => {
                console.log('error',error);
            }
        );

        // // PO List
        // this._dataService.getPOList()
        // .subscribe(
        //     result => {
        //         console.log('POs',result);
        //         this.allPOs = result;
        //     },
        //     error => {
        //         console.log('error',error);
        //     }
        // );

        // Get Currency
        this._dataService.getCurrency()
        .subscribe(
            result => {
                console.log('Currency',result);
                this.currency = result;
            },
            error => {
                console.log('error',error);
            }
        );

        // Get Stock Items
        this._dataService.getStockItems()
        .subscribe(
            result => {
                console.log('Stock Items',result);
                this.allStockItems = result;
            },
            error => {
                console.log('error',error);
            }
        );

        // Location List
        this._dataService.getLocationList()
        .subscribe(
            result => {
                console.log('locations',result);
                this.allLocations = result;
            },
            error => {
                console.log('error',error);
            }
        );

        // Ledger List
        this._dataService.getTaxLedgerList()
        .subscribe(
            result => {
                console.log('locations',result);
                this.allLedgers = result;
            },
            error => {
                console.log('error',error);
            }
        );
    }

    onSupplierSelect(customerID){
        //console.log('select',customer);
        // // PO List
        // this._dataService.getPOListByID(customerID)
        // .subscribe(
        //     result => {
        //         console.log('POs',result);
        //         this.allPOs = result;
        //     },
        //     error => {
        //         console.log('error',error);
        //     }
        // );

        this._dataService.getPOList()
        .subscribe(
            result => {
                console.log('POs',result);
                this.allPOs = result;
            },
            error => {
                console.log('error',error);
            }
        );
    }

    onItemSelect(stockItemID){
        // console.log('select',stockItemID);
        // let item = this.allStockItems.find(item => item.stockItemID == stockItemID);
        // this.gstRate.push({stockItemID:stockItemID,gstRate:item.gstRate});
        this._addForm.controls['qty'].setValue('');
        this._addForm.controls['rate'].setValue('');
        this._addForm.controls['id_amount'].setValue('');

    }

    onEnterAmount(){
        //console.log(this._addForm.value);
        
        let stockItemID = this._addForm.value['stock_item'];
        let item = this.allStockItems.find(item => item.stockItemID == stockItemID);

        let totalAmount = Number(this._addForm.value['qty'])*Number(this._addForm.value['rate']);
        this._addForm.controls['id_amount'].setValue(totalAmount);
        // console.log(qty);
        // console.log(rate);
        // console.log(amount);
        // console.log(totalAmount);
        //let gstAmount = (totalAmount * Number(item.gstRate))/100;
        this.total_amount = totalAmount;
    }

    onAddItem(){
        let item = this.allStockItems.find(item => item.stockItemID == this._addForm.value['stock_item']);
        let temp = this.selectedItems.filter(i => i.stockItemID != this._addForm.value['stock_item']);
        temp.push({
            stockItemID:this._addForm.value['stock_item'],
            qty:this._addForm.value['qty'],
            rate:this._addForm.value['rate'],
            gstRate:item.gstRate,
            amount:this._addForm.get('id_amount').value
        });
        this.selectedItems = temp;
        console.log('temp',temp);
        console.log('selected',this.selectedItems);
        console.log(this._addForm.value);
    }

    onTaxLedgerSelect(ledgerID){
        let ledger = this.allLedgers.find(ledger => ledger.ledger_ID == ledgerID);
        let item = this.selectedItems.find(item => item.gstRate == ledger.gstRate);
        console.log('ledger',ledger);
        console.log('item',item);
        if(item){
            let gstAmount = (Number(item.amount) * Number(ledger.rateofTax))/100;
            this._addForm.controls['tax_rate'].setValue(ledger.rateofTax);
            this._addForm.controls['ld_amount'].setValue(gstAmount);
            //this.total_amount = this.total_amount + Number(gstAmount);
        }        
    }

    onSetLedger(){
        let ledger = this.allLedgers.find(ledger => ledger.ledger_ID == this._addForm.value['tax_ledger_name']);
        console.log('ledger',ledger);
        let item = this.selectedItems.find(item => item.gstRate == ledger.gstRate);
        console.log('ledger',ledger);
        console.log('item',item);
        if(item != 'undefined' ){
            let gstAmount = (Number(item.amount) * Number(ledger.rateofTax))/100;
            //this._addForm.controls['tax_rate'].setValue(ledger.rateofTax);
            //this._addForm.controls['ld_amount'].setValue(gstAmount);
            this.total_amount = this.total_amount + Number(gstAmount);
        }        
    }

    onSubmitAddForm(elementValues: any){ 
        this._resetFormErrors();

        console.log(elementValues.transaction_date);
        // var parts = result[0].transactionDate.split("-");
        // let transaction_date = new Date(parts[2], parts[1] - 1, parts[0]);
                
        elementValues.transactionTypeId = this.orderTypeID;
        elementValues.currencyID = this.currency[0].currencyID;
        elementValues.transactionID = this.transactionID;
        console.log('ev',elementValues);

        // if(!this._addForm.valid)
        //     return;
        
        this._submitted = true;
        
        this._dataService.addNew(elementValues)
        .subscribe(
            result => {
                console.log('res',result);
                
                if (result.status == '200') {
                    this.success_msg = result.message +'; Transaction ID:'+result.data[0].transactionID; 
                } 
                // else if(result.status == '200'){
                //     this.success_msg = result.message +'; Transaction ID:'+result.data[0].transactionID; 
                // }
                else {
                
                }
            },
            error => {
                this._submitted = false;
                // Validation error
                if (error.status === 422) {
                    this._resetFormErrors();
                    const errorFields = JSON.parse(error.data.message);
                    this._setFormErrors(errorFields);
                } else {
                    this._errorMessage = error.data;
                }
            }
        );
    }

    refreshToken(){
        this._userService.refreshToken()
        .subscribe(
            result => {
                console.log('result',result);
            },
            error => {
                console.log('error',error);
            }
        );
    }

    resetMessages(){
        this.success_msg = '';
    }
}
