declare interface IHelloWorldKnockoutStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'helloWorldKnockoutStrings' {
  const strings: IHelloWorldKnockoutStrings;
  export = strings;
}
