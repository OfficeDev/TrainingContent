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
  Dropdown,
  Surface
} from 'msteams-ui-components-react';
import { render } from 'react-dom';
import { TeamsBaseComponent, ITeamsBaseComponentProps, ITeamsBaseComponentState } from './TeamsBaseComponent'

export interface IteamsApp1TabConfigState extends ITeamsBaseComponentState {
  selectedConfiguration: string;
}

export interface IteamsApp1TabConfigProps extends ITeamsBaseComponentProps {
}

/**
 * Implementation of teams app1 Tab configuration page
 */
export class teamsApp1TabConfig  extends TeamsBaseComponent<IteamsApp1TabConfigProps, IteamsApp1TabConfigState> {
  configOptions = [
    { key: 'MBR', value: 'Member information' },
    { key: 'GRP', value: 'Group information (requires admin consent)' }
  ];
  selectedOption = "";

  public componentWillMount() {
    this.updateTheme(this.getQueryVariable('theme'));
    this.setState({
      fontSize: this.pageFontSize()
    });

    if (this.inTeams()) {
      microsoftTeams.initialize();

      microsoftTeams.getContext((context: microsoftTeams.Context) => {
        this.setState({
          selectedConfiguration: context.entityId
        });
        this.selectedOption = this.configOptions.filter((pos, idx) => pos.key === context.entityId)[0].value;
        this.setValidityState(true);
      });

      microsoftTeams.settings.registerOnSaveHandler((saveEvent: microsoftTeams.settings.SaveEvent) => {
        // Calculate host dynamically to enable local debugging
        let host = "https://" + window.location.host;
        microsoftTeams.settings.setSettings({
          contentUrl: host + "/teamsApp1TabTab.html?data=",
          suggestedDisplayName: 'teams app1 Tab',
          removeUrl: host + "/teamsApp1TabRemove.html",
          entityId: this.state.selectedConfiguration
        });
        saveEvent.notifySuccess();
      });
    } else {
    }
  }

  private onConfigSelect(cfgOption: string) {
    let selectedItem = this.configOptions.filter((pos, idx) => pos.key === cfgOption)[0];
    if (selectedItem) {
      this.setState({
      selectedConfiguration: selectedItem.key
    });
    this.selectedOption = selectedItem.value;
    this.setValidityState(true);
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
          button: {}
        }

          const control = <Dropdown
            autoFocus
            mainButtonText={this.selectedOption}
            style={{ width: '100%' }}
            items={
              this.configOptions.map((cfgOpt, idx) => {
                return ({ text: cfgOpt.value, onClick: () => this.onConfigSelect(cfgOpt.key) });
              })
            }
          />;


        return (
          <Surface>
            <Panel>
              <PanelHeader>
                <div style={styles.header}>Settings</div>
              </PanelHeader>
              <PanelBody>
                <div style={styles.section}>Microsoft Graph Functionality</div>
                {control}
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