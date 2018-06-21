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
import waiting from "./waiting.vue";
import headerComponent from "./headerComponent.vue";
import stock from "./stock.vue";
import { ExcelTableUtil } from "../utils/excelTableUtil";

@Component({
  data: function () { 
    return {
      symbols: [],
      waiting: false,
      error: "",
      newSymbol: "",
      tableUtil: new ExcelTableUtil(
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
      )
    } 
  },
  components: {
    waiting,
    headerComponent,
    stock
  },
  methods: {
    getQuote(symbol:string) {
      return new Promise((resolve, reject) => {
        let url = `https://estx.azurewebsites.net/api/quote/${symbol}`;
        fetch(url).then((res) => {
          if (res.ok)
            resolve(res.json());
          else
            reject("Error getting quote");
        });
      });
    },
    addSymbol(symbol:string) {
      if ((<KeyboardEvent>event).key == "Enter") {
        (<any>this).waiting = true;
        (<any>this).getQuote(symbol).then((res:any) => {
          let data = [res.symbol, res.current, res.curr_change, res.pct_change * 100, 0, 0, "=C:C * E:E", "=(B:B * E:E) - (F:F * E:E)", "=H:H / (F:F * E:E) * 100", "=B:B * E:E"];
          (<any>this).tableUtil.addRow(data).then(() => {
            (<any>this).symbols.unshift(symbol);
            (<any>this).waiting = false;
            (<any>this).newSymbol = "";
          }, (err) => {
            (<any>this).error = err;
          });
        }, (err) => {
          (<any>this).error = err;
          (<any>this).waiting = false;
        });
      }
    },
    deleteSymbol(index:number) {
      // Delete from Excel table by index number
      let symbol = (<any>this).symbols[index];
      (<any>this).waiting = true;
      (<any>this).tableUtil.getColumnData("Symbol").then(async (columnData:string[]) => {
        // Ensure the symbol was found in the Excel table
        if (columnData.indexOf(symbol) != -1) {
          (<any>this).tableUtil.deleteRow(columnData.indexOf(symbol)).then(async () => {
            (<any>this).symbols.splice(index, 1);
            (<any>this).waiting = false;
          }, (err) => {
            (<any>this).error = err;
            (<any>this).waiting = false;
          });
        }
        else {
          (<any>this).symbols.splice(index, 1);
          (<any>this).waiting = false;
        }
      }, (err) => {
        (<any>this).error = err;
        (<any>this).waiting = false;
      });
    },
    refreshSymbol(index:number) {
      // Refresh stock quote and update Excel table
      let symbol = (<any>this).symbols[index];
      (<any>this).waiting = true;
      (<any>this).tableUtil.getColumnData("Symbol").then(async (columnData:string[]) => {
        // Ensure the symbol was found in the Excel table
        var rowIndex = columnData.indexOf(symbol);
        if (rowIndex != -1) {
          (<any>this).getQuote(symbol).then((res:any) => {
            // "last trade" is in column B with a row index offset of 2 (row 0 + the header row)
            (<any>this).tableUtil.updateCell(`B${rowIndex + 2}:B${rowIndex + 2}`, res.current).then(async () => {
              (<any>this).waiting = false;
            }, (err) => {
              (<any>this).error = err;
              (<any>this).waiting = false;
            });
          });
        }
        else {
          (<any>this).error = `${symbol} not found in Excel`;
          (<any>this).symbols.splice(index, 1);
          (<any>this).waiting = false;
        }
      }, (err) => {
        (<any>this).error = err;
        (<any>this).waiting = false;
      });
    },
    syncTable() {
      (<any>this).waiting = true;
      (<any>this).tableUtil.getColumnData("Symbol").then(async (columnData:string[]) => {
        (<any>this).symbols = columnData;
        (<any>this).waiting = false;
      }, (err) => {
        (<any>this).error = err;
        (<any>this).waiting = false;
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