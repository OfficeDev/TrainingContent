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

export interface IteamsApp1TabRemoveState extends ITeamsBaseComponentState {
  value: string;
}
export interface IteamsApp1TabRemoveProps extends ITeamsBaseComponentProps {

}

/**
 * Implementation of teams app1 Tab remove page
 */
export class teamsApp1TabRemove extends TeamsBaseComponent<IteamsApp1TabRemoveProps, IteamsApp1TabRemoveState> {

  public componentWillMount() {
    this.updateTheme(this.getQueryVariable('theme'));
    this.setState({
      fontSize: this.pageFontSize()
    });

    if (this.inTeams()) {
      microsoftTeams.initialize();
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
                  <div style={styles.header}>You're about to remove your tab...</div>
                </PanelHeader>
                <PanelBody>
                  <div style={styles.section}>
                    You can just add stuff here if you want to clean up when removing the tab. For instance, if you have stored data in an external repository, you can delete or archive it here. If you don't need this remove page you can remove it.
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
