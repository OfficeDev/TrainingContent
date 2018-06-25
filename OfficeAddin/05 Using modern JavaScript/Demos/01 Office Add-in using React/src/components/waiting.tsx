import * as React from 'react';
import { Overlay, Spinner, SpinnerSize } from 'office-ui-fabric-react';

export class Waiting extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <Overlay isDarkThemed={true} className="overlay">
        <div className="spinner">
          <Spinner size={SpinnerSize.large} />
        </div>
      </Overlay>
    );
  }
}
