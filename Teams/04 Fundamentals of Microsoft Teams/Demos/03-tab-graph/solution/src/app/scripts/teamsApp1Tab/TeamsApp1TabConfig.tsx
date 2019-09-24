// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import * as React from "react";
import {
  Dropdown,
  PrimaryButton,
  Panel,
  PanelBody,
  PanelHeader,
  PanelFooter,
  Input,
  Surface,
  getContext,
  TeamsThemeContext
} from "msteams-ui-components-react";
import TeamsBaseComponent, { ITeamsBaseComponentProps, ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

export interface ITeamsApp1TabConfigState extends ITeamsBaseComponentState {
  selectedConfiguration: string;
}

export interface ITeamsApp1TabConfigProps extends ITeamsBaseComponentProps {

}

/**
 * Implementation of teams app1 Tab configuration page
 */
export class TeamsApp1TabConfig extends TeamsBaseComponent<ITeamsApp1TabConfigProps, ITeamsApp1TabConfigState> {
  private configOptions = [
    { key: "MBR", value: "Member information" },
    { key: "GRP", value: "Group information (requires admin consent)" }
  ];
  private selectedOption: string = "";
  private tenantId?: string = "";

  public componentWillMount() {
    this.updateTheme(this.getQueryVariable("theme"));
    this.setState({
      fontSize: this.pageFontSize()
    });

    if (this.inTeams()) {
      microsoftTeams.initialize();

      microsoftTeams.getContext((context: microsoftTeams.Context) => {
        this.tenantId = context.tid;
        this.selectedOption = context.entityId;
        this.setState({
          selectedConfiguration: context.entityId
        });
        this.setValidityState(true);
      });

      microsoftTeams.settings.registerOnSaveHandler((saveEvent: microsoftTeams.settings.SaveEvent) => {
        // Calculate host dynamically to enable local debugging
        const host = "https://" + window.location.host;
        microsoftTeams.settings.setSettings({
          contentUrl: host + "/teamsApp1Tab/?data=",
          suggestedDisplayName: "teams app1 Tab",
          removeUrl: host + "/teamsApp1Tab/remove.html",
          entityId: this.state.selectedConfiguration
        });
        saveEvent.notifySuccess();
      });
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
              <div style={styles.header}>Settings</div>
            </PanelHeader>
            <PanelBody>
              <div style={styles.section}>Microsoft Graph Functionality</div>
              <Dropdown
                autoFocus
                mainButtonText={this.selectedOption}
                style={{ width: "100%" }}
                items={
                  this.configOptions.map((cfgOpt, idx) => {
                    return ({ text: cfgOpt.value, onClick: () => this.onConfigSelect(cfgOpt.key) });
                  })
                }
              />
              <div style={styles.section}>
                <PrimaryButton onClick={() => this.getAdminConsent()}>Provide administrator consent - click if Tenant Admin</PrimaryButton>
              </div>
            </PanelBody>
            <PanelFooter>
            </PanelFooter>
          </Panel>
        </Surface>
        `  </TeamsThemeContext.Provider>
    );
  }

  private onConfigSelect(cfgOption: string) {
    const selectedItem = this.configOptions.filter((pos, idx) => pos.key === cfgOption)[0];
    if (selectedItem) {
      this.setState({
        selectedConfiguration: selectedItem.key
      });
      this.selectedOption = selectedItem.value;
      this.setValidityState(true);
    }
  }

  private getAdminConsent() {
    microsoftTeams.authentication.authenticate({
      url: "/adminconsent.html?tenantId=" + this.tenantId,
      width: 800,
      height: 600,
      successCallback: () => { },
      failureCallback: (err) => { }
    });
  }
}
