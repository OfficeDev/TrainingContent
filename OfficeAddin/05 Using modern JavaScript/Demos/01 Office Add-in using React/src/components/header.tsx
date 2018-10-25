import * as React from 'react';

export interface HeaderProps {
  title: string;
}

export class Header extends React.Component<HeaderProps, any> {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className="ms-bgColor-greenDark header">
        <span className="ms-font-su ms-fontColor-white">
          {this.props.title}
        </span>
      </div>
    );
  }
}
