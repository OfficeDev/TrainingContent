declare interface IHelloWorldJQueryStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'helloWorldJQueryStrings' {
  const strings: IHelloWorldJQueryStrings;
  export = strings;
}
