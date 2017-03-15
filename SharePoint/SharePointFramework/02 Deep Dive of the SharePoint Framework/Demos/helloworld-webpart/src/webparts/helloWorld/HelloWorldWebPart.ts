import { Version, DisplayMode, Environment, EnvironmentType, Log } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape, findIndex } from '@microsoft/sp-lodash-subset';

import styles from './HelloWorld.module.scss';
import * as strings from 'helloWorldStrings';
import { IHelloWorldWebPartProps } from './IHelloWorldWebPartProps';

export interface ISPItem {
    Title: string;
    Id: string;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {

  private _spItems: ISPItem[] = [
    { Title:'Mock Title 1', Id: '1'},
    { Title:'Mock Title 2', Id: '2'},
    { Title:'Mock Title 3', Id: '3'},
    { Title:'Mock Title 4', Id: '4'},
    { Title:'Mock Title 5', Id: '5'}];

  public render(): void {
    const index : number = findIndex(
      this._spItems,
      (item: ISPItem) => item.Title === 'Mock Title 3');

    const pageMode : string = this.displayMode === DisplayMode.Edit ? 'You are in edit mode' : 'You are in read mode';

    const environmentType : string = Environment.type === EnvironmentType.Local ? 'You are in local environment' : 'You are in sharepoint environment';

    Log.info('HelloWorld', 'message', this.context.serviceScope);
    Log.warn('HelloWorld', 'WARNING message', this.context.serviceScope);
    Log.error('HelloWorld', new Error('Error message'), this.context.serviceScope);
    Log.verbose('HelloWorld', 'VERBOSE message', this.context.serviceScope);

    this.context.statusRenderer.displayLoadingIndicator(this.domElement, "message");
    setTimeout(() => {
      this.context.statusRenderer.clearLoadingIndicator(this.domElement);
      try {
          throw new Error("Error message");
      } catch(err) {
        this.context.statusRenderer.renderError(this.domElement, err);
        setTimeout(() => {
          this.context.statusRenderer.clearError(this.domElement);
          this.domElement.innerHTML = `
            <div class="${styles.helloWorld}">
              <div class="${styles.container}">
                <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
                  <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
                    <span class="ms-font-xl ms-fontColor-white">Welcome to SharePoint!</span>
                    <p class="ms-font-l ms-fontColor-white">Customize SharePoint experiences using Web Parts.</p>
                    <p class="ms-font-l ms-fontColor-white">${escape(this.properties.description)}</p>
                    <a href="https://aka.ms/spfx" class="${styles.button}">
                      <span class="${styles.label}">Learn more</span>
                    </a>
                    <p class="ms-font-l ms-fontColor-white">The index of "Mock Title 3" is: ${index}</p>
                    <p class="ms-font-l ms-fontColor-white">${pageMode}</p>
                    <p class='ms-font-l ms-fontColor-white'>Loading from ${this.context.pageContext.web.title}</p>
                    <p class="ms-font-l ms-fontColor-white">${environmentType}</p>
                  </div>
                </div>
              </div>
            </div>`;
        }, 2000);
      }
    }, 2000);
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
}
