import * as ko from 'knockout';
import styles from './HelloWorldKnockout.module.scss';
import { IHelloWorldKnockoutWebPartProps } from './IHelloWorldKnockoutWebPartProps';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IHelloWorldKnockoutBindingContext extends IHelloWorldKnockoutWebPartProps {
  shouter: KnockoutSubscribable<{}>;
  context: IWebPartContext;
}

export interface IlistItems {
  value: IlistItem[];
}

export interface IlistItem {
  Id: number;
  Title: string;
}

export default class HelloWorldKnockoutViewModel {
  private _context: IWebPartContext;
  private _listName: string = "Test";
  private _listItemEntityTypeFullName: string;

  public description: KnockoutObservable<string> = ko.observable('');

  public labelClass: string = styles.label;
  public helloWorldClass: string = styles.helloWorld;
  public containerClass: string = styles.container;
  public rowClass: string = `ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`;
  public buttonClass: string = `ms-Button ${styles.button}`;

  public listName: KnockoutObservable<string> = ko.observable(this._listName);
  public listItems: KnockoutObservableArray<IlistItem> = ko.observableArray([]);
  public isAdding: KnockoutObservable<boolean> = ko.observable(false);
  public hasError: KnockoutObservable<boolean> = ko.observable(false);
  public message: KnockoutObservable<string> = ko.observable('');
  public newItemTitle: KnockoutObservable<string> = ko.observable('');

  constructor(bindings: IHelloWorldKnockoutBindingContext) {
    this.description(bindings.description);

    // When web part description is updated, change this view model's description.
    bindings.shouter.subscribe((value: string) => {
      this.description(value);
    }, this, 'description');

    this._context = bindings.context;
    this._getListItems()
      .then((data: IlistItems) => {
        this.listItems(data.value);
      });
  }

  private _getListItemEntityTypeFullName(): Promise<string> {
    if (this._listItemEntityTypeFullName) {
      return Promise.resolve(this._listItemEntityTypeFullName);
    }

    return this._context.spHttpClient.get(this._context.pageContext["web"]["absoluteUrl"]
      + `/_api/web/lists/GetByTitle('${this._listName}')`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((value) => {
        this._listItemEntityTypeFullName = value["ListItemEntityTypeFullName"];
        return this._listItemEntityTypeFullName;
      });
  }

  private _getListItems(): Promise<IlistItems> {
    return this._context.spHttpClient.get(this._context.pageContext["web"]["absoluteUrl"]
      + `/_api/web/lists/GetByTitle('${this._listName}')/items?$select=Id,Title`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse): Promise<any> => {
        return response.json();
      })
      .then((data: any): IlistItems => {
        this.message("Load succeeded");
        this.hasError(false);
        const listData: IlistItems = { value: data["value"] };
        return listData;
      },
      (error: any) => {
        this.message("Load failed");
        this.hasError(true);
      }) as Promise<IlistItems>;
  }

  public showAddNew = (show: boolean): void => {
    this.isAdding(show);
    if (!show) {
      this.newItemTitle("");
    }
  }

  public addListItem = (): void => {
    this._getListItemEntityTypeFullName()
      .then((listItemEntityTypeFullName: string) => {
        const newItemTitle: string = this.newItemTitle();
        const reqJSON: any = {
          "@odata.type": this._listItemEntityTypeFullName,
          "Title": newItemTitle
        };

        this._context.spHttpClient.post(
          this._context.pageContext["web"]["absoluteUrl"] +
          `/_api/web/lists/GetByTitle('${this._listName}')/items`,
          SPHttpClient.configurations.v1,
          {
            body: JSON.stringify(reqJSON),
            headers: {
              "accept": "application/json",
              "content-type": "application/json"
            }
          })
          .then((response: SPHttpClientResponse): Promise<any> => {
            return response.json();
          })
          .then((data: any) => {
            this.listItems.push({ Id: data["Id"], Title: newItemTitle });
            this.newItemTitle("");
            this.message("Add succeeded");
            this.hasError(false);
          },
          (error: any) => {
            this.message("Add failed");
            this.hasError(true);
          });
      });
  }

  public updateListItem = (item: IlistItem): void => {
    this._getListItemEntityTypeFullName()
      .then((listItemEntityTypeFullName: string) => {
        const reqJSON: any = {
          "@odata.type": this._listItemEntityTypeFullName,
          "Title": item.Title
        };

        this._context.spHttpClient.post(
          this._context.pageContext["web"]["absoluteUrl"] +
          `/_api/web/lists/GetByTitle('${this._listName}')/items(${item.Id})`,
          SPHttpClient.configurations.v1,
          {
            body: JSON.stringify(reqJSON),
            headers: {
              "IF-MATCH": "*",
              "X-HTTP-Method": "MERGE",
              "accept": "application/json",
              "content-type": "application/json"
            }
          })
          .then(() => {
            this.message("Update succeeded");
            this.hasError(false);
          },
          (error: any) => {
            this.message("Update failed");
            this.hasError(true);
          });
      });
  }

  public removeListItem = (item: IlistItem): void => {
    this._context.spHttpClient.post(
      this._context.pageContext["web"]["absoluteUrl"] +
      `/_api/web/lists/GetByTitle('${this._listName}')/items(${item.Id})`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          "IF-MATCH": "*",
          "X-HTTP-Method": "DELETE",
          "accept": "application/json",
          "content-type": "application/json"
        }
      })
      .then((): void => {
        this.listItems.remove(item);
        this.message("Remove succeeded");
        this.hasError(false);
      },
      (error: any) => {
        this.message("Remove failed");
        this.hasError(true);
      });
  }
}
