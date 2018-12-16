import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder,FormArray, Validators} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DataService } from '../../models/data.service';
import { PriceListService } from '../../models/price-list.service';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
})

export class PriceListComponent implements OnInit {
  public tableData1: TableData;
  public _addForm: FormGroup;
  public _formErrors: any;
  public _submitted = false;
  public _errorMessage = '';
  public success_msg = '';

  public mode:string = 'home';
  public loadingData:boolean = false;
  public allCustomers:any = [];
  public allStockItems:any = [];
  public typeID:number = 1;
  public priceListID:number;
  public loading:any = [];

  constructor(
        private _dataService:DataService,
        private _priceListService:PriceListService,
        private _formBuilder: FormBuilder,
        private datePipe: DatePipe
    ) { 
        this._addForm = this._formBuilder.group({
            //PriceListID: [{value:'', readonly : true}],
            PriceListDate: ['', Validators.required],
            //PriceListTypeID: ['', Validators.required],
            LedgerID: ['', Validators.required],
            //LedgerName: ['', Validators.required],
            //CompanyID: ['', Validators.required],
            PriceListItems: this._formBuilder.array([this.initItemRows()])
        });
        this._addForm.valueChanges
            .subscribe(data => this.onValueChanged(data));
            console.log(this._addForm);
        
    }

    initItemRows() {
        return this._formBuilder.group({
            // list all your form controls here, which belongs to your form array
            stockItemID: [''],
            itemSerialNo:[''],
            itemCode:[''],
            itemName:[''],
            itemRate:[''],
            stopsRate:[''],
            lengthRate:[''],
            discountPercentage:['']
        });
    }

    addNewRow() {
        // control refers to your formarray
        const control = <FormArray>this._addForm.controls['PriceListItems'];
        // add new formgroup
        control.push(this.initItemRows());
    }

    deleteRow(index: number) {
        // control refers to your formarray
        const control = <FormArray>this._addForm.controls['PriceListItems'];
        // remove the chosen row
        control.removeAt(index);
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
            //PriceListID: {valid: true, message: ''},
            PriceListDate: {valid: true, message: ''},
            //PriceListTypeID: {valid: true, message: ''},
            LedgerID: {valid: true, message: ''},
            //CompanyID: {valid: true, message: ''},
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

  ngOnInit() {
        
  }

  onClickType(name,typeID){
    this.typeID = typeID;
  }

  search(){
    this.mode = 'list';
    this.loadingData = true;
    this.tableData1 = {
        headerRow: [ 'ID', 'Date', 'Ledger ID', 'Ledger Name', 'Item Count', 'Action'],
        dataRows: []
    };

    let typeID = this.typeID;
    let ledgerID = 0;
    this._priceListService.getList(typeID,ledgerID)
    .subscribe(
        result => {
            console.log('allList',result);
           this.loadingData = false;
            let arr = [];
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                arr.push([
                    element.priceListID,
                    element.priceListDate,
                    element.ledgerID,
                    element.ledgerName,
                    element.itemCount,
                ]);                   
            }
            this.tableData1.dataRows = arr;
        },
        error => {
            this.loadingData = false;
        }
    );
  }

  showForm(){
    this.priceListID = 0;  
    this.mode = 'edit';
    this.loadCoreData();
  }

  edit(priceListID){
    this.loadingData = true;
    this.priceListID = priceListID;
    this._addForm.reset();
    this._resetMessages();
    this.tableData1.dataRows = [];
    this.loadCoreData();
    
        this._priceListService.viewDetail(priceListID)
        .subscribe(
            result => {
                this.loadingData = false;
                this.mode = 'edit';
                var parts = result[0].priceListDate.split("-");
                let priceListDate = new Date(parts[2], parts[1] - 1, parts[0]);
                console.log('deta',result);
                // this._addForm.controls['PriceListDate'].setValue(priceListDate);
                // this._addForm.controls['LedgerID'].setValue(result[0].ledgerID);
                // this._addForm.controls['PriceListItems'].setValue(result[0].priceListItems);
                 this._addForm.setValue({
                    PriceListDate: priceListDate,
                    LedgerID: result[0].ledgerID,
                    PriceListItems: result[0].priceListItems
                }); 

                console.log( this._addForm);          
            },
            error => {
                console.log('error',error);
            }
        );
    }

    loadCoreData(){
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

    }

    add(elementValues: any){
        this._resetFormErrors();
        this._resetMessages();
        console.log('ev',elementValues);

        // if(!this._addForm.valid)
        //     return;
        elementValues.PriceListDate = this.datePipe.transform(elementValues.PriceListDate, 'yyyy-MM-dd'); 
        elementValues.PriceListTypeID = this.typeID;
        elementValues.PriceListID = this.priceListID;

        this._submitted = true;
        this._priceListService.addNew(elementValues)
        .subscribe(
            result => {
                console.log('res',result);
                if (result.status == '200') {
                    let msg = '';
                    if(this.priceListID == 0){
                        msg = 'created';
                    }else{
                        msg = 'updated';
                    }
                    this.success_msg = 'PriceList (ID:'+result.data[0].priceListID+') successfully '+msg; 
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

    _resetMessages(){
        this.success_msg = '';
    }
}
