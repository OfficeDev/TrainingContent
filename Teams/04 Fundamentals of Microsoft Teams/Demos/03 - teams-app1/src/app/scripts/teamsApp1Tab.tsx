import * as React from 'react';
import {
  PrimaryButton,
  TeamsComponentContext,
  ConnectedComponent,
  Panel,
  PanelBody,
  PanelHeader,
  PanelFooter,
  Surface
} from 'msteams-ui-components-react';
import { render } from 'react-dom';
import TeamsBaseComponent, { ITeamsBaseComponentProps, ITeamsBaseComponentState } from 'msteams-react-base-component'
import * as microsoftTeams from '@microsoft/teams-js';

/**
 * State for the teamsApp1TabTab React component
 */
export interface IteamsApp1TabState extends ITeamsBaseComponentState {
  entityId?: string;
  graphData?: string;
}

/**
 * Properties for the teamsApp1TabTab React component
 */
export interface IteamsApp1TabProps extends ITeamsBaseComponentProps {

}

/**
 * Implementation of the teams app1 Tab content page
 */
export class teamsApp1Tab extends TeamsBaseComponent<IteamsApp1TabProps, IteamsApp1TabState> {
  configuration?: string;
  groupId?: string;
  token?: string;

  public componentWillMount() {
    this.updateTheme(this.getQueryVariable('theme'));
    this.setState({
      fontSize: this.pageFontSize()
    });

    if (this.inTeams()) {
      microsoftTeams.initialize();
      microsoftTeams.registerOnThemeChangeHandler(this.updateTheme);
      microsoftTeams.getContext((context) => {
        this.configuration = context.entityId;
        this.groupId = context.groupId;
      });
    } else {
      this.setState({
        entityId: "This is not hosted in Microsoft Teams"
      });
    }
  }

  private getGraphData() {
    let token = "";
    this.setState({ graphData: "Loading..." });
    // let graphElement = document.getElementById("graph");
    // graphElement!.innerText = "Loading...";
    if (token == "") {
      microsoftTeams.authentication.authenticate({
        url: "/auth.html",
        width: 400,
        height: 400,
        successCallback: (data) => {
          // Note: token is only good for one hour
          token = data!;
          this.getData(token);
        },
        failureCallback: function (err) {
          document.getElementById("graph")!.innerHTML = "Failed to authenticate and get token.<br/>" + err;
        }
      });
    }
    else {
      this.getData(token);
    }
  }

  public getData(token: string) {
    let graphEndpoint = "https://graph.microsoft.com/v1.0/me";
    if (this.configuration === "GRP") {
      graphEndpoint = "https://graph.microsoft.com/v1.0/groups/" + this.groupId;
    }

    var req = new XMLHttpRequest();
    req.open("GET", graphEndpoint, false);
    req.setRequestHeader("Authorization", "Bearer " + token);
    req.setRequestHeader("Accept", "application/json;odata.metadata=minimal;");
    req.send();
    var result = JSON.parse(req.responseText);
    //this.setState({graphData: result});
    //document.getElementById("graph")!.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
    this.setState({ graphData: JSON.stringify(result, null, 2) });
  }

  /**
   * The render() method to create the UI of the tab
   */
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
            footer: { ...sizes.xsmall }
          };

          return (
            <Surface>
              <Panel>
                <PanelHeader>
                  <div style={styles.header}>This is your tab</div>
                </PanelHeader>
                <PanelBody>
                  <div style={styles.section}>
                    {this.state.graphData}
                  </div>
                  <div style={styles.section}>
                    <PrimaryButton onClick={() => this.getGraphData()}>Get Microsoft Graph data</PrimaryButton>
                  </div>
                </PanelBody>
                <PanelFooter>
                  <div style={styles.footer}>
                    (C) Copyright Office Developer
                                    </div>
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
