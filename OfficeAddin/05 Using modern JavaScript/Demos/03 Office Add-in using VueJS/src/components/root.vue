<template>
<div>
  <waiting v-if="waiting"></waiting>
  <header-component v-bind:error="error" title="Excel Portfolio"></header-component>
  <div class="padding10">
    <div class="pct100 tbl-head">
      <span class="ms-font-l">Stock Symbols</span>
    </div>
    <div class="pct100">
      <input class="ms-TextField-field"
          v-model="newSymbol"
          v-on:keyup="addSymbol(newSymbol)"
          placeholder="Enter a stock symbol (ex: MSFT)" />
    </div>
    <stock v-for="(symbol, index) in symbols"
        v-bind:key="symbol"
        v-bind:symbol="symbol"
        v-bind:index="index"
        v-on:refreshSymbol="refreshSymbol(index)"
        v-on:deleteSymbol="deleteSymbol(index)"></stock>
    <div class="pct100 itemRow" v-if="symbols.length == 0">
      <em class="ms-font-l">No symbols added</em>
    </div>
  </div>
</div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import waiting from "./Waiting.vue";
  import headerComponent from "./HeaderComponent.vue";
  import stock from "./Stock.vue";
  import { ExcelTableUtil } from '../utils/ExcelTableUtil';

  const ALPHAVANTAGE_APIKEY: string = '{{REPLACE_WITH_ALPHAVANTAGE_APIKEY}}';

  @Component({
    data: function () {
      return {
        symbols: [],
        waiting: false,
        error: "",
        newSymbol: "",
        tableUtil: new ExcelTableUtil('Portfolio', 'A1:H1', [
          'Symbol',
          'Last Price',
          'Timestamp',
          'Quantity',
          'Price Paid',
          'Total Gain',
          'Total Gain %',
          'Value'
        ])
      };
    },
    components: {
      waiting,
      headerComponent,
      stock
    },
    methods: {
      getQuote(symbol:string) {
        return new Promise((resolve, reject) => {
          const queryEndpoint = `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${escape(symbol)}&interval=1min&apikey=${ALPHAVANTAGE_APIKEY}`;

          fetch(queryEndpoint)
            .then((res: any) => {
              if (!res.ok) {
                reject('Error getting quote');
              }
              return res.json();
            })
            .then((jsonResponse: any) => {
              const quote: any = jsonResponse['Stock Quotes'][0];
              resolve(quote);
            });
        });
      },
      addSymbol(symbol: string) {
        if ((<KeyboardEvent>event).key == "Enter") {
          this.waiting = true;
          this.getQuote(symbol).then((res:any) => {
            let data = [
              res['1. symbol'], //Symbol
              res['2. price'], //Last Price
              res['4. timestamp'], // Timestamp of quote
              0,
              0,
              '=(B:B * D:D) - (E:E * D:D)', //Total Gain $
              '=H:H / (E:E * D:D) * 100', //Total Gain %
              '=B:B * D:D' //Value
            ];
            this.tableUtil.addRow(data).then(() => {
              this.symbols.unshift(symbol);
              this.waiting = false;
              this.newSymbol = "";
            }, (err) => {
              this.error = err;
            });
          }, (err) => {
            this.error = err;
            this.waiting = false;
          });
        }
      },
      deleteSymbol(index: number) {
        // Delete from the Excel table using the index number.
        let symbol = this.symbols[index];
        this.waiting = true;
        this.tableUtil.getColumnData("Symbol").then(async (columnData:string[]) => {
          // Make sure the symbol was found in the Excel table
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
      },
      refreshSymbol(index: number) {
        // Refresh stock quote and update the Excel table.
        let symbol = this.symbols[index];
        this.waiting = true;
        this.tableUtil.getColumnData("Symbol").then(async (columnData:string[]) => {
          // Ensure the symbol was found in the Excel table
          var rowIndex = columnData.indexOf(symbol);
          if (rowIndex != -1) {
            this.getQuote(symbol).then((res:any) => {
                // "last trade" is in column B with a row index offset of 2 (row 0 + the header row)
                this.tableUtil.updateCell(`B${rowIndex + 2}:B${rowIndex + 2}`, res['2. price']).then(async () => {
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
      },
      syncTable() {
        this.waiting = true;
        this.tableUtil.getColumnData("Symbol").then(async (columnData:string[]) => {
          this.symbols = columnData;
          this.waiting = false;
        }, (err) => {
          this.error = err;
          this.waiting = false;
        });
      }
    },
    mounted: function () {
      (<any>this).syncTable();
    }
  })
  export default class root extends Vue {
    name: 'root'
  }
</script>