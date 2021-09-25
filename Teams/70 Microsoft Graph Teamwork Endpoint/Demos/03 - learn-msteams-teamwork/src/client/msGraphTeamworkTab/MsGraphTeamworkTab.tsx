import * as React from "react";
import { Provider, Flex, Text, Button, Header, Avatar, List } from "@fluentui/react-northstar";
import { WordIcon, ExcelIcon } from "@fluentui/react-icons-northstar";
import { useState, useEffect, useCallback } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import jwtDecode from "jwt-decode";

/**
 * Implementation of the MSGraph Teamwork content page
 */
export const MsGraphTeamworkTab = () => {

  const [{ inTeams, theme, context }] = useTeams();
  const [entityId, setEntityId] = useState<string | undefined>();
  const [name, setName] = useState<string>();
  const [error, setError] = useState<string>();
  const [ssoToken, setSsoToken] = useState<string>();
  const [msGraphOboToken, setMsGraphOboToken] = useState<string>();
  const [photo, setPhoto] = useState<string>();
  const [joinedTeams, setJoinedTeams] = useState<any[]>();

  useEffect(() => {
    if (inTeams === true) {
      microsoftTeams.authentication.getAuthToken({
        successCallback: (token: string) => {
          const decoded: { [key: string]: any; } = jwtDecode(token) as { [key: string]: any; };
          setName(decoded!.name);
          setSsoToken(token);
          microsoftTeams.appInitialization.notifySuccess();
        },
        failureCallback: (message: string) => {
          setError(message);
          microsoftTeams.appInitialization.notifyFailure({
            reason: microsoftTeams.appInitialization.FailedReason.AuthFailed,
            message
          });
        },
        resources: [process.env.TAB_APP_URI as string]
      });
    } else {
      setEntityId("Not in Microsoft Teams");
    }
  }, [inTeams]);

  useEffect(() => {
    if (context) {
      setEntityId(context.entityId);
    }
  }, [context]);

  const exchangeSsoTokenForOboToken = useCallback(async () => {
    const response = await fetch(`/exchangeSsoTokenForOboToken/?ssoToken=${ssoToken}`);
    const responsePayload = await response.json();
    if (response.ok) {
      setMsGraphOboToken(responsePayload.access_token);
    } else {
      if (responsePayload!.error === "consent_required") {
        setError("consent_required");
      } else {
        setError("unknown SSO error");
      }
    }
  }, [ssoToken]);

  useEffect(() => {
    // if the SSO token is defined...
    if (ssoToken && ssoToken.length > 0) {
      exchangeSsoTokenForOboToken();
    }
  }, [exchangeSsoTokenForOboToken, ssoToken]);

  const getProfilePhoto = useCallback(async () => {
    if (!msGraphOboToken) { return; }
    const endpoint = "https://graph.microsoft.com/v1.0/me/photo/$value";
    const requestObject = {
      method: "GET",
      headers: {
        accept: "image/jpg",
        authorization: `bearer ${msGraphOboToken}`
      }
    };
    const response = await fetch(endpoint, requestObject);
    if (response.ok) {
      setPhoto(URL.createObjectURL(await response.blob()));
    }
  }, [msGraphOboToken]);

  const getJoinedTeams = useCallback(async () => {
    if (!msGraphOboToken) { return; }
    const endpoint = "https://graph.microsoft.com/v1.0/me/joinedTeams";
    const requestObject = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `bearer ${msGraphOboToken}`
      }
    };
    const response = await fetch(endpoint, requestObject);
    const responsePayload = await response.json();
    if (response.ok) {
      const listFriendlyJoinedTeams = responsePayload.value.map((team: any) => ({
        key: team.id,
        header: team.displayName,
        content: `Team ID: ${team.id}`
      }));
      setJoinedTeams(listFriendlyJoinedTeams);
    }
  }, [msGraphOboToken]);

  useEffect(() => {
    getJoinedTeams();
    getProfilePhoto();
  }, [getJoinedTeams, getProfilePhoto, msGraphOboToken]);

  const sendActivityMessage = useCallback(async () => {
    if (!msGraphOboToken || !context) { return; }

    const endpoint = `https://graph.microsoft.com/v1.0/teams/${context.groupId}/sendActivityNotification`;
    const requestObject = {
      method: "POST",
      headers: {
        authorization: `bearer ${msGraphOboToken}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        topic: {
          source: "entityUrl",
          value: `https://graph.microsoft.com/v1.0/teams/${context.groupId}`
        },
        activityType: "userMention",
        previewText: {
          content: "New tab created"
        },
        recipient: {
          "@odata.type": "microsoft.graph.aadUserNotificationRecipient",
          userId: "81d62de1-0263-438d-b17b-a31313403e31"
        },
        templateParameters: [
          { name: "tabName", value: "Word" },
          { name: "teamName", value: `${context.teamName}` },
          { name: "channelName", value: `${context.channelName}` }
        ]
      })
    };

    await fetch(endpoint, requestObject);
  }, [context, msGraphOboToken]);

  const handleWordOnClick = useCallback(async () => {
    if (!msGraphOboToken || !context) { return; }

    const endpoint = `https://graph.microsoft.com/v1.0/teams/${context.groupId}/channels/${context.channelId}/tabs`;
    const requestObject = {
      method: "POST",
      headers: {
        authorization: `bearer ${msGraphOboToken}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        displayName: "Word",
        "teamsApp@odata.bind": "https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/com.microsoft.teamspace.tab.file.staticviewer.word",
        configuration: {
          entityId: "CA2E9D19-3FE7-4E60-82DF-F73BD3B8D302",
          contentUrl: "https://scdev.sharepoint.com/sites/Learn22Q1/Shared%20Documents/General/document.docx",
          removeUrl: null,
          websiteUrl: null
        }
      })
    };

    await fetch(endpoint, requestObject);

    await sendActivityMessage();
  }, [context, msGraphOboToken, sendActivityMessage]);

  const handleExcelOnClick = useCallback(async () => {
    if (!msGraphOboToken || !context) { return; }

    const endpoint = `https://graph.microsoft.com/v1.0/teams/${context.groupId}/channels/${context.channelId}/tabs`;
    const requestObject = {
      method: "POST",
      headers: {
        authorization: `bearer ${msGraphOboToken}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        displayName: "Excel",
        "teamsApp@odata.bind": "https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/com.microsoft.teamspace.tab.file.staticviewer.excel",
        configuration: {
          entityId: "2A451F2C-5BC0-4EEF-B986-671705798A54",
          contentUrl: "https://scdev.sharepoint.com/sites/Learn22Q1/Shared%20Documents/document.docx",
          removeUrl: null,
          websiteUrl: null
        }
      })
    };

    await fetch(endpoint, requestObject);
  }, [context, msGraphOboToken]);

  /**
   * The render() method to create the UI of the tab
   */
  return (
    <Provider theme={theme}>
      <Flex fill={true} column styles={{
        padding: ".8rem 0 .8rem .5rem"
      }}>
        <Flex.Item>
          <Header content="This is your tab" />
        </Flex.Item>
        <Flex.Item>
          <div>
            <div>
              <Text content={`Hello ${name}`} />
            </div>

            {photo && <div><Avatar image={photo} size='largest' /></div>}

            {joinedTeams && <div><h3>You belong to the following teams:</h3><List items={joinedTeams} /></div>}

            <Button icon={<WordIcon />} content="Add Word tab" onClick={handleWordOnClick} />
            <Button icon={<ExcelIcon />} content="Add Excel tab" onClick={handleExcelOnClick} />

            {error && <div><Text content={`An SSO error occurred ${error}`} /></div>}

            <div>
              <Button onClick={() => alert("It worked!")}>A sample button</Button>
            </div>
          </div>
        </Flex.Item>
        <Flex.Item styles={{
          padding: ".8rem 0 .8rem .5rem"
        }}>
          <Text size="smaller" content="(C) Copyright Office Developer" />
        </Flex.Item>
      </Flex>
    </Provider>
  );
};
