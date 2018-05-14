# Build an Office Add-in using modern JavaScript tools and techniques

In this demo, you will build an Office Add-in using React, a popular JavaScript framework.

## Running the project

The finished solution is provided in this folder to simplify demonstrations. If you want to run the finished project, clone the repository, run **npm install**, then **npm run start** and follow the steps to [Sideload the Office Add-in](#sideload-the-office-add-in).

## Table of contents

* [Introduction](#introduction)
* [Prerequisites](#prerequisites)
* [Provision the Office Add-in](#provision-the-office-add-in)
* [Sideload the Office Add-in](#sideload-the-office-add-in)
* [Develop the Office Add-in](#develop-the-office-add-in)
* [Questions and comments](#questions-and-comments)
* [Contributing](#contributing)
* [Additional resources](#additional-resources)

## Introduction

This sample shows how to build and Office Add-in using React with TypeScript. In addition to Office.js, the sample uses the Office Fabric UI for styling and formatting the user experience.

## Prerequisites

To complete this lab, you need the following:

* Consumer [OneDrive](https://www.onedrive.com) account. OneDrive is used to test the Office Add-in  (via Office Online).
* A lightweight code editor such as [Visual Studio Code](https://code.visualstudio.com/) for developing the solution.
* [Node.js](https://nodejs.org/). Node is required to setup, build, and run the project. Node 6.9.0 or higher, together with NPM 3 or higher are recommended.
* [The Office Yeoman Generator](https://www.npmjs.com/package/generator-office). The Office Yeoman Generator is used to create the Office Add-in xml manifest file.

```shell
npm install -g yo generator-office
```

## Provision the Office Add-in

In this section you will use the Office Yeoman generator and Node Package Manager (npm) to provision and configure the Office Add-in project.

1. Open a terminal/command prompt, and change directories to the location where you want the project provisioned.

1. Run the **Office Yeoman generator** using the command "**yo office**".

    ```shell
    yo office
    ```

1. The Office Yeoman generator will ask a number of question. Use the following responses:
    * Would you like to create a new subfolder for your project? **Yes**
    * What do you want to name your add-in? **Excel Portfolio**
    * Which Office client application would you like to support? **Excel**
    * Would you like to create a new add-in? **Yes, I need to create a new web app and manifest for my add-in.**
    * Would you like to use TypeScript? **Yes**
    * Choose a framework **React**
    * For more information and resources on your next steps, we have created a resource.html file in your project. Would you like to open it now while we finish creating your project? **No**

    ![Office Yeoman Generator](./README_assets/Yeoman.png)

1. When then Yeoman generator completes, change directories to the project folder (ex: **cd excel-portfolio**) and open the folder in your favorite code editor (you can use the command "**code .**" for [Visual Studio Code](https://code.visualstudio.com/)).

## Sideload the Office Add-in

In this section you will sideload the Office Add-in using OneDrive and Office Online.

>**NOTE**: The instructions below outline how to sideload an Office Add-in into Office Online, which works in almost any developer environment. If you are working from a PC, you can also sideload the add-in for testing in the full Win32 Office client. For more information on this approach, see the [Sideloading Office Add-ins into Office Desktop or Office Online](https://www.youtube.com/watch?v=XXsAw2UUiQo).

>**NOTE**: Office Add-ins are required to be secured by SSL. These labs leverage self-signed certificates for this that may be blocked by your browser as an untrusted certificate. If so, follow the steps for [Adding Self-Signed Certificates as Trusted Root Certificate](https://github.com/OfficeDev/generator-office/blob/master/src/docs/ssl.md).

1. Open a terminal/command prompt in the location where the project is provisioned.

1. Run the "**npm run start**" command, which will build and host the solution. This command is setup to perform a lot of complex tasks, including compiling all the TypeScript files to JavaScript, using Webpack to combine them into a single script reference, and copying all relevant files to a dist folder for hosting. When the build completes, you should see a note that "*webpack: Compiled successfully*". The TypeScript compiler will also stay in a "watch mode", which will immediately re-compile and refresh the solution when code changes are made. If you need to exit "watch mode", use the Ctrl-C command.

1. Navigate and sign-in to OneDrive ([https://www.onedrive.com](https://www.onedrive.com)). OneDrive offers free consumer accounts, so if you don't have one you can create one.

1. From the OneDrive toolbar, select **New** and then select **Excel workbook** to create a new Excel workbook.

    ![Creating new workbook in OneDrive](./README_assets/NewWorkbook.png)

1. Once the new Excel workbook opens, select the Insert tab and then click on the Office Add-ins button in the ribbon.

    ![Office Add-ins command in the Insert ribbon](./README_assets/AddinCommand.png)

1. In the Office Add-in dialog, click on the Manage My Add-ins link in the top right and then select Upload My Add-in.

    ![Manage My Add-ins](./README_assets/ManageAddins.png)

1. Using the file selector of the Upload Add-in dialog, browse to the add-in manifest in the root directory of your project (ex: excel-portfolio-manifest.xml) and click Upload.

    ![Upload the manifest](./README_assets/UploadManifest.png)

1. Uploading the add-in manifest should add a new ribbon button for launching your add-in. Look for the **Show Taskpane** button on the far right of the Home tab.

    ![Show taskpane command in ribbon](./README_assets/ShowTaskpaneCommand.png)

1. Click on the **Show Taskpane** button to bring up your Office Add-in in a task pane. It should say "Welcome to app!" with an Angular logo below it.

    ![Add-in after initially loading](./README_assets/AddinInit.png)

1. Locate the **src/components/app.tsx** file and modify the value of the **message** attribute on line 55 from "Welcome" to "Hello World".

    ````html
    <Header logo='assets/logo-filled.png' title={this.props.title} message='Hello World' /></pre>
    ````

1. Save the file and immediately go back to Excel Online. Notice how the TypeScript was re-compiled and the add-in automatically refreshed.

    ![Add-in after making change to message](./README_assets/AddinInitWatch.png)

## Develop the Office Add-in

In this section, you will finish developing the Office Add-in using React and TypeScript. The add-in will allow the user to get real-time stock quotes and manage a portfolio in an Excel table. Users will have the ability to add, delete, and refresh stocks. Additionally, the add-in should check for an existing portfolio upon opening and (if found) read the stocks out of the worksheet.

1. Open **src/assets/styles/global.scss** and add the following styles to the end of the file.

    ````css
    .container {
        .overlay {
            position: absolute;
            top: 0px;
            bottom: 0px;
            left: 0px;
            right: 0px;
            z-index: 1000;
            display: block;
            .spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -20px;
                margin-left: -20px;
                z-index: 1100;
            }
        }
        .header {
            padding-left: 10px;
        }
        .ms-MessageBar-content {
            padding: 2px !important;
        }
        .pct100 {
            width: 100%;
            float: left;
        }
        .padding10 {
            padding: 10px;
        }
        .right {
            float: right;
        }
        .left {
            float: left;
        }
        .icon {
            padding-left: 8px;
            cursor: pointer;
        }
        .itemRow {
            padding-top: 4px;
            padding-bottom: 4px;
        }
        .itemRow:hover {
            background-color: #eeeeee;
        }
        .tbl-head {
            margin-bottom: 5px;
        }
    }
    ````

1. The project template that the Office Yeoman generator created includes a number of React components that need to be updated or deleted. Start by deleting the **src/components/hero-list.tsx** file.

1. Next, open the **src/components/header.tsx** file and modify it as seen below.

    ````typescript
    import * as React from 'react';

    export interface HeaderProps {
        title: string;
    }

    export class Header extends React.Component<HeaderProps, any> {
        constructor(props, context) {
            super(props, context);
        }

        render() {
            return (
                <div className="ms-bgColor-greenDark header">
                    <span className="ms-font-su ms-fontColor-white">{this.props.title}</span>
                </div>
            );
        };
    };
    ````

1. Next, create a new React component named **waiting** at **src/components/waiting.tsx** with the code shown below. Notice this component uses the Office UI Fabric React Components for **Overlay** and **Spinner**.

    ````typescript
    import * as React from "react";
    import { Overlay, Spinner, SpinnerSize } from "office-ui-fabric-react";

    export class Waiting extends React.Component<any, any> {
        constructor(props, context) {
            super(props, context);
        }

        render() {
            return (
                <Overlay isDarkThemed={ true } className="overlay">
                    <div className="spinner"> 
                        <Spinner size={SpinnerSize.large} />        
                    </div>
                </Overlay>
            );
        };
    };
    ````

1. Create a new React component named **stock-item** at **src/components/stock-item.tsx** with the code shown below. This component will display a stock with commands for refresh and delete. The component has properties for stock symbol, its index in the list, and the handlers for refresh and delete.

    ````typescript
    import * as React from 'react';

    export interface StockItemProps {
        symbol: string;
        index: number;
        onDelete: any;
        onRefresh: any;
    }

    export class StockItem extends React.Component<StockItemProps, any> {
        constructor(props, context) {
            super(props, context);
        }

        render() {
            return (
                <div className="pct100 itemRow">
                    <div className="left">{this.props.symbol}</div>
                    <div className="right">
                        <div className="left icon"><i className="ms-Icon ms-Icon--Refresh" aria-hidden="true" onClick={this.props.onRefresh}></i></div>
                        <div className="left icon"><i className="ms-Icon ms-Icon--Delete" aria-hidden="true" onClick={this.props.onDelete}></i></div>
                    </div>
                </div>
            );
        };
    };
    ````

1. Finally, open up **src/components/app.tsx** and update it as seen below. Keep it open, as you will make a number of additional updates to this file before the end of this exercise.

    ````typescript
    import * as React from 'react';
    import { TextField, MessageBar, MessageBarType } from 'office-ui-fabric-react';
    import { Header } from './header';
    import { Waiting } from './waiting';
    import { StockItem } from './stock-item';

    export interface AppProps {
        title: string;
    }

    export interface AppState {
        listItems: string[];
        waiting: boolean;
        error: string;
    }

    export class App extends React.Component<AppProps, AppState> {
        constructor(props, context) {
            super(props, context);
            this.state = {
                listItems: [],      
                waiting: false,
                error: ""
            };

            // Sync stocks already in Excel table
            this.syncTable().then(() => {});
        }

        // Adds symbol
        addSymbol = async (event) => {
            //TODO
            console.log(event);
        }

        // Delete symbol
        deleteSymbol = async (index) => {
            //TODO
            console.log(index);
        }

        // Refresh symbol
        refreshSymbol = async (index:number) => {
            //TODO
            console.log(index);
        }

        // Reads symbols from an existing Excel workbook and pre-populates them in the add-in
        syncTable = async () => {
            //TODO
            console.log("sync");
        }

        // Gets a quote by calling into the stock service
        getQuote = async (symbol:string) => {
            //TODO
            console.log(symbol);
        }

        render() {
            const stocks = this.state.listItems.map((symbol, index) => (
                <StockItem symbol={symbol} index={index} onDelete={this.deleteSymbol.bind(this, index)} onRefresh={this.refreshSymbol.bind(this, index)} />
            ));
            return (
                <div className='container'>
                    { this.state.waiting && 
                        <Waiting />
                    }
                    <Header title={this.props.title} />
                    { (this.state.error != "") &&
                        <MessageBar messageBarType={MessageBarType.error} isMultiline={false} onDismiss={ () => {this.setState({error: ""})} }>{this.state.error}</MessageBar>
                    }
                    <div className="padding10">
                        <div className="pct100 tbl-head">
                            <span className="ms-font-l">Stock Symbols</span>
                        </div>
                        <div className="pct100">
                            <TextField ref="newSymbol" onKeyPress={this.addSymbol.bind(this)} placeholder="Enter a stock symbol (ex: MSFT)" />
                        </div>
                        {stocks}
                    </div>
                </div>
            );
        };
    };
    ````

1. Although the app's functionality isn't complete, the visual markup is. You can see it by saving all your work and returning to Office Online. It should look similar to below. If you previously closed the Excel Online window or if your Office Online session has expired (the add-in doesn't seem to load), follow the [Sideload the Office Add-in](#sideload-the-office-add-in) steps above.

    ![Add-in with visual markup complete](./README_assets/AddinVisual.png)

1. The **app.tsx** file has a number of placeholder functions that you will complete to get the add-in functioning. Start by locating the **getQuote** function. This function calls a REST API to get real-time stock statistics on a specific stock symbol. Update it as seen below.

    ````typescript
    // Gets a quote by calling into the stock service
    getQuote = async (symbol:string) => {
        return new Promise((resolve, reject) => {
            let url = `https://estx.azurewebsites.net/api/quote/${symbol}`;
            fetch(url).then((res) => {
                if (res.ok)
                    resolve(res.json());
                else
                    reject("Error getting quote");
            });
        });
    }
    ````

1. Next, create new **utils** folder under **src** and then create a file named **excelTableUtil.ts** in it (**src/utils/excelTableUtil.ts**). This TypeScript class will contain helper functions for working with Excel tables with office.js. Notice the **ExcelTableUtil** constructor accepts details about the Excel table, including the name, location, and header details.

    ````typescript
    /// <reference path="../../node_modules/@types/office-js/index.d.ts" />

    export class ExcelTableUtil {
        tableName:string;
        location:string;
        headers:string[];
        constructor(tableName:string, location:string, headers:string[]) {
            this.tableName = tableName;
            this.location = location;
            this.headers = headers;
        }

        // ExcelTableUtil functions here
    }
    ````

1. Return to **src/components/app.tsx** and add a import reference to the **ExcelTableUtil** class we just created and create a private property inside the App class.

    ````typescript
    import * as React from 'react';
    import { TextField, MessageBar, MessageBarType } from 'office-ui-fabric-react';
    import { Header } from './header';
    import { Waiting } from './waiting';
    import { StockItem } from './stock-item';
    import { ExcelTableUtil } from '../utils/excelTableUtil';

    /* lines omitted for readability */

    export class App extends React.Component<AppProps, AppState> {
        tableUtil:ExcelTableUtil = new ExcelTableUtil("Portfolio", 
            "A1:J1", [
                "Symbol", "Last Price", 
                "Change $", "Change %", 
                "Quantity", "Price Paid" ,
                "Day's Gain $", "Total Gain $", 
                "Total Gain %", "Value"
            ]);
        constructor(props, context) {
            /* lines omitted for readability */
    ````

1. Next, add functions to **src/utils/excelTableUtil.ts** for **createTable** and **ensureTable**. These functions will be used to get a handle to the Excel table (and create it if it doesn't exist).

    ````typescript
    // Create the StocksTable and defines the header row
    createTable = async () => {
        return new Promise(async (resolve, reject) => {
            await Excel.run(async (context) => {
                // Create a proxy object for the active worksheet and create the table
                var sheet = context.workbook.worksheets.getActiveWorksheet();
                var tableRef = sheet.tables.add(this.location, true);
                tableRef.name = this.tableName;
                tableRef.getHeaderRowRange().values = [this.headers];
                return context.sync().then(() => {
                    resolve(tableRef);
                });
            }).catch((createError) => {
                reject(createError);
            });
        });
    }

    // Ensures the Excel table is created
    ensureTable = async (forceCreate:boolean) => {
        return new Promise(async (resolve, reject) => {
            await Excel.run(async (context) => {
                // Create a proxy object for the active worksheet and try getting table reference
                var sheet = context.workbook.worksheets.getActiveWorksheet();
                var tableRef = sheet.tables.getItem(this.tableName);
                return context.sync().then(() => {
                    resolve(tableRef);
                });
            }).catch(() => {
                if (forceCreate) {
                    // Unable to find table...create it
                    this.createTable().then(async (tableRef) => {
                        resolve(tableRef);
                    }, (createError) => {
                        reject(createError);
                    });
                }
                else
                    resolve(null);
            });
        });
    }
    ````

1. Next, add the **addRow** function to **src/utils/excelTableUtil.cs**. Notice that it call the ensureTable function we just created to ensure the Excel table has been created.

    ````typescript
    // Appends a row to the table
    addRow = async (data) => {
        return new Promise(async (resolve, reject) => { 
            this.ensureTable(true).then(async (tableRef:Excel.Table) => {
                await Excel.run(async (context) => {
                    var sheet = context.workbook.worksheets.getActiveWorksheet();
                    // Add the new row
                    tableRef.rows.add(null, [data]);
                    // Autofit columns and rows if supported by API
                    if (Office.context.requirements.isSetSupported("ExcelApi", 1.2)) {
                        sheet.getUsedRange().format.autofitColumns();
                        sheet.getUsedRange().format.autofitRows();
                    }
                    sheet.activate();
                    return context.sync().then(() => {
                        resolve();
                    });
                }).catch((err) => {
                    reject(err);
                });
            }, (err) => {
                reject(err);
            });
        });
    }
    ````

1. Return to **src/components/app.tsx** and update the **addSymbol** function to call **getSymbol** for stock stats and then call **addRow** on the **ExcelTableUtil**. Notice the row data contains formulas.

    ````typescript
    // Adds symbol
    addSymbol = async (event) => {
        if (event.key == 'Enter') {
            let element = this.refs.newSymbol as TextField; 
            let symbol = element.value.toUpperCase();

            // Get quote and add to Excel table
            this.setState({ waiting: true });
            this.getQuote(symbol).then((res:any) => {
                let data = [
                    res.symbol, //Symbol
                    res.current, //Last Price
                    res.curr_change, //Change $
                    res.pct_change * 100, //Change %
                    0, //Quantity (user provided)
                    0, //Price Paid (user provided)
                    "=C:C * E:E", //Day's Gain $
                    "=(B:B * E:E) - (F:F * E:E)", //Total Gain $
                    "=H:H / (F:F * E:E) * 100", //Total Gain %
                    "=B:B * E:E" //Value
                ];
                this.tableUtil.addRow(data).then(() => {
                    let symbols = this.state.listItems;
                    symbols.unshift(element.state.value.toUpperCase());
                    this.setState({ listItems: symbols });
                    element.setState({ value: "" });
                    this.setState({waiting: false});
                }, (err) => {
                    this.setState({error: err});
                    this.setState({waiting: false});
                });
            }, (err) => {
                this.setState({error: err});
                this.setState({waiting: false});
            });
        }
    }
    ````

    >**Optional**: this is a good time to test the "add symbol" function of your add-in

1. Return to **/src/utils/excelTableUtil.ts** and add functions for **getColumnData** and **deleteRow**. getColumnData gets values for a column in the Excel table so a row can be identified for update or delete. deleteRow deletes a row in the Excel table based on it's index.

    ````typescript
    // Gets data for a specific named column
    getColumnData = async (column:string) => {
        return new Promise(async (resolve, reject) => { 
            this.ensureTable(false).then(async (tableRef:Excel.Table) => {
                if (tableRef == null)
                    resolve([]);
                else {
                    await Excel.run(async (context) => {
                        // Get column range by column name
                        var colRange = tableRef.columns.getItem(column).getDataBodyRange().load("values");
                        // Sync to populate proxy objects with data from Excel
                        return context.sync().then(async () => {
                            let data:string[] = [];
                            for (var i = 0; i < colRange.values.length; i++) {
                                data.push(colRange.values[i].toString());
                            }
                            resolve(data);
                        });
                    }).catch((err) => {
                        reject(err);
                    });
                }
            }, (err) => {
                reject(err);
            });
        });
    }

    // Deletes a column based by row index
    deleteRow = async (index:number) => {
        return new Promise(async (resolve, reject) => { 
            this.ensureTable(true).then(async (tableRef:Excel.Table) => {
                await Excel.run(async (context) => {
                    var range = tableRef.rows.getItemAt(index).getRange();
                    range.delete(Excel.DeleteShiftDirection.up);
                    return context.sync().then(async () => {
                        resolve();
                    });
                }).catch((err) => {
                    reject(err);
                });
            }, (err) => {
                reject(err);
            });
        });
    }
    ````

1. Return to **src/components/app.tsx** and update the **deleteSymbol** function to delete the specified symbol from the Excel table. Do this by first calling **getColumnData** (on **ExcelTableUtil**) to determine the row to delete and then **deleteRow** (also on **ExcelTableUtil**) to perform the delete.

    ````typescript
    // Delete symbol
    deleteSymbol = async (index) => {
        // Delete from Excel table by index number
        let symbols = this.state.listItems;
        let symbol = symbols[index];
        this.setState({ waiting: true });
        this.tableUtil.getColumnData("Symbol").then(async (columnData:string[]) => {
            // make sure the symbol was found in the Excel table
            if (columnData.indexOf(symbol) != -1) {
                this.tableUtil.deleteRow(columnData.indexOf(symbol)).then(async () => {
                    symbols.splice(index, 1);
                    this.setState({ listItems: symbols });
                    this.setState({waiting: false});
                }, (err) => {
                    this.setState({error: err});
                    this.setState({waiting: false});
                });
            }
            else {
                symbols.splice(index, 1);
                this.setState({waiting: false});
            }
        }, (err) => {
            this.setState({error: err});
            this.setState({waiting: false});
        });
    }
    ````

    >**Optional**: this is a good time to test the "delete symbol" function of your add-in

1. Make the final update to **src/utils/excelTableUtil.ts** by adding the **updateCell** function, which updates the cell at a specific address to a specified value.

    ````typescript
    // Updates a specific cell in the table
    updateCell = async (address:string, value:any) => {
        return new Promise(async (resolve, reject) => { 
            this.ensureTable(true).then(async () => {
                await Excel.run(async (context) => {
                    var sheet = context.workbook.worksheets.getActiveWorksheet();
                    var range = sheet.getRange(address);
                    range.values = [[value]];
                    return context.sync().then(async () => {
                        resolve();
                    });
                }).catch((err) => {
                    reject(err);
                });
            }, (err) => {
                reject(err);
            });
        });
    }
    ````

1. Next, update the **refreshSymbol** function on **src/components/app.tsx** to call **getQuote** for updated stock statistics and then update the last trade cell in the Excel table. Similar to deleteSymbol, this function will call **getColumnData** to determine the cell address before calling **updateCell**.

    ````typescript
    // Refresh symbol
    refreshSymbol = async (index:number) => {
        // Refresh stock quote and update Excel table
        let symbols = this.state.listItems;
        let symbol = symbols[index];
        this.setState({ waiting: true });
        this.tableUtil.getColumnData("Symbol").then(async (columnData:string[]) => {
            // make sure the symbol was found in the Excel table
            var rowIndex = columnData.indexOf(symbol);
            if (rowIndex != -1) {
                this.getQuote(symbol).then((res:any) => {
                    // "last trade" is in column B with a row index offset of 2 (row 0 + the header row)
                    this.tableUtil.updateCell(`B${rowIndex + 2}:B${rowIndex + 2}`, res.current).then(async () => {
                        this.setState({ waiting: false });
                    }, (err) => {
                        this.setState({error: err});
                        this.setState({ waiting: false });
                    });
                });
            }
            else {
                this.setState({error: "Symbol not in table"});
                symbols.splice(index, 1);
                this.setState({ waiting: false });
            }
        }, (err) => {
            this.setState({error: err});
            this.setState({ waiting: false });
        });
    }
    ````

    >**Optional**: this is a good time to test the "refresh symbol" function of your add-in

1. Finally, update the **syncTable** function, which is called when the add-in is launched (in the constructor of app.tsx) to pull in any stock symbols that might already exist in the worksheet. It calls **getColumnData** to get this data.

    ````typescript
    // Reads symbols from an existing Excel workbook and pre-populates them in the add-in
    syncTable = async () => {
        this.setState({ waiting: true });
        this.tableUtil.getColumnData("Symbol").then(async (columnData:string[]) => {
            this.setState({ listItems: columnData });
            this.setState({ waiting: false });
        }, (err) => {
            this.setState({error: err});
            this.setState({ waiting: false });
        });
    }
    ````

1. Test your work by returning to Excel Online. If you previously closed the Excel Online window or if your Office Online session has expired (the add-in doesn't seem to load), follow the [Sideload the Office Add-in](#sideload-the-office-add-in) steps above. You should test all the different operations you created:
    * Add a symbol by typing the symbol and pressing enter/return
    * Refresh a symbol (helps to clear out the **Last Price** cell when outside trading hours)
    * Delete a symbol
    * Reload the add-in with an existing portfolio table and see if the add-in pulls in the symbols

    ![Testing the add-in](./README_assets/ExcelPortfolio.gif)