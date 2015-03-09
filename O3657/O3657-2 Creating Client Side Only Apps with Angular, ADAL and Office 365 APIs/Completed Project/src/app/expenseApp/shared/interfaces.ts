///<reference path="../../../../tools/typings/tsd.d.ts" />

module expenseApp.shared {

    export interface IExpenseManager {
        baseSPUrl: string;
    }

    export interface IAadEndpoints {

    }

    export interface IAdalSettings {
        tenant: string;
        clientId: string;
        baseSPUrl: string;
        baseOneDriveUrl: string;
        aadEndpoints: IAadEndpoints;
    }

    export interface IState {
        title: string;
    }

    export interface IHttpDataResponse extends ng.IHttpPromiseCallbackArg<any> {
       data: any;
    }

    export interface IHttpDataDResponse extends ng.IHttpPromiseCallbackArg<any> {
       d: any;
    }

    export interface IEmployee {
        id?: number;
        firstName?: string;
        lastName?: string;
        address?: string;
        city?: string;
        state?: string;
        zip?: any;
        email?: string;
        gender?: number;
        expenses?: any;
        __metadata?: any;
    }

    export interface IExpense {
      id?: number;
      title?: string;
      amount?: number;
      expenseCategory?: string;
      receipt?: string;
      __metadata?: any;
    }

    export interface IReceipt {
      id?: string;
      name?: string;
      webUrl?: string;
    }

    export interface IHttpPromiseCallbackErrorArg extends ng.IHttpPromiseCallbackArg<any> {
         message: string;
    }

}
