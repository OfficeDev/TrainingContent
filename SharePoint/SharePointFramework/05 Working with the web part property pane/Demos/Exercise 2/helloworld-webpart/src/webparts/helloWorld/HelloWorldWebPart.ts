import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneLabel,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneLink,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneCustomField,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './HelloWorld.module.scss';
import * as strings from 'helloWorldStrings';
import { IHelloWorldWebPartProps } from './IHelloWorldWebPartProps';
import { SPHttpClient } from '@microsoft/sp-http';

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {

  private _options: IPropertyPaneDropdownOption[];

  protected onInit(): Promise<void> {
      return this._getLists().then(lists => {
        this._options = lists.map(list => {
            return {
                key: list.Id,
                text: list.Title
            };
        });
      });
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.row}">
        <div class="${styles.column}">
          <span class="${styles.title}">
            Welcome to SharePoint!
          </span>
          <p class="${styles.subtitle}">
            Customize SharePoint experiences using Web Parts.
          </p>
          <p class="${styles.description}">
            ${escape(this.properties.description)}
          </p>
          <a class="ms-Button ${styles.button}" href="https://github.com/SharePoint/sp-dev-docs/wiki">
            <span class="ms-Button-label">
              Learn more
            </span>
          </a>

          <p class="ms-font-l ms-fontColor-white">Textbox value: ${escape(this.properties.textboxField)}</p>
          <p class="ms-font-l ms-fontColor-white">Multi-line Textbox value: ${this.properties.multilineTextboxField}</p>
          <p class="ms-font-l ms-fontColor-white">Checkbox checked: ${this.properties.checkboxField}</p>
          <p class="ms-font-l ms-fontColor-white">Dropdown selected value: ${this.properties.dropdownField}</p>
          <p class="ms-font-l ms-fontColor-white">Slider value: ${this.properties.sliderField}</p>
          <p class="ms-font-l ms-fontColor-white">Toggle on: ${this.properties.toggleField}</p>
        </div>
      </div>`;
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
                }),
                PropertyPaneLabel('labelField', {
                  text: 'Label text'
                }),
                PropertyPaneTextField('textboxField', {
                  label: 'Textbox label'
                }),
                PropertyPaneTextField('multilineTextboxField', {
                  label: 'Multi-line Textbox label',
                  multiline: true
                }),
                PropertyPaneCheckbox('checkboxField', {
                  text: 'Checkbox text'
                }),
                PropertyPaneDropdown('dropdownField', {
                  label: 'Dropdown label',
                  options: [
                    {key: '1', text: 'Option 1'},
                    {key: '2', text: 'Option 2'},
                    {key: '3', text: 'Option 3'}
                  ]
                }),
                PropertyPaneLink('linkField', {
                  text: 'Link text',
                  href: 'https://dev.office.com/sharepoint/docs/spfx',
                  target: '_blank'
                }),
                PropertyPaneSlider('sliderField', {
                  label: 'Slider label',
                  min: 0,
                  max: 100
                }),
                PropertyPaneToggle('toggleField', {
                  label: 'Toggle label',
                  onText: 'On',
                  offText: 'Off'
                }),
                PropertyPaneCustomField({
                  key: 'customField',
                  onRender: this._customFieldRender.bind(this)
                }),
                PropertyPaneDropdown('listName', {
                  label: 'Select a list',
                  options: this._options
                })
              ]
            }
          ]
        }
      ]
    };
  }

  private _customFieldRender(elem: HTMLElement): void {
     elem.innerHTML = '<div><h1>This is a custom field.</h1></div>';
 }

  private _getLists(): Promise<any> {
      if(Environment.type === EnvironmentType.Local) {
        return new Promise<any>(resolve => {
          setTimeout(() => resolve([
            {Id: '1', Title: 'Mock List 1'},
            {Id: '2', Title: 'Mock List 2'}]),
          500);
        });
      }
      else {
        return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=Hidden eq false`, SPHttpClient.configurations.v1)
            .then((response: Response) => {
            return response.json();
          }).then((json) => {
            return json.value;
          });
      }
  }
}
