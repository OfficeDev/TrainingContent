/// <reference path="../../node_modules/@types/office-js/index.d.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var ExcelTableUtil = /** @class */ (function () {
    function ExcelTableUtil(tableName, location, headers) {
        var _this = this;
        // Create the StocksTable and defines the header row
        this.createTable = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Excel.run(function (context) { return __awaiter(_this, void 0, void 0, function () {
                                        var sheet, tableRef;
                                        return __generator(this, function (_a) {
                                            sheet = context.workbook.worksheets.getActiveWorksheet();
                                            tableRef = sheet.tables.add(this.location, true);
                                            tableRef.name = this.tableName;
                                            tableRef.getHeaderRowRange().values = [this.headers];
                                            return [2 /*return*/, context.sync().then(function () {
                                                    resolve(tableRef);
                                                })];
                                        });
                                    }); }).catch(function (createError) {
                                        reject(createError);
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); };
        // Ensures the Excel table is created
        this.ensureTable = function (forceCreate) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Excel.run(function (context) { return __awaiter(_this, void 0, void 0, function () {
                                        var sheet, tableRef;
                                        return __generator(this, function (_a) {
                                            sheet = context.workbook.worksheets.getActiveWorksheet();
                                            tableRef = sheet.tables.getItem(this.tableName);
                                            return [2 /*return*/, context.sync().then(function () {
                                                    resolve(tableRef);
                                                })];
                                        });
                                    }); }).catch(function () {
                                        if (forceCreate) {
                                            // Unable to find table...create it
                                            _this.createTable().then(function (tableRef) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    resolve(tableRef);
                                                    return [2 /*return*/];
                                                });
                                            }); }, function (createError) {
                                                reject(createError);
                                            });
                                        }
                                        else
                                            resolve(null);
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); };
        // Appends a row to the table
        this.addRow = function (data) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            this.ensureTable(true).then(function (tableRef) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Excel.run(function (context) { return __awaiter(_this, void 0, void 0, function () {
                                                var sheet;
                                                return __generator(this, function (_a) {
                                                    sheet = context.workbook.worksheets.getActiveWorksheet();
                                                    // Add the new row
                                                    tableRef.rows.add(null, [data]);
                                                    // Autofit columns and rows if supported by API
                                                    if (Office.context.requirements.isSetSupported("ExcelApi", 1.2)) {
                                                        sheet.getUsedRange().format.autofitColumns();
                                                        sheet.getUsedRange().format.autofitRows();
                                                    }
                                                    sheet.activate();
                                                    return [2 /*return*/, context.sync().then(function () {
                                                            resolve();
                                                        })];
                                                });
                                            }); }).catch(function (err) {
                                                reject(err);
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, function (err) {
                                reject(err);
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        }); };
        // Gets data for a specific named column
        this.getColumnData = function (column) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            this.ensureTable(false).then(function (tableRef) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(tableRef == null)) return [3 /*break*/, 1];
                                            resolve([]);
                                            return [3 /*break*/, 3];
                                        case 1: return [4 /*yield*/, Excel.run(function (context) { return __awaiter(_this, void 0, void 0, function () {
                                                var _this = this;
                                                var colRange;
                                                return __generator(this, function (_a) {
                                                    colRange = tableRef.columns.getItem(column).getDataBodyRange().load("values");
                                                    // Sync to populate proxy objects with data from Excel
                                                    return [2 /*return*/, context.sync().then(function () { return __awaiter(_this, void 0, void 0, function () {
                                                            var data, i;
                                                            return __generator(this, function (_a) {
                                                                data = [];
                                                                for (i = 0; i < colRange.values.length; i++) {
                                                                    data.push(colRange.values[i].toString());
                                                                }
                                                                resolve(data);
                                                                return [2 /*return*/];
                                                            });
                                                        }); })];
                                                });
                                            }); }).catch(function (err) {
                                                reject(err);
                                            })];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, function (err) {
                                reject(err);
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        }); };
        // Deletes a column based by row index
        this.deleteRow = function (index) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            this.ensureTable(true).then(function (tableRef) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Excel.run(function (context) { return __awaiter(_this, void 0, void 0, function () {
                                                var _this = this;
                                                var range;
                                                return __generator(this, function (_a) {
                                                    range = tableRef.rows.getItemAt(index).getRange();
                                                    range.delete(Excel.DeleteShiftDirection.up);
                                                    return [2 /*return*/, context.sync().then(function () { return __awaiter(_this, void 0, void 0, function () {
                                                            return __generator(this, function (_a) {
                                                                resolve();
                                                                return [2 /*return*/];
                                                            });
                                                        }); })];
                                                });
                                            }); }).catch(function (err) {
                                                reject(err);
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, function (err) {
                                reject(err);
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        }); };
        // Updates a specific cell in the table
        this.updateCell = function (address, value) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            this.ensureTable(true).then(function () { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Excel.run(function (context) { return __awaiter(_this, void 0, void 0, function () {
                                                var _this = this;
                                                var sheet, range;
                                                return __generator(this, function (_a) {
                                                    sheet = context.workbook.worksheets.getActiveWorksheet();
                                                    range = sheet.getRange(address);
                                                    range.values = [[value]];
                                                    return [2 /*return*/, context.sync().then(function () { return __awaiter(_this, void 0, void 0, function () {
                                                            return __generator(this, function (_a) {
                                                                resolve();
                                                                return [2 /*return*/];
                                                            });
                                                        }); })];
                                                });
                                            }); }).catch(function (err) {
                                                reject(err);
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, function (err) {
                                reject(err);
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        }); };
        this.tableName = tableName;
        this.location = location;
        this.headers = headers;
    }
    return ExcelTableUtil;
}());
export { ExcelTableUtil };
//# sourceMappingURL=excelTableUtil.js.map