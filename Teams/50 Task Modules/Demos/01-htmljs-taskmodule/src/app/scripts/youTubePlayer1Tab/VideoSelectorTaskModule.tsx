import * as React from "react";
import {
  Provider, Flex, Text, Button, Header, ThemePrepared, teamsTheme, teamsDarkTheme, teamsHighContrastTheme, Input
} from "@fluentui/react-northstar";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

export interface IVideoSelectorTaskModuleState extends ITeamsBaseComponentState {
  teamsTheme: ThemePrepared;
  youTubeVideoId?: string;
}

export interface IVideoSelectorTaskModuleProps {
}

export class VideoSelectorTaskModule extends TeamsBaseComponent<IVideoSelectorTaskModuleProps, IVideoSelectorTaskModuleState> {
  public componentWillMount(): void {
    this.updateComponentTheme(this.getQueryVariable("theme"));
    this.setState(Object.assign({}, this.state, {
      youTubeVideoId: this.getQueryVariable("vid")
    }));

    if (this.inTeams()) {
      microsoftTeams.initialize();
      microsoftTeams.registerOnThemeChangeHandler(this.updateComponentTheme);
    }
  }

  public render() {
    return (
      <Provider theme={this.state.teamsTheme}>
        <Flex column gap="gap.smaller">
          <Text size="medium">
            Enter the ID of a YouTube video to show in the task module player.
    </Text>
          <Input value={this.state.youTubeVideoId} onChange={this.handleOnChanged}></Input>
          <Button content="Update" primary onClick={this.handleOnClick}></Button>
        </Flex>
      </Provider>
    );
  }

  private handleOnChanged = (event): void => {
    this.setState(Object.assign({}, this.state, {
      youTubeVideoId: event.target.value
    }));
  }

  private handleOnClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    microsoftTeams.tasks.submitTask(this.state.youTubeVideoId, undefined);
  }

  private updateComponentTheme = (currentThemeName: string = "default"): void => {
    let theme: ThemePrepared;

    switch (currentThemeName) {
      case "default":
        theme = teamsTheme;
        break;
      case "dark":
        theme = teamsDarkTheme;
        break;
      case "contrast":
        theme = teamsHighContrastTheme;
        break;
      default:
        theme = teamsTheme;
        break;
    }
    // update the state
    this.setState(Object.assign({}, this.state, {
      teamsTheme: theme
    }));
  }
}