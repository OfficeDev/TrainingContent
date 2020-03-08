// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as React from "react";
import { Provider, Flex, Text, Button, Header, ThemePrepared, themes, Alert, List, Icon, Label, Input } from "@fluentui/react";
import TeamsBaseComponent, { ITeamsBaseComponentProps, ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

/**
 * State for the learnPersonalTabTab React component
 */
export interface ILearnPersonalTabState extends ITeamsBaseComponentState {
  entityId?: string;
  teamsTheme: ThemePrepared;
  todoItems: string[];
  newTodoValue: string;
}

/**
 * Properties for the learnPersonalTabTab React component
 */
export interface ILearnPersonalTabProps extends ITeamsBaseComponentProps {

}

/**
 * Implementation of the LearnPersonalTab content page
 */
export class LearnPersonalTab extends TeamsBaseComponent<ILearnPersonalTabProps, ILearnPersonalTabState> {

  public componentWillMount() {
    this.updateComponentTheme(this.getQueryVariable("theme"));
    this.setState(Object.assign({}, this.state, {
      todoItems: ["Submit time sheet", "Submit expense report"],
      newTodoValue: ""
    }));

    if (this.inTeams()) {
      microsoftTeams.initialize();
      microsoftTeams.registerOnThemeChangeHandler(this.updateTheme);
      microsoftTeams.getContext((context) => {
        this.setState({
          entityId: context.entityId
        });
        this.updateTheme(context.theme);
      });
    } else {
      this.setState({
        entityId: "This is not hosted in Microsoft Teams"
      });
    }
  }

  /**
   * The render() method to create the UI of the tab
   */
  public render() {
    return (
      <Provider theme={this.state.teamsTheme}>
        <Flex column gap="gap.smaller">
          <Header>This is your tab</Header>
          <Alert icon="exclamation-triangle" content={this.state.entityId} dismissible></Alert>
          <Text content="These are your to-do items:" size="medium"></Text>
          <List selectable>
            {this.state.todoItems.map(todoItem => (
              <List.Item media={<Icon name="window-maximize outline"></Icon>}
                content={todoItem}>
              </List.Item>))
            }
          </List>

          <Flex gap="gap.medium">
            <Flex.Item grow>
              <Flex>
                <Label icon="to-do-list"
                  styles={{
                    background: "darkgray",
                    height: "auto",
                    padding: "0 15px"
                  }}></Label>
                <Flex.Item grow>
                  <Input placeholder="New todo item" fluid
                    value={this.state.newTodoValue}
                    onChange={this.handleOnChanged}></Input>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Button content="Add Todo" primary
              onClick={this.handleOnClick}></Button>
          </Flex>

          <Text content="(C) Copyright Contoso" size="smallest"></Text>
        </Flex>
      </Provider>
    );
  }

  private handleOnChanged = (event): void => {
    this.setState(Object.assign({}, this.state, {
      newTodoValue: event.target.value
    }));
  }

  private handleOnClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const newTodoItems = this.state.todoItems;
    newTodoItems.push(this.state.newTodoValue);

    this.setState(Object.assign({}, this.state, {
      todoItems: newTodoItems,
      newTodoValue: ""
    }));
  }

  private updateComponentTheme = (teamsTheme: string = "default"): void => {
    let theme: ThemePrepared;

    switch (teamsTheme) {
      case "default":
        theme = themes.teams;
        break;
      case "dark":
        theme = themes.teamsDark;
        break;
      case "contrast":
        theme = themes.teamsHighContrast;
        break;
      default:
        theme = themes.teams;
        break;
    }
    // update the state
    this.setState(Object.assign({}, this.state, {
      teamsTheme: theme
    }));
  }
}
