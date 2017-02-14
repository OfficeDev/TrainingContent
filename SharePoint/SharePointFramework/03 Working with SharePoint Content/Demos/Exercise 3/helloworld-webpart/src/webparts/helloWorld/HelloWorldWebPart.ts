import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IWebPartContext
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './HelloWorld.module.scss';
import * as strings from 'helloWorldStrings';
import { IHelloWorldWebPartProps } from './IHelloWorldWebPartProps';
import { SPHttpClientConfigurations } from '@microsoft/sp-http';

export interface IListItem {
   Id: number;
   Title: string;
 }
 
export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {
  private _listName: string = "Test";
  private _listItemEntityTypeFullName: string;

  public render(): void {
    this._getListItemEntityTypeFullName(this.context)
    .then((value) => {
      this._listItemEntityTypeFullName = value;
    });

    this.domElement.innerHTML = `
        <div class="${styles.container}">
          <div class=" ${styles.row}">
            <p class='ms-font-l'>There are <span id='spanItemLength'></span> item(s) in <span id='spanItemName'>${this._listName}</span> list</p>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th />
                        <th />
                    </tr>
                </thead>
                <tbody id="tbodyItems">
                </tbody>
            </table>
          </div>
          <div class="${styles.row}">
            <button class="ms-Button ms-Button--primary">Add New Item</button>
          </div>
          <div id='message'>
          </div>
        </div>`;

    this.generateListItemsHtml();

    this.domElement.getElementsByClassName("ms-Button")[0].addEventListener("click", () => {
      this.addNewListItem();
    });
}

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }

  protected generateListItemsHtml(): void{
    const rootContainer: Element = this.domElement.querySelector("#tbodyItems");

    this.getListItems()
    .then((data: IListItem[]) => {
      for(let i:number = 0; i < data.length; i++){
        const Id: number = data[i].Id,
            Title: string = data[i].Title;
        rootContainer["insertAdjacentHTML"]('beforeend', `
          <tr data-id="${Id}">
            <td><input class='ms-TextField-field' value="${Title}"></input></td>
            <td><button class="ms-Button ms-Button--primary">Update</button></td>
            <td><button class="ms-Button ms-Button--primary">Delete</button></td>
          </tr>
        `);

        const buttons = rootContainer.querySelectorAll(`tr[data-id='${Id}'] button`);

        buttons[0].addEventListener("click", (evt: Event): void => {
          const trNode: Element = evt.srcElement.parentElement.parentElement;
          this.saveListItem(trNode, trNode.attributes["data-id"].value);
          evt.preventDefault();
        });

        buttons[1].addEventListener("click", (evt: Event) : void => {
          const trNode: Element = evt.srcElement.parentElement.parentElement;
          this.removeListItem(trNode, trNode.attributes["data-id"].value);
          evt.preventDefault();
        });
      }
    });
  }

  private _getListItemEntityTypeFullName(context: IWebPartContext):Promise<string> {
    return context.spHttpClient.get(context.pageContext["web"]["absoluteUrl"]
      + `/_api/web/lists/GetByTitle('${this._listName}')`, SPHttpClientConfigurations.v1)
      .then((response: Response) => {
        return response.json();
      })
      .then((value) => {
        return value["ListItemEntityTypeFullName"];
      });
  }

  public addNewListItem(): void {
    const rootContainer: Element = this.domElement.querySelector("#tbodyItems");
    rootContainer["insertAdjacentHTML"]('beforeend',
    `<tr data-id="0">
        <td><input class='ms-TextField-field' value=""></input></td>
        <td><button class="ms-Button ms-Button--primary">Add</button></td>
        <td><button class="ms-Button ms-Button--primary">Delete</button></td>
    </tr>`);

    const buttons = rootContainer.querySelectorAll('tr')[rootContainer.querySelectorAll('tr').length - 1].querySelectorAll('button');

    console.log(buttons);

    buttons[0].addEventListener("click", (evt: Event): void => {
      const trNode: Element = evt.srcElement.parentElement.parentElement;
      this.saveListItem(trNode, trNode.attributes["data-id"].value);
      evt.preventDefault();
    });

    buttons[1].addEventListener("click", (evt: Event) : void => {
      const trNode: Element = evt.srcElement.parentElement.parentElement;
      this.removeListItem(trNode, trNode.attributes["data-id"].value);
      evt.preventDefault();
    });
  }

  public getListItems(): Promise<IListItem[]> {
    return this.context.spHttpClient.get(this.context.pageContext["web"]["absoluteUrl"]
    + `/_api/web/lists/GetByTitle('${this._listName}')/items?$select=Id,Title`, SPHttpClientConfigurations.v1)
    .then((response: Response): Promise<any> => {
      return response.json();
    })
    .then((data: any) : IListItem[]  =>{
      this._showSuccess(`Successfully loaded ${data.value.length} items`);
      return data.value;
    }, (error: any): void => {
      this._showError(`Loading all items failed with error: ${error}`);
    }) as Promise<IListItem[]>;
  }

  public saveListItem = (ContainerNode: Element, Id: number): void => {
    this._clearnMessage();

    const title = ContainerNode.querySelector("input").value;

    if(title.trim().length === 0) {
      this._showError('Title is required');
      return;
    }

    if (Id == 0){
      //create a new item
      const reqJSON: any = JSON.parse(
        `{
          "@odata.type": "${this._listItemEntityTypeFullName}",
          "Title": "${title}"
      }`);

      this.context.spHttpClient.post(
          this.context.pageContext["web"]["absoluteUrl"] +
          `/_api/web/lists/GetByTitle('${this._listName}')/items?$expand=ListItemAllFields`, SPHttpClientConfigurations.v1,
          {
            body: JSON.stringify(reqJSON),
            headers: {
              "accept": "application/json",
              "content-type": "application/json"
            }
      })
      .then((response: Response): Promise<IListItem> => {
        return response.json();
      })
      .then((item: IListItem): void => {
        ContainerNode.querySelectorAll("button")[0].textContent = "Update";
        ContainerNode.querySelectorAll("button")[0].parentElement.parentElement.setAttribute("data-id", item.Id.toString());
        this._showSuccess(`Item '${item.Title}' (ID: ${item.Id}) successfully created`);
      }, (error: any): void => {
        this._showError('Error while creating the item: ${error}');
      });
    }
    else{
      //update a list item
    const reqJSON: any = JSON.parse(
      `{
        "@odata.type": "${this._listItemEntityTypeFullName}",
        "Title": "${title}"
      }`);

    this.context.spHttpClient.post(
      this.context.pageContext["web"]["absoluteUrl"] +
      `/_api/web/lists/GetByTitle('${this._listName}')/items(${Id})`, SPHttpClientConfigurations.v1, 
      {
        body: JSON.stringify(reqJSON),
        headers: {
          "IF-MATCH": "*",
          "X-HTTP-Method":"MERGE",
          "accept": "application/json",
          "content-type": "application/json"
        }
      })
      .then((response: Response): void => {
        this._showSuccess(`Item with ID: ${Id} successfully updated`);
      }, (error: any): void => {
        this._showError(`Error updating item: + ${error}`);
      });
    }
  }

  public removeListItem = (ContainerNode: Element, Id: number): void => {
    this._clearnMessage();

    if(Id == 0){
      ContainerNode.parentNode.removeChild(ContainerNode);
    }
    else{
      this.context.spHttpClient.post(
        this.context.pageContext["web"]["absoluteUrl"] +
        `/_api/web/lists/GetByTitle('${this._listName}')/items(${Id})`, SPHttpClientConfigurations.v1, 
        {
          headers: {
            "IF-MATCH": "*",
            "X-HTTP-Method":"DELETE",
            "accept": "application/json",
            "content-type": "application/json"
          }
      })
      .then((response: Response): void => {
        ContainerNode.parentNode.removeChild(ContainerNode);
        this._showSuccess(`Item with ID: ${Id} successfully deleted`);
      }, (error: any): void => {
        this._showError(`Error deleting item: ${error}`);
      });
    }
  }

  private _clearnMessage() {
    this.domElement.querySelector("#message").innerHTML = "";
  }

  private _showSuccess(message: string) {
    const elem: Element = this.domElement.querySelector("#message");
    elem.className = styles.success;
    elem.innerHTML = message;
  }

  private _showError(message: string) {
    const elem: Element = this.domElement.querySelector("#message");
    elem.className = styles.error;
    elem.innerHTML = message;
  }
}
