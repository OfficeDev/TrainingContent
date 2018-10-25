import * as React from 'react';
import { TextField, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { Header } from './header';
import { Waiting } from './waiting';
import { StockItem } from './StockItem';
import { ExcelTableUtil } from '../utils/ExcelTableUtil';

const ALPHAVANTAGE_APIKEY: string = '{{REPLACE_WITH_ALPHAVANTAGE_APIKEY}}';

export interface AppProps {
  title: string;
}

export interface AppState {
  listItems: string[];
  waiting: boolean;
  error: string;
}

export default class App extends React.Component<AppProps, AppState> {
  tableUtil: ExcelTableUtil = new ExcelTableUtil('Portfolio', 'A1:H1', [
    'Symbol',
    'Last Price',
    'Timestamp',
    'Quantity',
    'Price Paid',
    'Total Gain',
    'Total Gain %',
    'Value'
  ]);

  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
      waiting: false,
      error: ''
    };
  }

  componentDidMount() {
    // Sync stocks already in Excel table
    this.syncTable().then(() => {});
  }

  // Adds symbol
  addSymbol = async event => {
    if (event.key === 'Enter') {
      let element = this.refs.newSymbol as TextField;
      let symbol = element.value.toUpperCase();

      // Get quote and add to Excel table
      this.setState({ waiting: true });
      this.getQuote(symbol).then(
        (res: any) => {
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
          this.tableUtil.addRow(data).then(
            () => {
              let symbols = this.state.listItems;
              symbols.unshift(element.state.value.toUpperCase());
              this.setState({ listItems: symbols });
              element.setState({ value: '' });
              this.setState({ waiting: false });
            },
            err => {
              this.setState({ error: err });
              this.setState({ waiting: false });
            }
          );
        },
        err => {
          this.setState({ error: err });
          this.setState({ waiting: false });
        }
      );
    }
  }

  // Delete symbol
  deleteSymbol = async index => {
    // Delete from Excel table by index number
    let symbols = this.state.listItems;
    let symbol = symbols[index];
    this.setState({ waiting: true });
    this.tableUtil.getColumnData('Symbol').then(
      async (columnData: string[]) => {
        // Ensure the symbol was found in the Excel table
        if (columnData.indexOf(symbol) !== -1) {
          this.tableUtil.deleteRow(columnData.indexOf(symbol)).then(
            async () => {
              symbols.splice(index, 1);
              this.setState({ listItems: symbols });
              this.setState({ waiting: false });
            },
            err => {
              this.setState({ error: err });
              this.setState({ waiting: false });
            }
          );
        } else {
          symbols.splice(index, 1);
          this.setState({ waiting: false });
        }
      },
      err => {
        this.setState({ error: err });
        this.setState({ waiting: false });
      }
    );
  }

  // Refresh symbol
  refreshSymbol = async (index: number) => {
    // Refresh stock quote and update Excel table
    let symbols = this.state.listItems;
    let symbol = symbols[index];
    this.setState({ waiting: true });
    this.tableUtil.getColumnData('Symbol').then(
      async (columnData: string[]) => {
        // Ensure the symbol was found in the Excel table
        const rowIndex = columnData.indexOf(symbol);
        if (rowIndex !== -1) {
          this.getQuote(symbol).then((res: any) => {
            // "last trade" is in column B with a row index offset of 2 (row 0 + the header row)
            this.tableUtil
              .updateCell(`B${rowIndex + 2}:B${rowIndex + 2}`, res['2. price'])
              .then(
                async () => {
                  this.setState({ waiting: false });
                },
                err => {
                  this.setState({ error: err });
                  this.setState({ waiting: false });
                }
              );
          });
        } else {
          this.setState({ error: 'Symbol not in table' });
          symbols.splice(index, 1);
          this.setState({ waiting: false });
        }
      },
      err => {
        this.setState({ error: err });
        this.setState({ waiting: false });
      }
    );
  }

  // Reads symbols from an existing Excel workbook and pre-populates them in the add-in
  syncTable = async () => {
    this.setState({ waiting: true });
    this.tableUtil.getColumnData('Symbol').then(
      async (columnData: string[]) => {
        this.setState({ listItems: columnData });
        this.setState({ waiting: false });
      },
      err => {
        this.setState({ error: err });
        this.setState({ waiting: false });
      }
    );
  }

  // Gets a quote by calling into the stock service
  getQuote = async (symbol: string) => {
    return new Promise((resolve, reject) => {
      const queryEndpoint = `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${escape(
        symbol
      )}&interval=1min&apikey=${ALPHAVANTAGE_APIKEY}`;

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
  }

  render() {
    const stocks = this.state.listItems.map((symbol, index) => (
      <StockItem
        symbol={symbol}
        index={index}
        onDelete={this.deleteSymbol.bind(this, index)}
        onRefresh={this.refreshSymbol.bind(this, index)}
      />
    ));
    return (
      <div className="container">
        {this.state.waiting && <Waiting />}
        <Header title={this.props.title} />
        {this.state.error != '' && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
            onDismiss={() => {
              this.setState({ error: '' });
            }}>
            {this.state.error}
          </MessageBar>
        )}
        <div className="padding10">
          <div className="pct100 tbl-head">
            <span className="ms-font-l">Stock Symbols</span>
          </div>
          <div className="pct100">
            <TextField
              ref="newSymbol"
              onKeyPress={this.addSymbol.bind(this)}
              placeholder="Enter a stock symbol (ex: MSFT)"
            />
          </div>
          {stocks}
        </div>
      </div>
    );
  }
}
