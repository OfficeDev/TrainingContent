// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as React from "react";
import {
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

export interface ILearnAuthTabConfigState extends ITeamsBaseComponentState {
  value: string;
}

export interface ILearnAuthTabConfigProps extends ITeamsBaseComponentProps {

}

/**
 * Implementation of LearnAuthTab configuration page
 */
export class LearnAuthTabConfig extends TeamsBaseComponent<ILearnAuthTabConfigProps, ILearnAuthTabConfigState> {

  public componentWillMount() {
    this.updateTheme(this.getQueryVariable("theme"));
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
          contentUrl: host + "/learnAuthTab/?data=",
          suggestedDisplayName: "LearnAuthTab",
          removeUrl: host + "/learnAuthTab/remove.html",
          entityId: this.state.value
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
              <div style={styles.header}>Configure your tab</div>
            </PanelHeader>
            <PanelBody>
              <div style={styles.section}>
                <Input
                  autoFocus
                  placeholder="Enter a value here"
                  label="Enter a value"
                  errorLabel={!this.state.value ? "This value is required" : undefined}
                  value={this.state.value}
                  onChange={(e) => {
                    this.setState({
                      value: e.target.value
                    });
                  }}
                  required />
              </div>

            </PanelBody>
            <PanelFooter>
            </PanelFooter>
          </Panel>
        </Surface>
        `  </TeamsThemeContext.Provider>
    );
  }
}
