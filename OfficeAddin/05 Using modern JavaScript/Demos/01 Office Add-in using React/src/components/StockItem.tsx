import * as React from 'react';

export interface StockItemProps {
  symbol: string;
  index: number;
  onDelete: any;
  onRefresh: any;
}

export class StockItem extends React.Component<StockItemProps, any> {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className="pct100 itemRow">
        <div className="left">{this.props.symbol}</div>
        <div className="right">
          <div className="left icon">
            <i className="ms-Icon ms-Icon--Refresh" aria-hidden="true" onClick={this.props.onRefresh} />
          </div>
          <div className="left icon">
            <i className="ms-Icon ms-Icon--Delete" aria-hidden="true" onClick={this.props.onDelete} />
          </div>
        </div>
      </div>
    );
  }
}
