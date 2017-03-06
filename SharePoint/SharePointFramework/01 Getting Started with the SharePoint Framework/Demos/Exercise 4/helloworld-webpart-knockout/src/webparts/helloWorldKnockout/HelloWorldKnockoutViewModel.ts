import * as ko from 'knockout';
import styles from './HelloWorldKnockout.module.scss';
import { IHelloWorldKnockoutWebPartProps } from './IHelloWorldKnockoutWebPartProps';

export interface IHelloWorldKnockoutBindingContext extends IHelloWorldKnockoutWebPartProps {
  shouter: KnockoutSubscribable<{}>;
}

export default class HelloWorldKnockoutViewModel {
  public description: KnockoutObservable<string> = ko.observable('');

  public rowClass: string = styles.row;
  public columnClass: string = styles.column;
  public titleClass: string = styles.title;
  public subtitleClass: string = styles.subtitle;
  public descriptionClass: string = styles.description;
  public buttonClass: string = `ms-Button ${styles.button}`;

  constructor(bindings: IHelloWorldKnockoutBindingContext) {
    this.description(bindings.description);

    // When web part description is updated, change this view model's description.
    bindings.shouter.subscribe((value: string) => {
      this.description(value);
    }, this, 'description');
  }
}
