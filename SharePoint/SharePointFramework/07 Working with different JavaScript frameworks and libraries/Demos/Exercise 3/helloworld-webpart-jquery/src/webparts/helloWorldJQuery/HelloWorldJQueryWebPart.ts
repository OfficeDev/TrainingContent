import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import styles from './HelloWorldJQuery.module.scss';
import * as strings from 'helloWorldJQueryStrings';
import { IHelloWorldJQueryWebPartProps } from './IHelloWorldJQueryWebPartProps';

import { SPHttpClient } from '@microsoft/sp-http';
import * as jQuery from 'jquery';
import * as Chartist from 'chartist';
import * as moment from 'moment';
import 'jqueryui';

interface ITask {
   Id: number;
   Title: string;
   StartDate: Date;
   DueDate: Date;
   TaskStatus: string;
 }

export default class HelloWorldJQueryWebPart extends BaseClientSideWebPart<IHelloWorldJQueryWebPartProps> {
  private _listName: string = "Tasks";

  public render(): void {
   require("../../../node_modules/jqueryui/jquery-ui.css");
   require("../../../node_modules/chartist/dist/chartist.min.css");

   this.getListItems()
   .then((items: ITask[]) => {
     this.renderListItems(items);
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

  private getListItems(): Promise<ITask[]> {
   return this.context.spHttpClient.get(this.context.pageContext["web"]["absoluteUrl"]
     + `/_api/web/lists/GetByTitle('${this._listName}')/items?$select=Id,Title,StartDate,TaskDueDate,TaskStatus`, SPHttpClient.configurations.v1)
   .then((response: Response): Promise<any> => {
     return response.json();
   })
   .then((data: any) : ITask[] =>{
     return data.value;
   }) as Promise<ITask[]>;
  }

  private renderListItems(items: ITask[]): void {
   const groupedItems = {};
   for(const item of items) {
     if (groupedItems[item.TaskStatus] == undefined) {
       groupedItems[item.TaskStatus] = [];
     }
     groupedItems[item.TaskStatus].push(item);
   }

   const chartistData = {
     labels: [],
     series: []
   };

   let html: string = '<div class="accordion">';
   for (const key in groupedItems) {
     const value = groupedItems[key];
     html += `<h3>${key}</h3>`;
     html += '<div><table><thead><tr><td>Task Name</td><td>Start Date</td><td>Due Date</td></tr></thead>';
     for (const item of value) {
       html += `<tr><td>${item.Title}</td><td>${moment(item.StartDate).format('MM/DD/YYYY')}</td><td>${moment(item.TaskDueDate).format('MM/DD/YYYY')}</td></tr>`;
     }
     html += '</table></div>';

     chartistData.labels.push(key);
     chartistData.series.push(value.length);
   }
   html += '</div>';
   html += `<div class="${styles.pieChartContainer}"><h3>Pie Chart</h3><div><div class="ct-chart"></div></div></div>`;
   this.domElement.innerHTML = `<div><div>${html}</div></div>`;

   const accordionOptions: JQueryUI.AccordionOptions = {
     animate: true,
     collapsible: false,
     icons: {
       header: 'ui-icon-circle-arrow-e',
       activeHeader: 'ui-icon-circle-arrow-s'
     }
   };

   const rootDom = jQuery(this.domElement);
   rootDom.find('.accordion').accordion(accordionOptions);

   var options = {
     height: "200px"
   };

   new Chartist.Pie(rootDom.find(`.${styles.pieChartContainer} .ct-chart`)[0], chartistData, options);
 }
}
