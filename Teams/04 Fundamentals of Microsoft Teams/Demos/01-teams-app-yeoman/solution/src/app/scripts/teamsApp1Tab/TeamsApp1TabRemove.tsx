import * as React from "react";
import {
    Panel,
    PanelBody,
    PanelHeader,
    PanelFooter,
    Surface,
    TeamsThemeContext,
    getContext
} from "msteams-ui-components-react";
import TeamsBaseComponent, { ITeamsBaseComponentProps, ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";


export interface ITeamsApp1TabRemoveState extends ITeamsBaseComponentState {
    value: string;
}
export interface ITeamsApp1TabRemoveProps extends ITeamsBaseComponentProps {

}

/**
 * Implementation of teams app1 Tab remove page
 */
export class TeamsApp1TabRemove  extends TeamsBaseComponent<ITeamsApp1TabRemoveProps, ITeamsApp1TabRemoveState> {

    public componentWillMount() {
        this.updateTheme(this.getQueryVariable("theme"));
        this.setState({
            fontSize: this.pageFontSize()
        });

        if (this.inTeams()) {
            microsoftTeams.initialize();
        } else {
        }
    }

    public render() {
        const context = getContext({
            baseFontSize: this.state.fontSize,
            style: this.state.theme
        });
        const { rem, font } = context;
        const { sizes, weights } = font;
        const styles = {
            header: { ...sizes.title, ...weights.semibold },
            section: { ...sizes.base, marginTop: rem(1.4), marginBottom: rem(1.4) },
            footer: { ...sizes.xsmall }
        };
        return (
            <TeamsThemeContext.Provider value={context}>
                <Surface>
                    <Panel>
                        <PanelHeader>
                            <div style={styles.header}>You"re about to remove your tab...</div>
                        </PanelHeader>
                        <PanelBody>
                            <div style={styles.section}>
                            You can just add stuff here if you want to clean up when removing the tab. For instance, if you have stored data in an external repository, you can delete or archive it here. If you don"t need this remove page you can remove it.
                            </div>

                        </PanelBody>
                        <PanelFooter>
                        </PanelFooter>
                    </Panel>
                </Surface>
            </TeamsThemeContext.Provider>
        );
    }
}
