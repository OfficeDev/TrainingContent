import { ConnectedComponent, Panel, PanelHeader, PanelBody, Tab, PanelFooter, IInjectedTeamsProps } from "msteams-ui-components-react";
import * as React from 'react';

export class TabExample extends React.Component<{}, {
	selectedTab: any
}> {
	constructor(props: any) {
		super(props);
		this.state = {
			selectedTab: 'a',
		};
	}

	selectTabA() {
		this.setState({ selectedTab: 'a' });
	}

	selectTabB() {
		this.setState({ selectedTab: 'b' });
	}

	render() {
		return <ConnectedComponent render={(props: IInjectedTeamsProps) => {
			const { context } = props;
			const { rem, font } = context;
			const { sizes, weights } = font;

			const styles = {
				header: { ...sizes.title, ...weights.semibold },
				section: { ...sizes.title2, marginTop: rem(1.4), marginBottom: rem(1.4) }
			}

			return <Panel>
				<PanelHeader>
					<div style={styles.header}>Tabs</div>
				</PanelHeader>
				<PanelBody>
					<div style={styles.section}></div>
					<Tab
						autoFocus
						selectedTabId={this.state.selectedTab}
						tabs={[
							{
								text: 'Tab A',
								onSelect: () => this.selectTabA(),
								id: 'a',
							},
							{
								text: 'Tab B',
								onSelect: () => this.selectTabB(),
								id: 'b',
							}
						]}
					/>
					<div style={{marginTop:'10px'}}>
						<div style={{display: this.state.selectedTab === 'a' ? 'block' : "none"}}>Content A</div>
						<div style={{display: this.state.selectedTab === 'b' ? 'block' : "none"}}>Content B</div>
					</div>
				</PanelBody>
				<PanelFooter>
					<p>[Footer]</p>
				</PanelFooter>
			</Panel>;
		}} />;
	}
}