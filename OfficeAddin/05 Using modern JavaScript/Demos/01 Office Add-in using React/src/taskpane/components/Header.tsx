/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

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
        <span className="ms-font-xxl ms-fontColor-white">{this.props.title}</span>
      </div>
    );
  }
}