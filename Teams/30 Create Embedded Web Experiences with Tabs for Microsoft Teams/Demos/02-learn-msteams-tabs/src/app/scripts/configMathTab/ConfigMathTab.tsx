// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as React from "react";
import {
  Flex, Provider, themes, ThemePrepared,
  Header,
  Button, Input, Text
} from "@stardust-ui/react";
import TeamsBaseComponent, { ITeamsBaseComponentProps, ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

/**
 * State for the configMathTabTab React component
 */
export interface IConfigMathTabState extends ITeamsBaseComponentState {
  teamsTheme: ThemePrepared;
  mathOperator?: string;
  operandA: number;
  operandB: number;
  result: string;
}

/**
 * Properties for the configMathTabTab React component
 */
export interface IConfigMathTabProps extends ITeamsBaseComponentProps {

}

/**
 * Implementation of the ConfigMathTab content page
 */
export class ConfigMathTab extends TeamsBaseComponent<IConfigMathTabProps, IConfigMathTabState> {

  public componentWillMount() {
    this.updateStardustTheme(this.getQueryVariable("theme"));

    if (this.inTeams()) {
      microsoftTeams.initialize();
      microsoftTeams.registerOnThemeChangeHandler(this.updateStardustTheme);
      microsoftTeams.getContext((context) => {
        this.setState(Object.assign({}, this.state, {
          mathOperator: context.entityId.replace("MathPage", "")
        }));
      });
    } else {
      this.setState(Object.assign({}, this.state, {
        mathOperator: "add"
      }));
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
          <Text content="Enter the values to calculate" size="medium"></Text>

          <Flex gap="gap.smaller">
            <Flex.Item>
              <Flex gap="gap.smaller">
                <Flex.Item>
                  <Input autoFocus
                         value={this.state.operandA}
                         onChange={this.handleOnChangedOperandA}></Input>
                </Flex.Item>
                <Text content={this.state.mathOperator}></Text>
                <Flex.Item>
                  <Input value={this.state.operandB}
                         onChange={this.handleOnChangedOperandB}></Input>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Button content="Calculate" primary
                    onClick={this.handleOperandChange}></Button>
            <Text content={this.state.result}></Text>
          </Flex>
          <Text content="(C) Copyright Contoso" size="smallest"></Text>
        </Flex>
      </Provider>
    );
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

  private handleOnChangedOperandA = (event): void => {
    this.setState(Object.assign({}, this.state, { operandA: event.target.value }));
  }

  private handleOnChangedOperandB = (event): void => {
    this.setState(Object.assign({}, this.state, { operandB: event.target.value }));
  }

  private handleOperandChange = (): void => {
    let stringResult: string = "n/a";

    if (!isNaN(Number(this.state.operandA)) && !isNaN(Number(this.state.operandB))) {
      switch (this.state.mathOperator) {
        case "add":
          stringResult = (Number(this.state.operandA) + Number(this.state.operandB)).toString();
          break;
        case "subtract":
          stringResult = (Number(this.state.operandA) - Number(this.state.operandB)).toString();
          break;
        case "multiply":
          stringResult = (Number(this.state.operandA) * Number(this.state.operandB)).toString();
          break;
        case "divide":
          stringResult = (Number(this.state.operandA) / Number(this.state.operandB)).toString();
          break;
        default:
          stringResult = "n/a";
          break;
      }
    }

    this.setState(Object.assign({}, this.state, {
      result: stringResult
    }));
  }
}
