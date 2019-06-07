// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { Component, NgZone } from '@angular/core';
import * as OfficeHelpers from '@microsoft/office-js-helpers';
import { ExcelTableUtil } from './../../utils/excelTableUtil';

const ALPHAVANTAGE_APIKEY = '{{REPLACE_WITH_ALPHAVANTAGE_APIKEY}}';

const template = require('./app.component.html');

@Component({
  selector: 'app-home',
  template
})

export default class AppComponent {  
  symbols = [];
  error = null;
  waiting = false;
  zone = new NgZone({});

  tableUtil = new ExcelTableUtil('Portfolio', 'A1:H1', [
    'Symbol',
    'Last Price',
    'Timestamp',
    'Quantity',
    'Price Paid',
    'Total Gain',
    'Total Gain %',
    'Value'
  ]);    
  constructor() {
    this.syncTable().then(() => {});
  }

  // Adds symbol
  addSymbol = async (symbol) => {
    this.waiting = true;

    // Get quote and add to Excel table
    this.getQuote(symbol).then(
      (res) => {
        const data = [
          res['1. symbol'], //Symbol
          res['2. price'], //Last Price
          res['4. timestamp'], // Timestamp of quote,
          0, // quantity (manually entered)
          0, // price paid (manually entered)
          '=(B:B * D:D) - (E:E * D:D)', //Total Gain $
          '=H:H / (E:E * D:D) * 100', //Total Gain %
          '=B:B * D:D' //Value
        ];
        this.tableUtil.addRow(data).then(
          () => {
            this.symbols.unshift(symbol.toUpperCase());
            this.waiting = false;
          },
          (err) => {
            this.error = err;
          }
        );
      },
      err => {
        this.error = err;
        this.waiting = false;
      }
    );
  }

  // Delete symbol
  deleteSymbol = async (index) => {
    // Delete from Excel table by index number
    const symbol = this.symbols[index];
    this.waiting = true;
    this.tableUtil.getColumnData('Symbol').then(
      async (columnData:string[]) => {
        // Ensure the symbol was found in the Excel table
        if (columnData.indexOf(symbol) !== -1) {
          this.tableUtil.deleteRow(columnData.indexOf(symbol))
          .then(async () => {
              this.symbols.splice(index, 1);
              this.waiting = false;
          }, err => {
            this.error = err;
            this.waiting = false;
          });
        } else {
          this.symbols.splice(index, 1);
          this.waiting = false;
        }
      }, (err) => {
        this.error = err;
        this.waiting = false;
      }
    );
  }

  // Refresh symbol
  refreshSymbol = async (index) => {
    // Refresh stock quote and update Excel table
    const symbol = this.symbols[index];
    this.waiting = true;
    this.tableUtil.getColumnData('Symbol')
      .then(async (columnData:string[]) => {
        // Ensure the symbol was found in the Excel table
        const rowIndex = columnData.indexOf(symbol);
        if (rowIndex !== -1) {
          this.getQuote(symbol).then((res) => {
            // "last trade" is in column B with a row index offset of 2 (row 0 + the header row)
            this.tableUtil.updateCell(`B${rowIndex + 2}:B${rowIndex + 2}`, res['2. price'])
            .then(async () => {
              this.waiting = false;
            }, (err) => {
              this.error = err;
              this.waiting = false;
            });
          });
        } else {
          this.error = `${symbol} not found in Excel`;
          this.symbols.splice(index, 1);
          this.waiting = false;
        }
      }, (err) => {
        this.error = err;
        this.waiting = false;
      });
  }

  // Reads symbols from an existing Excel workbook and pre-populates them in the add-in
  syncTable = async () => {
    this.waiting = true;
    this.tableUtil.getColumnData('Symbol')
      .then(async (columnData:string[]) => {
        this.symbols = columnData;
        this.waiting = false;
      }, (err) => {
        this.error = err;
        this.waiting = false;
      });
  }

  // Gets a quote by calling into the stock service
  getQuote = async (symbol) => {
    return new Promise((resolve, reject) => {
      const queryEndpoint = `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${escape(
        symbol
      )}&interval=1min&apikey=${ALPHAVANTAGE_APIKEY}`;
  
      fetch(queryEndpoint)
        .then((res) => {
          if (!res.ok) {
            reject('Error getting quote');
          }
          return res.json();
        })
        .then((jsonResponse) => {
          const quote = jsonResponse['Stock Quotes'][0];
          resolve(quote);
        });
    });
  }
}