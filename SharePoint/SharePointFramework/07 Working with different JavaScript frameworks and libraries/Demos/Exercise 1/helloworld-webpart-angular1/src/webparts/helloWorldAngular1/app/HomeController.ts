import * as angular from 'angular';
import { IDataService, IListItem } from './DataService';

export default class HomeController {
  public isAdding: boolean = false;
  public hasError: boolean = false;
  public message: string = "";
  public newItem: string = null;
  public listItems: IListItem[] = [];
  private siteUrl: string = undefined;
  private listName: string = undefined;

  public static $inject: string[] = ['DataService', '$window', '$rootScope'];

  constructor(private dataService: IDataService,
    private $window: angular.IWindowService,
    $rootScope: angular.IRootScopeService) {
    const vm: HomeController = this;

    $rootScope.$on('init',
      (event: angular.IAngularEvent,
        args: {
          siteUrl: string;
          listName: string;
        }): void => {
        vm.init(args.siteUrl, args.listName);
      });
  }

  public showAddNew(show: boolean): void {
    this.isAdding = show;
    if (!show) {
      this.newItem = null;
    }
  }

  public addNewItem(): void {
    this.dataService.addListItem(this.newItem, this.siteUrl, this.listName)
      .then((Id: number): void => {
        this.listItems.unshift({ Id: Id, Title: this.newItem });
        this.newItem = null;
        this.message = "Add succeeded";
        this.hasError = false;
      },
      (error: any): void => {
        this.message = "Add failed";
        this.hasError = true;
      });
  }

  public updateItem(item: IListItem): void {
    this.dataService.updateListItem(item, this.siteUrl, this.listName)
      .then((): void => {
        this.message = "Update succeeded";
        this.hasError = false;
      },
      (error: any): void => {
        this.message = "Update failed";
        this.hasError = true;
      });
  }

  public deleteItem(item: IListItem): void {
    this.dataService.deleteListItem(item, this.siteUrl, this.listName)
      .then((Id: number): void => {
        const index: number = this.listItems.indexOf(item);
        if (index > -1) {
          this.listItems.splice(index, 1);
        }
        this.message = "Delete succeeded";
        this.hasError = false;
      },
      (error: any): void => {
        this.message = "Delete failed";
        this.hasError = true;
      });
  }

  private init(siteUrl: string, listName: string): void {
    let siteUrlValid: boolean = false;
    let listNameValid: boolean = false;
    if (siteUrl != undefined && siteUrl != null && siteUrl.length > 0) {
      this.siteUrl = siteUrl;
      siteUrlValid = true;
    }
    if (listName != undefined && listName != null && listName.length > 0) {
      this.listName = listName;
      listNameValid = true;
    }
    if (siteUrlValid && listNameValid) {
      this.loadListItems();
    }
  }

  private loadListItems(): void {
    this.message = "Loading...";
    this.dataService.getListItems(this.siteUrl, this.listName)
      .then((items: IListItem[]): void => {
        this.listItems = items;
        this.message = "Load succeeded";
        this.hasError = false;
      },
      (error: any): void => {
        this.message = "Load failed";
        this.hasError = true;
      });
  }
}


