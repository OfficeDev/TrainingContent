declare interface IHelloWorldReactStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'helloWorldReactStrings' {
  const strings: IHelloWorldReactStrings;
  export = strings;
}
