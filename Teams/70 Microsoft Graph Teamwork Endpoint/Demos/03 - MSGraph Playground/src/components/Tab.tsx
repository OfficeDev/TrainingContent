// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import { Avatar, Loader, List, Button } from '@fluentui/react-northstar'
import { WordIcon, ExcelIcon } from "@fluentui/react-icons-northstar";

/**
 * This tab component renders the main tab content
 * of your app.
 */

export interface ITabProps {

}
interface ITabState {
  context?: microsoftTeams.Context;
  ssoToken: string;
  consentRequired: boolean;
  consentProvided: boolean;
  graphAccessToken: string;
  photo: string;
  joinedTeams: [];
  error: boolean;
}
class Tab extends React.Component<ITabProps, ITabState> {

  constructor(props: ITabProps){
    super(props)
    this.state = {
      context: undefined,
      ssoToken: "",
      consentRequired: false,
      consentProvided: false,
      graphAccessToken: "",
      photo: "",
      joinedTeams: [],
      error: false
    }

    //Bind any functions that need to be passed as callbacks or used to React components
    this.ssoLoginSuccess = this.ssoLoginSuccess.bind(this);
    this.ssoLoginFailure = this.ssoLoginFailure.bind(this);
    this.consentSuccess = this.consentSuccess.bind(this);
    this.consentFailure = this.consentFailure.bind(this);
    this.unhandledFetchError = this.unhandledFetchError.bind(this);
    this.callGraphFromClient = this.callGraphFromClient.bind(this);
    this.showConsentDialog = this.showConsentDialog.bind(this);
  }

  //React lifecycle method that gets called once a component has finished mounting
  //Learn more: https://reactjs.org/docs/react-component.html#componentdidmount
  componentDidMount(){
    // Initialize the Microsoft Teams SDK
    microsoftTeams.initialize();

    // Get the user context from Teams and set it in the state
    microsoftTeams.getContext((context: microsoftTeams.Context) => {
      this.setState({context:context});
    });

    //Perform Azure AD single sign-on authentication
    let authTokenRequestOptions = {
      successCallback: (result: string) => { this.ssoLoginSuccess(result) }, //The result variable is the SSO token.
      failureCallback: (error: string) => {this.ssoLoginFailure(error)}
    };

    microsoftTeams.authentication.getAuthToken(authTokenRequestOptions);
  }  

  ssoLoginSuccess = async (result: string) => {
    this.setState({ssoToken:result});
    this.exchangeClientTokenForServerToken(result);
  }

  ssoLoginFailure(error: string){
    console.error("SSO failed: ",error);
    this.setState({error:true});
  }

  //Exchange the SSO access token for a Graph access token
  //Learn more: https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow
  exchangeClientTokenForServerToken = async (token: string) => {

    let serverURL = `${process.env.REACT_APP_BASE_URL}/getGraphAccessToken?ssoToken=${token}`;
    console.log('here ' + serverURL);
    let response = await fetch(serverURL).catch(this.unhandledFetchError); //This calls getGraphAccessToken route in /api-server/app.js
    if (response) {
      let data = await response.json().catch(this.unhandledFetchError);

      if(!response.ok && data.error==='consent_required'){
        //A consent_required error means it's the first time a user is logging into to the app, so they must consent to sharing their Graph data with the app.
        //They may also see this error if MFA is required.
        this.setState({consentRequired:true}); //This displays the consent required message.
        this.showConsentDialog(); //Proceed to show the consent dialogue.
      } else if (!response.ok) {
        //Unknown error
        console.error(data);
        this.setState({error:true});
      } else {
        //Server side token exchange worked. Save the access_token to state, so that it can be picked up and used by the componentDidMount lifecycle method.
        this.setState({graphAccessToken:data['access_token']});
      }
    }
  }

  //Show a popup dialogue prompting the user to consent to the required API permissions. This opens ConsentPopup.js.
  //Learn more: https://docs.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/authentication/auth-tab-aad#initiate-authentication-flow
  showConsentDialog(){ 

    microsoftTeams.authentication.authenticate({
      url: window.location.origin + "/auth-start",
      width: 600,
      height: 535,
      successCallback: (result) => {this.consentSuccess(result ?? "")},
      failureCallback: (reason) => {this.consentFailure(reason ?? "")}
    });
  }

  //Callback function for a successful authorization
  consentSuccess(result: string){
    //Save the Graph access token in state
    this.setState({
      graphAccessToken: result,
      consentProvided: true
    });
  }

  consentFailure(reason: string){
    console.error("Consent failed: ",reason);
    this.setState({error:true});
  }  

  //React lifecycle method that gets called after a component's state or props updates
  //Learn more: https://reactjs.org/docs/react-component.html#componentdidupdate
  componentDidUpdate = async (prevProps: ITabProps, prevState: ITabState) => {
    
    //Check to see if a Graph access token is now in state AND that it didn't exist previously
    if((prevState.graphAccessToken === "") && (this.state.graphAccessToken !== "")){
      this.callGraphFromClient();
      this.getUsersJoinedTeams();
    }
  }

  getUsersJoinedTeams = async () => {
    let endpoint = `https://graph.microsoft.com/v1.0/me/joinedTeams`;
    let graphRequestParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'image/jpg',
        "authorization": "bearer " + this.state.graphAccessToken
      }
    }

    // submit request to Microsoft Graph
    let response = await fetch(endpoint,graphRequestParams).catch(this.unhandledFetchError);

    // process response
    if (response) {
      if(!response.ok){
        console.error("ERROR: ", response);
        this.setState({error:true});
      }

      this.setState({ joinedTeams: (await response.json()).value });
    }
  }

  // Fetch the user's profile photo from Graph using the access token retrieved either from the server 
  // or microsoftTeams.authentication.authenticate
  callGraphFromClient = async () => {
    let upn = this.state.context?.upn;
    let graphPhotoEndpoint = `https://graph.microsoft.com/v1.0/users/${upn}/photo/$value`;
    let graphRequestParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'image/jpg',
        "authorization": "bearer " + this.state.graphAccessToken
      }
    }

    let response = await fetch(graphPhotoEndpoint,graphRequestParams).catch(this.unhandledFetchError);
    if (response) {
      if(!response.ok){
        console.error("ERROR: ", response);
        this.setState({error:true});
      }
      
      let imageBlog = await response.blob().catch(this.unhandledFetchError); //Get image data as raw binary data
  
      this.setState({
        photo: URL.createObjectURL(imageBlog) //Convert binary data to an image URL and set the url in state
      })
    }
  }

  //Generic error handler ( avoids having to do async fetch in try/catch block )
  unhandledFetchError(err: string){
    console.error("Unhandled fetch error: ",err);
    this.setState({error:true});
  }

  _handleWordOnClick = async () => {
    let endpoint = `https://graph.microsoft.com/v1.0/teams/${this.state.context?.groupId}/channels/${this.state.context?.channelId}/tabs`;
    let graphRequestParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authorization": "bearer " + this.state.graphAccessToken
      },
      body: JSON.stringify({
        "displayName": "Word",
        "teamsApp@odata.bind" : "https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/com.microsoft.teamspace.tab.file.staticviewer.word",
        "configuration": {
           "entityId": "5E12B0DE-AD44-43D3-BD00-53C9BDD5609D",
           "contentUrl": "https://m365x285179.sharepoint.com/sites/TestTeam/Shared%20Documents/document.docx",
           "removeUrl": null,
           "websiteUrl": null
        }
      })
    };

    // submit request to Microsoft Graph
    let response = await fetch(endpoint, graphRequestParams).catch(this.unhandledFetchError);

    if (response) {
      if (!response.ok){
        console.error("ERROR: ", response);
        this.setState({error:true});
      } else {
        endpoint = `https://graph.microsoft.com/beta/teams/${this.state.context?.groupId}/sendActivityNotification`;
        graphRequestParams = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "authorization": "bearer " + this.state.graphAccessToken
          },
          body: JSON.stringify({
            "topic": {
                "source": "entityUrl",
                "value": `https://graph.microsoft.com/beta/teams/${this.state.context?.groupId}`
            },
            "activityType": "userMention",
            "previewText": {
              "content": "New tab created"
            },
            "recipient": {
                "@odata.type": "microsoft.graph.aadUserNotificationRecipient",
                "userId": "97c431bf-2437-4154-acee-6865979eed54"
            },
            "templateParameters": [
                {
                    "name": "tabName",
                    "value": "Word"
                },
                {
                    "name": "teamName",
                    "value": `${this.state.context?.teamName}`
                },
                {
                    "name": "channelName",
                    "value": `${this.state.context?.channelName}`
                }
            ]
          })
        };
    
        // submit request to Microsoft Graph
        await fetch(endpoint, graphRequestParams).catch(this.unhandledFetchError);
      }
    }
  }

  _handleExcelOnClick = async () => {
    let endpoint = `https://graph.microsoft.com/v1.0/teams/${this.state.context?.groupId}/channels/${this.state.context?.channelId}/tabs`;
    let graphRequestParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authorization": "bearer " + this.state.graphAccessToken
      },
      body: JSON.stringify({
        "displayName": "Excel",
        "teamsApp@odata.bind" : "https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/com.microsoft.teamspace.tab.file.staticviewer.excel",
        "configuration": {
           "entityId": "69CED411-A6EE-4B31-BA4C-18360D017307",
           "contentUrl": "https://m365x285179.sharepoint.com/sites/TestTeam/Shared Documents/General/workbook.xlsx",
           "removeUrl": null,
           "websiteUrl": null
        }
      })
    };

    // submit request to Microsoft Graph
    let response = await fetch(endpoint, graphRequestParams).catch(this.unhandledFetchError);

    if (response) {
      if(!response.ok){
        console.error("ERROR: ", response);
        this.setState({error:true});
      }
    }
  }

  render() {

      let title = this.state.context && Object.keys(this.state.context).length > 0 ?
        'Congratulations ' + this.state.context['upn'] + '! This is your tab' : <Loader/>;

      let ssoMessage = this.state.ssoToken === "" ?
        <Loader label='Performing Azure AD single sign-on authentication...'/>: null;

      let serverExchangeMessage = (this.state.ssoToken !== "") && (!this.state.consentRequired) && (this.state.photo==="") ?
        <Loader label='Exchanging SSO access token for Graph access token...'/> : null;

      let consentMessage = (this.state.consentRequired && !this.state.consentProvided) ?
        <Loader label='Consent required.'/> : null;

      let avatar = this.state.photo !== "" ?
        <Avatar image={this.state.photo} size='largest'/> : null;

      let joinedTeams = this.state.joinedTeams.length > 0
        ? this.state.joinedTeams.map((joinedTeam: any) => ({
            key: joinedTeam.id,
            header: joinedTeam.displayName,
            content: `Team ID: ${joinedTeam.id}`
          }))
        : [];

      let content;
      if(this.state.error){
        content = <h1>ERROR: Please ensure pop-ups are allowed for this website and retry</h1>
      } else {
        content =
          <div>
            <h1>{title}</h1>
            <h3>{ssoMessage}</h3>
            <h3>{serverExchangeMessage}</h3>
            <h3>{consentMessage}</h3>
            <h1>{avatar}</h1>
            <h2>This user belongs to the following teams:</h2>
            <List items={joinedTeams} />
            <Button icon={<WordIcon />} content="Add Word tab" onClick={this._handleWordOnClick} />
            <Button icon={<ExcelIcon />} content="Add Excel tab" onClick={this._handleExcelOnClick} />
          </div>
      }
      
      return (
        <div>
          {content}
        </div>
      );
  }
}
export default Tab;