import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';

declare var $:any;
declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}


import { UserService } from '../models/user.service';
import { DataService } from '../models/data.service';

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit{
    public tableData1: TableData;

    constructor(
        private _userService: UserService,
        private _dataService: DataService
        ) {
        
    }

    ngOnInit(){
        this.tableData1 = {
            headerRow: [ 'Transaction ID', 'Transaction No', 'Transaction Amount', 'Ledger Name', 'Location Name'],
            dataRows: []
        };
        //console.log('1',this.tableData1);
        this._dataService.getTxs()
        .subscribe(
            result => {
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
                //     this._submitted = false;
                // }
            },
            error => {
                // this._submitted = false;
                // // Validation error
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
}
