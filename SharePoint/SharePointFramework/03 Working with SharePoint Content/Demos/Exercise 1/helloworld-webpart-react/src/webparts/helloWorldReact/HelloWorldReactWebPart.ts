import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'helloWorldReactStrings';
import HelloWorldReact from './components/HelloWorldReact';
import { IHelloWorldReactProps } from './components/IHelloWorldReactProps';
import { IHelloWorldReactWebPartProps } from './IHelloWorldReactWebPartProps';
import MockHttpClient from './MockHttpClient';
import { ISPList } from './ISPList';


export default class HelloWorldReactWebPart extends BaseClientSideWebPart<IHelloWorldReactWebPartProps> {

  public render(): void {
    this._getMockListData().then(lists => {
      const element: React.ReactElement<IHelloWorldReactProps> = React.createElement(HelloWorldReact, {
        description: this.properties.description,
        lists: lists
      });

      ReactDom.render(element, this.domElement);
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

  private _getMockListData(): Promise<ISPList[]> {
    return MockHttpClient.get(this.context.pageContext.web.absoluteUrl)
        .then((data: ISPList[]) => {
              return data;
          });
  }
}
