import * as React from 'react';
import { css } from 'office-ui-fabric-react';
import styles from './HelloWorldReact.module.scss';
import { IHelloWorldReactProps } from './IHelloWorldReactProps';

export default class HelloWorldReact extends React.Component<IHelloWorldReactProps, void> {
  public render(): React.ReactElement<IHelloWorldReactProps> {
    return (
      <div className={styles.helloWorld}>
        <div className={styles.container}>
          <div className={css('ms-Grid-row ms-bgColor-themeDark ms-fontColor-white', styles.row)}>
            <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>
              <span className='ms-font-xl ms-fontColor-white'>
                Welcome to SharePoint!
              </span>
              <p className='ms-font-l ms-fontColor-white'>
                Customize SharePoint experiences using Web Parts.
              </p>
              <p className='ms-font-l ms-fontColor-white'>
                {this.props.description}
              </p>
              <a className={css('ms-Button', styles.button)}
                 href='https://github.com/SharePoint/sp-dev-docs/wiki'>
                <span className='ms-Button-label'>Learn more</span>
              </a>
              <div className="ms-u-slideRightIn10">This content will slide in.</div>
              <div className="ms-bgColor-themeDarker ms-fontColor-white">This theme is darker.</div>
              <i className="ms-Icon ms-Icon--Mail" aria-hidden="true"></i>
              <div className="ms-fontSize-xxl">The quick brown fox jumps over the lazy dog</div>
              <div className="ms-Grid">
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-u-sm6 ms-u-md4 ms-u-lg2">
                      <div className="ms-bgColor-neutralDark">A</div>
                    </div>
                    <div className="ms-Grid-col ms-u-sm6 ms-u-md8 ms-u-lg10">
                      <div className="ms-bgColor-neutralDark">B</div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
