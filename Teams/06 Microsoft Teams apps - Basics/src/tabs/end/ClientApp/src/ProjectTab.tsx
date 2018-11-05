import * as React from 'react';
import * as microsoftTeamsModule from "@microsoft/teams-js";
import { ConnectedComponent, Panel, PanelHeader, PanelBody, PanelFooter, IInjectedTeamsProps } from 'msteams-ui-components-react';
//needed for source mapping
const microsoftTeams = microsoftTeamsModule;

export class ProjectTab extends React.Component<{ projectId: number }, {
    id?: number,
    name?: string
}>{

    constructor(props: any) {
        super(props);
        this.state = {};
    }

    public componentDidMount() {
        fetch(`/api/project/${this.props.projectId}`).then((response) => {
            response.json().then((json) => {
                this.setState({
                    ...json
                });
            });
        });
    }

    public render() {
        return <ConnectedComponent render={(props: IInjectedTeamsProps) => {
            const { context } = props;
            const { rem, font } = context;
            const { sizes, weights } = font;

            const styles = {
                header: { ...sizes.title, ...weights.semibold },
                input: {
                    paddingTop: rem(0.5),
                    width: '50%'
                },
            }

            return (
                <Panel>
                    <PanelHeader>
                        <div style={styles.header}>Project Details</div>
                    </PanelHeader>
                    <PanelBody>
                        { this.state.id ? (
                            <ul>
                                <li>ID: {this.state.id}</li>
                                <li>Name: {this.state.name}</li>
                            </ul>) :
                            (<div>loading...</div>)}
                    </PanelBody>
                    <PanelFooter>
                    </PanelFooter>
                </Panel>)
        }
        } />
    }


    public onValueChanged = (event: any) => {
        if (!isNaN(event.target.value)) {
            this.setState(Object.assign({}, this.state, { projectId: Number(event.target.value) }));
            microsoftTeams.settings.setValidityState(true);
        }
    }
}