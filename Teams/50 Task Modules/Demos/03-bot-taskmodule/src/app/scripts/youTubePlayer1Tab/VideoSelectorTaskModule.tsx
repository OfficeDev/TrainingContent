import * as React from "react";
import {
  Flex, Provider, themes, ThemePrepared,
  Button, Input, Text
} from "@stardust-ui/react";
import TeamsBaseComponent, { ITeamsBaseComponentProps, ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

export interface IVideoSelectorTaskModuleState extends ITeamsBaseComponentState {
  teamsTheme: ThemePrepared;
  youTubeVideoId?: string;
}

export interface IVideoSelectorTaskModuleProps extends ITeamsBaseComponentProps {
}

export class VideoSelectorTaskModule extends TeamsBaseComponent<IVideoSelectorTaskModuleProps, IVideoSelectorTaskModuleState> {
  public componentWillMount(): void {
    this.updateStardustTheme(this.getQueryVariable("theme"));
    this.setState(Object.assign({}, this.state, {
      youTubeVideoId: this.getQueryVariable("vid")
    }));

    if (this.inTeams()) {
      microsoftTeams.initialize();
      microsoftTeams.registerOnThemeChangeHandler(this.updateStardustTheme);
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

  private updateStardustTheme = (teamsTheme: string = "default"): void => {
    let stardustTheme: ThemePrepared;

    switch (teamsTheme) {
      case "default":
        stardustTheme = themes.teams;
        break;
      case "dark":
        stardustTheme = themes.teamsDark;
        break;
      case "contrast":
        stardustTheme = themes.teamsHighContrast;
        break;
      default:
        stardustTheme = themes.teams;
        break;
    }
    // update the state
    this.setState(Object.assign({}, this.state, {
      teamsTheme: stardustTheme
    }));
  }
}
