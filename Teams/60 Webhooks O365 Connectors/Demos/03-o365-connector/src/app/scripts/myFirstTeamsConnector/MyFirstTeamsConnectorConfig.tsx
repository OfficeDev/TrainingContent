import * as React from "react";
import {
  Panel,
  PanelBody,
  PanelHeader,
  PanelFooter,
  Dropdown,
  IDropdownItemProps,
  Surface,
  TeamsThemeContext
} from "msteams-ui-components-react";
import TeamsBaseComponent, { ITeamsBaseComponentProps, ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import { getContext } from "msteams-ui-styles-core";

export interface IMyFirstTeamsConnectorConfigState extends ITeamsBaseComponentState {
  color: IColor | undefined;
  submit: boolean;
  webhookUrl: string;
  user: string;
  appType: string;
  groupName: string;
}

export interface IMyFirstTeamsConnectorConfigProps extends ITeamsBaseComponentProps {
}

interface IColor {
  title: string;
  code: string;
}

const availableColors: IColor[] = [
  {
    title: "Blue",
    code: "#dce6ee"
  },
  {
    title: "Orange",
    code: "#ffc300"
  }
];

/**
 * Implementation of the myFirstTeamsConnector Connector connect page
 */
export class MyFirstTeamsConnectorConfig extends TeamsBaseComponent<IMyFirstTeamsConnectorConfigProps, IMyFirstTeamsConnectorConfigState> {

  public componentWillMount() {
    this.updateTheme(this.getQueryVariable("theme"));
    this.setState({
      fontSize: this.pageFontSize()
    });

    if (this.inTeams()) {
      microsoftTeams.initialize();

      microsoftTeams.getContext((context: microsoftTeams.Context) => {
        this.setState({
          color: availableColors.filter(c => c.code === context.entityId)[0],
        });
        this.setValidityState(this.state.color !== undefined);
      });

      microsoftTeams.settings.registerOnSaveHandler((saveEvent: microsoftTeams.settings.SaveEvent) => {
        // INFO: Should really be of type microsoftTeams.settings.Settings, but configName does not exist in the Teams JS SDK
        const settings: any = {
          entityId: this.state.color ? this.state.color.code : availableColors[0].code,
          contentUrl: `https://${process.env.HOSTNAME}/myFirstTeamsConnector/config.html`,
          configName: this.state.color ? this.state.color.title : availableColors[0].title
        };
        microsoftTeams.settings.setSettings(settings);

        microsoftTeams.settings.getSettings((s: any) => {
          this.setState({
            webhookUrl: s.webhookUrl,
            user: s.userObjectId,
            appType: s.appType,
          });

          fetch("/api/connector/connect", {
            method: "POST",
            headers: [
              ["Content-Type", "application/json"]
            ],
            body: JSON.stringify({
              webhookUrl: this.state.webhookUrl,
              user: this.state.user,
              appType: this.state.appType,
              groupName: this.state.groupName,
              color: this.state.color ? this.state.color.code : availableColors[0].code,
              state: "myAppsState"
            })
          }).then(x => {
            if (x.status === 200 || x.status === 302) {
              saveEvent.notifySuccess();
            } else {
              saveEvent.notifyFailure(x.statusText);
            }
          }).catch(e => {
            saveEvent.notifyFailure(e);
          });
        });
      });
    } else {
      // Not in Microsoft Teams
      alert("Operation not supported outside of Microsoft Teams");
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
      section: { ...sizes.base, marginTop: rem(1.4), marginBottom: rem(1.4), height: "200px" },
      input: {},
    };
    const colors: IDropdownItemProps[] = availableColors.map(color => {
      return {
        text: color.title,
        onClick: () => {
          this.setState({ color });
          this.setValidityState(color !== undefined);
        }
      };
    });
    return (
      <TeamsThemeContext.Provider value={context}>
        <Surface>
          <Panel>
            <PanelHeader>
              <div style={styles.header}>Configure your Connector</div>
            </PanelHeader>
            <PanelBody>

              <div style={styles.section}>
                <Dropdown
                  label="Card color"
                  items={colors}
                  mainButtonText={this.state.color ? this.state.color.title : "Choose a color"}
                  style={styles.input}
                >
                </Dropdown>
              </div>

            </PanelBody>
            <PanelFooter>
            </PanelFooter>
          </Panel>
        </Surface>
      </TeamsThemeContext.Provider >
    );
  }
}
