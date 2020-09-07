import * as React from "react";
import {
  Provider,
  Flex,
  Text,
  Button,
  Header,
  ThemePrepared,
  themes,
  List
} from "@fluentui/react-northstar";
import { EmailIcon } from "@fluentui/react-icons-northstar";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import * as MicrosoftGraphClient from "@microsoft/microsoft-graph-client";
import * as MicrosoftGraph from "microsoft-graph";

/**
 * State for the learnAuthTabTab React component
 */
export interface ILearnAuthTabState extends ITeamsBaseComponentState {
  entityId?: string;
  teamsTheme: ThemePrepared;
  accessToken: string;
  messages: MicrosoftGraph.Message[];}

/**
 * Properties for the learnAuthTabTab React component
 */
export interface ILearnAuthTabProps {

}

/**
 * Implementation of the LearnAuthTab content page
 */
export class LearnAuthTab extends TeamsBaseComponent<ILearnAuthTabProps, ILearnAuthTabState> {

  private msGraphClient: MicrosoftGraphClient.Client;

  constructor(props: ILearnAuthTabProps, state: ILearnAuthTabState) {
    super(props, state);

    state.messages = [];
    state.accessToken = "";

    this.state = state;
  }

  public async componentWillMount() {
    this.updateComponentTheme(this.getQueryVariable("theme"));


    if (await this.inTeams()) {
      microsoftTeams.initialize();
      microsoftTeams.registerOnThemeChangeHandler(this.updateComponentTheme);
      microsoftTeams.getContext((context) => {
        microsoftTeams.appInitialization.notifySuccess();
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

    // init the graph client
    this.msGraphClient = MicrosoftGraphClient.Client.init({
      authProvider: async (done) => {
        if (!this.state.accessToken) {
          const token = await this.getAccessToken();
          this.setState({
            accessToken: token
          });
        }
        done(null, this.state.accessToken);
      }
    });
  }

  /**
   * The render() method to create the UI of the tab
   */
  public render() {
    return (
      <Provider theme={themes.teams}>
        <Flex column gap="gap.small">
          <Header>Recent messages in current user's mailbox</Header>
          <Button primary
            content="Get My Messages"
            onClick={this.handleGetMyMessagesOnClick}></Button>
          <List selectable>
            {
              this.state.messages.map(message => (
                <List.Item media={<EmailIcon></EmailIcon>}
                  header={message.receivedDateTime}
                  content={message.subject}>
                </List.Item>
              ))
            }
          </List>
        </Flex>
      </Provider>
    );
  }

  private async getMessages(promptConsent: boolean = false): Promise<void> {
    if (promptConsent || this.state.accessToken === "") {
      await this.signin(promptConsent);
    }

    this.msGraphClient
      .api("me/messages")
      .select(["receivedDateTime", "subject"])
      .top(15)
      .get(async (error: any, rawMessages: any, rawResponse?: any) => {
        if (!error) {
          this.setState(Object.assign({}, this.state, {
            messages: rawMessages.value
          }));
          Promise.resolve();
        } else {
          console.error("graph error", error);
          // re-sign in but this time force consent
          await this.getMessages(true);
        }
      });
  }

  private async signin(promptConsent: boolean = false): Promise<void> {
    const token = await this.getAccessToken(promptConsent);

    this.setState({
      accessToken: token
    });

    Promise.resolve();
  }

  private async getAccessToken(promptConsent: boolean = false): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      microsoftTeams.authentication.authenticate({
        url: window.location.origin + "/auth-start.html",
        width: 600,
        height: 535,
        successCallback: (accessToken: string) => {
          resolve(accessToken);
        },
        failureCallback: (reason) => {
          reject(reason);
        }
      });
    });
  }

  private handleGetMyMessagesOnClick = async (event): Promise<void> => {
    await this.getMessages();
  }

  private updateComponentTheme = (teamsTheme: string = "default"): void => {
    let componentTheme: ThemePrepared;

    switch (teamsTheme) {
      case "default":
        componentTheme = themes.teams;
        break;
      case "dark":
        componentTheme = themes.teamsDark;
        break;
      case "contrast":
        componentTheme = themes.teamsHighContrast;
        break;
      default:
        componentTheme = themes.teams;
        break;
    }
    // update the state
    this.setState(Object.assign({}, this.state, {
      teamsTheme: componentTheme
    }));
  }
}
