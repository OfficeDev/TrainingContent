import { Component, NgZone } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { ExcelTableUtil } from './utils/excelTableUtil';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // AppComponent properties
  symbols:string[] = [];
  error:string = null;
  waiting = false;
  zone: NgZone = new NgZone({});
  tableUtil:ExcelTableUtil = new ExcelTableUtil(
    "Portfolio", "A1:J1", [
      "Symbol", 
      "Last Price", 
      "Change $", 
      "Change %", 
      "Quantity", 
      "Price Paid", 
      "Day's Gain $", 
      "Total Gain $", 
      "Total Gain %", 
      "Value"
    ]
  );

  // AppComponent constructor
  constructor(private http: Http) {
    this.syncTable().then(() => {});
  }
  
  // Adds symbol
  addSymbol = async (symbol:string) => {
    // Get quote and add to Excel table
    this.waiting = true;
    this.getQuote(symbol).then((res:any) => {
      let data = [
        res.symbol, 
        res.current, 
        res.curr_change, 
        res.pct_change * 100, 
        0, 
        0, 
        "=C:C * E:E", 
        "=(B:B * E:E) - (F:F * E:E)", 
        "=H:H / (F:F * E:E) * 100", 
        "=B:B * E:E"
      ];
      this.tableUtil.addRow(data).then(() => {
        this.symbols.unshift(symbol.toUpperCase());
        this.waiting = false;
      }, (err) => {
        this.error = err;
      });
    }, (err) => {
      this.error = err;
      this.waiting = false;
    });
  }

  // Delete symbol
  deleteSymbol = async (index:number) => {
    // Delete from Excel table by index number
    let symbol = this.symbols[index];
    this.waiting = true;
    this.tableUtil.getColumnData("Symbol").then(async (columnData:string[]) => {
      // make sure the symbol was found in the Excel table
      if (columnData.indexOf(symbol) != -1) {
        this.tableUtil.deleteRow(columnData.indexOf(symbol)).then(async () => {
          this.symbols.splice(index, 1);
          this.waiting = false;
        }, (err) => {
          this.error = err;
          this.waiting = false;
        });
      }
      else {
        this.symbols.splice(index, 1);
        this.waiting = false;
      }
    }, (err) => {
      this.error = err;
      this.waiting = false;
    });
  }

  // Refresh symbol
  refreshSymbol = async (index:number) => {
    // Refresh stock quote and update Excel table
    let symbol = this.symbols[index];
    this.waiting = true;
    this.tableUtil.getColumnData("Symbol").then(async (columnData:string[]) => {
      // make sure the symbol was found in the Excel table
      var rowIndex = columnData.indexOf(symbol);
      if (rowIndex != -1) {
        this.getQuote(symbol).then((res:any) => {
          // "last trade" is in column B with a row index offset of 2 (row 0 + the header row)
          this.tableUtil.updateCell(`B${rowIndex + 2}:B${rowIndex + 2}`, res.current).then(async () => {
            this.waiting = false;
          }, (err) => {
            this.error = err;
            this.waiting = false;
          });
        });
      }
      else {
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
    this.tableUtil.getColumnData("Symbol").then(async (columnData:string[]) => {
      this.symbols = columnData;
      this.waiting = false;
    }, (err) => {
      this.error = err;
      this.waiting = false;
    });
  }

  // Gets a quote by calling into the stock service
  getQuote = async (symbol:string) => {
    return new Promise((resolve, reject) => {
      let url = `https://estx.azurewebsites.net/api/quote/${symbol}`;
      this.http.get(url)
        .map(res => res.json())
        .subscribe(
          res => resolve(res),
          err => reject(err),
          () => console.log(`Quote for ${symbol.toUpperCase()} complete`)
        );
    });
  }
}
