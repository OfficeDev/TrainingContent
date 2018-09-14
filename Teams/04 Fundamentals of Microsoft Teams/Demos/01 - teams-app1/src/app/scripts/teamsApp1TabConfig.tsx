import * as React from 'react';
import {
    PrimaryButton,
    TeamsComponentContext,
    ConnectedComponent,
    Panel,
    PanelBody,
    PanelHeader,
    PanelFooter,
    Input,
    Surface
} from 'msteams-ui-components-react';
import { render } from 'react-dom';
import TeamsBaseComponent, { ITeamsBaseComponentProps, ITeamsBaseComponentState } from 'msteams-react-base-component'
import * as microsoftTeams from '@microsoft/teams-js';

export interface IteamsApp1TabConfigState extends ITeamsBaseComponentState {
    value: string;
}

export interface IteamsApp1TabConfigProps extends ITeamsBaseComponentProps {

}

/**
 * Implementation of teams app1 Tab configuration page
 */
export class teamsApp1TabConfig  extends TeamsBaseComponent<IteamsApp1TabConfigProps, IteamsApp1TabConfigState> {

    public componentWillMount() {
        this.updateTheme(this.getQueryVariable('theme'));
        this.setState({
            fontSize: this.pageFontSize()
        });

        if (this.inTeams()) {
            microsoftTeams.initialize();

            microsoftTeams.getContext((context: microsoftTeams.Context) => {
                this.setState({
                    value: context.entityId
                });
                this.setValidityState(true);
            });

            microsoftTeams.settings.registerOnSaveHandler((saveEvent: microsoftTeams.settings.SaveEvent) => {
                // Calculate host dynamically to enable local debugging
                const host = "https://" + window.location.host;
                microsoftTeams.settings.setSettings({
                    contentUrl: host + "/teamsApp1Tab.html?data=",
                    suggestedDisplayName: 'teams app1 Tab',
                    removeUrl: host + "/teamsApp1TabRemove.html",
                    entityId: this.state.value
                });
                saveEvent.notifySuccess();
            });
        } else {
        }
    }

    public render() {
        return (
            <TeamsComponentContext
                fontSize={this.state.fontSize}
                theme={this.state.theme}
            >

                <ConnectedComponent render={(props) => {
                    const { context } = props;
                    const { rem, font } = context;
                    const { sizes, weights } = font;
                    const styles = {
                        header: { ...sizes.title, ...weights.semibold },
                        section: { ...sizes.base, marginTop: rem(1.4), marginBottom: rem(1.4) },
                        input: {},
                    };

                    return (
                        <Surface>
                            <Panel>
                                <PanelHeader>
                                    <div style={styles.header}>Configure your tab</div>
                                </PanelHeader>
                                <PanelBody>
                                    <div style={styles.section}>
                                        <Input
                                            autoFocus
                                            style={styles.input}
                                            placeholder="Enter a value here"
                                            label="Enter a value"
                                            errorLabel={!this.state.value ? "This value is required" : undefined}
                                            value={this.state.value}
                                            onChange={(e) =>{
                                                this.setState({
                                                    value: e.target.value
                                                })
                                            }}
                                            required />
                                    </div>

                                </PanelBody>
                                <PanelFooter>
                                </PanelFooter>
                            </Panel>
                        </Surface>
                    );
                }}>
                </ConnectedComponent>
            </TeamsComponentContext >
        );
    }
}
