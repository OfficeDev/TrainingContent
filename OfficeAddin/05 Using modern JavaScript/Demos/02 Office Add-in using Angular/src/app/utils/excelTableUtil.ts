export class ExcelTableUtil {
  tableName: string;
  location: string;
  headers: string[];
  constructor(tableName: string, location: string, headers: string[]) {
    this.tableName = tableName;
    this.location = location;
    this.headers = headers;
  }

  // Create the StocksTable and defines the header row
  createTable = async () => {
    return new Promise(async (resolve, reject) => {
      await Excel.run(async context => {
        // Create a proxy object for the active worksheet and create the table
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const tableRef = sheet.tables.add(this.location, true);
        tableRef.name = this.tableName;
        tableRef.getHeaderRowRange().values = [this.headers];
        return context.sync().then(() => {
          resolve(tableRef);
        });
      }).catch(createError => {
        reject(createError);
      });
    });
  }

  // Ensures the Excel table is created and tries to get a table reference
  ensureTable = async (forceCreate: boolean) => {
    return new Promise(async (resolve, reject) => {
      await Excel.run(async context => {
        // Create a proxy object for the active worksheet and try getting table reference
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const tableRef = sheet.tables.getItem(this.tableName);
        return context.sync().then(() => {
          resolve(tableRef);
        });
      }).catch(() => {
        if (forceCreate) {
          // Create a new table because an existing table was not found.
          this.createTable().then(
            async tableRef => {
              resolve(tableRef);
            },
            createError => {
              reject(createError);
            }
          );
        } else {
          resolve(null);
        }
      });
    });
  }

  // Appends a row to the table
  addRow = async (data) => {
    return new Promise(async (resolve, reject) => {
      this.ensureTable(true).then(
        async (tableRef: Excel.Table) => {
          await Excel.run(async (context) => {
            const sheet = context.workbook.worksheets.getActiveWorksheet();
            // Add the new row
            tableRef = sheet.tables.getItem(this.tableName);
            tableRef.rows.add(null, [data]);
            // Autofit columns and rows if your Office version supports the API.
            if (Office.context.requirements.isSetSupported('ExcelApi', 1.2)) {
              sheet.getUsedRange().format.autofitColumns();
              sheet.getUsedRange().format.autofitRows();
            }
            sheet.activate();
            return context.sync().then(() => {
              resolve();
            });
          }).catch(err => {
            reject(err);
          });
        },
        err => {
          reject(err);
        }
      );
    });
  }

  // Gets data for a specific named column
  getColumnData = async (column: string) => {
    return new Promise(async (resolve, reject) => {
      this.ensureTable(false).then(
        async (tableRef: Excel.Table) => {
          if (tableRef == null) {
            resolve([]);
          } else {
            await Excel.run(async context => {
              // Get column range by column name
              const colRange = tableRef.columns
                .getItem(column)
                .getDataBodyRange()
                .load('values');
              // Sync to populate proxy objects with data from Excel
              return context.sync().then(async () => {
                let data: string[] = [];
                for (let i = 0; i < colRange.values.length; i++) {
                  data.push(colRange.values[i].toString());
                }
                resolve(data);
              });
            }).catch(err => {
              reject(err);
            });
          }
        },
        err => {
          reject(err);
        }
      );
    });
  }

  // Deletes a column based by row index
  deleteRow = async (index: number) => {
    return new Promise(async (resolve, reject) => {
      this.ensureTable(true).then(
        async (tableRef: Excel.Table) => {
          await Excel.run(async context => {
            const range = tableRef.rows.getItemAt(index).getRange();
            range.delete(Excel.DeleteShiftDirection.up);
            return context.sync().then(async () => {
              resolve();
            });
          }).catch(err => {
            reject(err);
          });
        },
        err => {
          reject(err);
        }
      );
    });
  }

  // Updates a specific cell in the table
  updateCell = async (address: string, value: any) => {
    return new Promise(async (resolve, reject) => {
      this.ensureTable(true).then(
        async () => {
          await Excel.run(async context => {
            const sheet = context.workbook.worksheets.getActiveWorksheet();
            const range = sheet.getRange(address);
            range.values = [[value]];
            return context.sync().then(async () => {
              resolve();
            });
          }).catch(err => {
            reject(err);
          });
        },
        err => {
          reject(err);
        }
      );
    });
  }

}
