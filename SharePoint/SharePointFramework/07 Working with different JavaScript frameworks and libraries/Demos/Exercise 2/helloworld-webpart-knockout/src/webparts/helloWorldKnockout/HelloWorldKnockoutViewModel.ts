import * as ko from 'knockout';
import styles from './HelloWorldKnockout.module.scss';
import { IHelloWorldKnockoutWebPartProps } from './IHelloWorldKnockoutWebPartProps';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient } from '@microsoft/sp-http';

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

  public rowClass: string = styles.row;
  public columnClass: string = styles.column;
  public titleClass: string = styles.title;
  public subtitleClass: string = styles.subtitle;
  public descriptionClass: string = styles.description;
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
    this._getListItemEntityTypeFullName(this._context)
    .then((value) => {
      this._listItemEntityTypeFullName = value;
    });
    this._getListItems()
    .then((data: IlistItems) => {
      this.listItems(data.value);
    });
  }

  public showAddNew = (show: boolean): void => {
      this.isAdding(show);
      if (!show) {
          this.newItemTitle("");
      }
  }

  public addListItem = (): void => {
    const newItemTitle: string = this.newItemTitle();    
    const reqJSON: any = JSON.parse(
        `{
            "@odata.type": "${this._listItemEntityTypeFullName}",
            "Title": "${newItemTitle}"
        }`);

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
        .then((response: Response): Promise<any> => {
            return response.json();
        })
        .then((data: any) => {
            this.listItems.push({Id: data["Id"], Title: newItemTitle});
            this.newItemTitle("");
            this.message("Add succeeded");
            this.hasError(false);
        },
        (error: any) => {
            this.message("Add failed");
            this.hasError(true);
        });
  }

  public updateListItem = (item: IlistItem): void => {
    const reqJSON: any = JSON.parse(
        `{
            "@odata.type": "${this._listItemEntityTypeFullName}",
            "Title": "${item.Title}"
        }`);

    this._context.spHttpClient.post(
        this._context.pageContext["web"]["absoluteUrl"] +
        `/_api/web/lists/GetByTitle('${this._listName}')/items(${item.Id})`,
        SPHttpClient.configurations.v1,
        {
            body: JSON.stringify(reqJSON),
            headers: {
                "IF-MATCH": "*",
                "X-HTTP-Method":"MERGE",
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
  }

  public removeListItem = (item: IlistItem): void => {
    this._context.spHttpClient.post(
        this._context.pageContext["web"]["absoluteUrl"] +
        `/_api/web/lists/GetByTitle('${this._listName}')/items(${item.Id})`,
        SPHttpClient.configurations.v1,
        {
            headers: {
                "IF-MATCH": "*",
                "X-HTTP-Method":"DELETE",
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

  private _getListItemEntityTypeFullName(context: IWebPartContext):Promise<string>{
    return context.spHttpClient.get(context.pageContext["web"]["absoluteUrl"]
        + `/_api/web/lists/GetByTitle('${this._listName}')`, SPHttpClient.configurations.v1)
        .then((response: Response) => {
            return response.json();
        })
        .then((value) => {
            return value["ListItemEntityTypeFullName"];
        });
  }

  private _getListItems(): Promise<IlistItems>{
    return this._context.spHttpClient.get(this._context.pageContext["web"]["absoluteUrl"]
    + `/_api/web/lists/GetByTitle('${this._listName}')/items?$select=Id,Title`, SPHttpClient.configurations.v1)
    .then((response: Response): Promise<any> => {
        return response.json();
    })
    .then((data: any) : IlistItems =>{
        this.message("Load succeeded");
        this.hasError(false);
        const listData: IlistItems = { value: data["value"]};
        return listData;
    },
    (error: any) => {
        this.message("Load failed");
        this.hasError(true);
    }) as Promise<IlistItems>;
  }
}
