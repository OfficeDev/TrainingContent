import * as React from 'react';
import * as microsoftTeamsModule from "@microsoft/teams-js";
import { ConnectedComponent, Panel, PanelHeader, PanelBody, Input, PanelFooter, IInjectedTeamsProps } from 'msteams-ui-components-react';
//needed for source mapping
const microsoftTeams = microsoftTeamsModule;

export class ConfigTab extends React.Component<{}, {
    projectId: number
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            projectId: -1
        };
    }

    public componentDidMount() {

        microsoftTeams.initialize();

        microsoftTeams.settings.registerOnSaveHandler((saveEvent) => {
            microsoftTeams.settings.setSettings({
                entityId: "MyTeamsTab.Project",
                contentUrl: `${window.location.origin}/project/${this.state.projectId}`,
                suggestedDisplayName: `Project ${this.state.projectId}`
            });
            saveEvent.notifySuccess();
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

            return <Panel>
                <PanelHeader>
                    <div style={styles.header}>Config</div>
                </PanelHeader>
                <PanelBody>
                    <Input
                        autoFocus
                        style={styles.input}
                        placeholder="ID"
                        label="Enter the Project ID"
                        onChange={this.onValueChanged}
                        required />
                </PanelBody>
                <PanelFooter>
                </PanelFooter>
            </Panel>;
        }} />;
    }

    public onValueChanged = (event:any) => {
        if(!isNaN(event.target.value)){
            this.setState(Object.assign({}, this.state, { projectId: Number(event.target.value) }));
            microsoftTeams.settings.setValidityState(true);
        }  
    }
}