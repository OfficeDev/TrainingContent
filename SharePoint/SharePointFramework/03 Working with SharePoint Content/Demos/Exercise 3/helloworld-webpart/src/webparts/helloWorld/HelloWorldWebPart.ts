import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import styles from './HelloWorld.module.scss';
import * as strings from 'helloWorldStrings';
import { IHelloWorldWebPartProps } from './IHelloWorldWebPartProps';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IListItem {
  Id: number;
  Title: string;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {
  private _listName: string = "Test";
  private _listItemEntityTypeFullName: string;

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.helloWorld}">
        <div class="${styles.container}">
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <p class="ms-font-l">There are <span id="spanItemLength"></span> item(s) in <span id="spanItemName">${this._listName}</span> list</p>
            <table>
              <thead id="theader" style="display:none">
                <tr>
                  <th class="ms-font-xl">Title</th>
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody id="tbodyItems">
              </tbody>
            </table>
          </div>
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <button class="${styles.button}">
              <label class="${styles.label}">Add New Item</label>
            </button>
          </div>
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <div class="ms-font-l" id="message"></div>
          </div>
        </div>
      </div>`;

    this.generateListItemsHtml();
    this.domElement.getElementsByTagName("button")[0].addEventListener("click", () => {
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

  private generateListItemsHtml(): void{
    const rootContainer: Element = this.domElement.querySelector("#tbodyItems");

    this.getListItems()
    .then((data: IListItem[]) => {
      const count: number = data.length;
      document.getElementById("spanItemLength").innerText = count.toString();
      document.getElementById("theader").style.display = (count === 0 ? "none" : "");

      for (let i:number = 0; i < count; i++){
        const Id: number = data[i].Id,
            Title: string = data[i].Title;
        rootContainer.insertAdjacentHTML('beforeend', `
          <tr data-id="${Id}">
            <td><input class="ms-TextField-field" value="${Title}"></input></td>
            <td>
              <button class="${styles.button}">
                <label class="${styles.label}">Update</label>
              </button>
            </td>
            <td>
              <button class="${styles.button}">
                <label class="${styles.label}">Delete</label>
              </button>
            </td>
          </tr>
        `);

        const buttons = rootContainer.querySelectorAll(`tr[data-id='${Id}'] button`);

        buttons[0].addEventListener("click", (evt: Event): void => {
          const trNode: Element = this._getTrAncestor(evt.srcElement);
          this.saveListItem(trNode, trNode.attributes["data-id"].value);
          evt.preventDefault();
        });

        buttons[1].addEventListener("click", (evt: Event) : void => {
          const trNode: Element = this._getTrAncestor(evt.srcElement);
          this.removeListItem(trNode, trNode.attributes["data-id"].value);
          evt.preventDefault();
        });
      }
    });
  }

  private _getListItemEntityTypeFullName():Promise<string> {
    if (this._listItemEntityTypeFullName){
      return Promise.resolve(this._listItemEntityTypeFullName);
    }

    return this.context.spHttpClient.get(this.context.pageContext["web"]["absoluteUrl"]
      + `/_api/web/lists/GetByTitle('${this._listName}')`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((value) => {
        this._listItemEntityTypeFullName = value["ListItemEntityTypeFullName"];
        return this._listItemEntityTypeFullName;
      });
  }

  private addNewListItem(): void {
    const rootContainer: Element = this.domElement.querySelector("#tbodyItems");
    rootContainer["insertAdjacentHTML"]('beforeend',
    `<tr data-id="0">
        <td>
          <input class='ms-TextField-field' value=""></input>
        </td>
        <td>
          <button class="${styles.button}">
            <label class="${styles.label}">Add</label>
          </button>
        </td>
        <td>
          <button class="${styles.button}">
            <label class="${styles.label}">Cancel</label>
          </button>
        </td>
    </tr>`);

    const buttons = rootContainer.querySelectorAll('tr')[rootContainer.querySelectorAll('tr').length - 1].querySelectorAll('button');

    buttons[0].addEventListener("click", (evt: Event): void => {
      const trNode: Element = this._getTrAncestor(evt.srcElement);
      this.saveListItem(trNode, trNode.attributes["data-id"].value);
      evt.preventDefault();
    });

    buttons[1].addEventListener("click", (evt: Event) : void => {
      const trNode: Element = this._getTrAncestor(evt.srcElement);
      this.removeListItem(trNode, trNode.attributes["data-id"].value);
      evt.preventDefault();
    });
  }

  private getListItems(): Promise<IListItem[]> {
    return this.context.spHttpClient.get(this.context.pageContext["web"]["absoluteUrl"]
    + `/_api/web/lists/GetByTitle('${this._listName}')/items?$select=Id,Title`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse): Promise<any> => {
      return response.json();
    })
    .then((data: any) : IListItem[]  =>{
      this._showSuccess(`Successfully loaded ${data.value.length} items`);
      return data.value;
    }, (error: any): void => {
      this._showError(`Loading all items failed with error: ${error}`);
    }) as Promise<IListItem[]>;
  }

  private saveListItem(ContainerNode: Element, Id: string): void {
    this._clearMessage();

    const title = ContainerNode.querySelector("input").value;

    if(title.trim().length === 0) {
      this._showError('Title is required');
      return;
    }

    this._getListItemEntityTypeFullName()
    .then((listItemEntityTypeFullName: string) => {
      const reqJSON: any = {
        "@odata.type": listItemEntityTypeFullName,
        "Title": title
      };

      if(Id === "0") {
        //create a new item
        this.context.spHttpClient.post(
            this.context.pageContext["web"]["absoluteUrl"] +
            `/_api/web/lists/GetByTitle('${this._listName}')/items`, SPHttpClient.configurations.v1,
            {
              body: JSON.stringify(reqJSON),
              headers: {
                "accept": "application/json",
                "content-type": "application/json"
              }
        })
        .then((response: SPHttpClientResponse): Promise<IListItem> => {
          return response.json();
        })
        .then((item: IListItem): void => {
          ContainerNode.querySelectorAll("button")[0].textContent = "Update";
          ContainerNode.querySelectorAll("button")[0].parentElement.parentElement.setAttribute("data-id", item.Id.toString());
          this._showSuccess(`Item '${item.Title}' (ID: ${item.Id}) successfully created`);
          this._updateItemCount(1);
        }, (error: any): void => {
          this._showError('Error while creating the item: ${error}');
        });
      }
      else {
        //update a list item
        this.context.spHttpClient.post(
          this.context.pageContext["web"]["absoluteUrl"] +
          `/_api/web/lists/GetByTitle('${this._listName}')/items(${Id})`, SPHttpClient.configurations.v1, 
          {
            body: JSON.stringify(reqJSON),
            headers: {
              "IF-MATCH": "*",
              "X-HTTP-Method":"MERGE",
              "accept": "application/json",
              "content-type": "application/json"
          }
        })
        .then((response: SPHttpClientResponse): void => {
          this._showSuccess(`Item with ID: ${Id} successfully updated`);
        }, (error: any): void => {
          this._showError(`Error updating item: + ${error}`);
        });
      }
    });
  }

  private removeListItem (ContainerNode: Element, Id: string): void {
    this._clearMessage();

    if(Id === "0"){
      ContainerNode.parentNode.removeChild(ContainerNode);
    }
    else{
      this.context.spHttpClient.post(
        this.context.pageContext["web"]["absoluteUrl"] +
        `/_api/web/lists/GetByTitle('${this._listName}')/items(${Id})`, SPHttpClient.configurations.v1, 
        {
          headers: {
            "IF-MATCH": "*",
            "X-HTTP-Method":"DELETE",
            "accept": "application/json",
            "content-type": "application/json"
          }
      })
      .then((response: SPHttpClientResponse): void => {
        ContainerNode.parentNode.removeChild(ContainerNode);
        this._showSuccess(`Item with ID: ${Id} successfully deleted`);
        this._updateItemCount(-1);
      }, (error: any): void => {
        this._showError(`Error deleting item: ${error}`);
      });
    }
  }

  private _updateItemCount(increment: number){
    const countElement = document.getElementById("spanItemLength");
    const count: number = Number(countElement.innerText);
    countElement.innerText = (count + increment).toString();
  }

  private _getTrAncestor(element: Element): Element{
    while (element && element.tagName.toLowerCase() != "tr"){
      element = element.parentElement;
    }
    return element;
  }

  private _clearMessage() {
    this.domElement.querySelector("#message").innerHTML = "";
  }

  private _showSuccess(message: string) {
    const elem: Element = this.domElement.querySelector("#message");
    elem.className = "ms-fontColor-white";
    elem.innerHTML = message;
  }

  private _showError(message: string) {
    const elem: Element = this.domElement.querySelector("#message");
    elem.className = "ms-fontColor-red";
    elem.innerHTML = message;
  }
}
