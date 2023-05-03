import * as React from "react";
import {
  Provider,
  Flex,
  Text,
  Button,
  Header,
  List
} from "@fluentui/react-northstar";
import { useState, useEffect, useCallback } from "react";
import { useTeams } from "msteams-react-base-component";
import { app, authentication } from "@microsoft/teams-js";
import jwtDecode from "jwt-decode";

/**
 * Implementation of the SSO Tab content page
 */
export const SsoTab = () => {

  const [{ inTeams, theme, context }] = useTeams();
  const [entityId, setEntityId] = useState<string | undefined>();
  const [name, setName] = useState<string>();
  const [error, setError] = useState<string>();
  const [ssoToken, setSsoToken] = useState<string>();
  const [msGraphOboToken, setMsGraphOboToken] = useState<string>();
  const [recentMail, setRecentMail] = useState<any[]>();

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

  const getRecentEmails = useCallback(async () => {
    if (!msGraphOboToken) { return; }

    const endpoint = "https://graph.microsoft.com/v1.0/me/messages?$select=receivedDateTime,subject&$orderby=receivedDateTime&$top=10";
    const requestObject = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + msGraphOboToken
      }
    };

    const response = await fetch(endpoint, requestObject);
    const responsePayload = await response.json();

    if (response.ok) {
      const recentMail = responsePayload.value.map((mail: any) => ({
        key: mail.id,
        header: mail.subject,
        headerMedia: mail.receivedDateTime
      }));
      setRecentMail(recentMail);
    }
  }, [msGraphOboToken]);

  useEffect(() => {
    if (inTeams === true) {
      authentication.getAuthToken({
        resources: [process.env.TAB_APP_URI as string],
        silent: false
      } as authentication.AuthTokenRequestParameters).then(token => {
        const decoded: { [key: string]: any; } = jwtDecode(token) as { [key: string]: any; };
        setName(decoded!.name);
        app.notifySuccess();
        setSsoToken(token);
      }).catch(message => {
        setError(message);
        app.notifyFailure({
          reason: app.FailedReason.AuthFailed,
          message
        });
      });
    } else {
      setEntityId("Not in Microsoft Teams");
    }
  }, [inTeams]);

  useEffect(() => {
    if (context) {
      setEntityId(context.page.id);
    }
  }, [context]);

  useEffect(() => {
    // if the SSO token is defined...
    if (ssoToken && ssoToken.length > 0) {
      exchangeSsoTokenForOboToken();
    }
  }, [exchangeSsoTokenForOboToken, ssoToken]);

  useEffect(() => {
    getRecentEmails();
  }, [getRecentEmails, msGraphOboToken]);

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
            {recentMail && <div><h3>Your recent emails:</h3><List items={recentMail} /></div>}
            {error && <div><Text content={`An SSO error occurred ${error}`} /></div>}

            <div>
              <Button onClick={() => alert("It worked!")}>A sample button</Button>
            </div>
          </div>
        </Flex.Item>
        <Flex.Item styles={{
          padding: ".8rem 0 .8rem .5rem"
        }}>
          <Text size="smaller" content="(C) Copyright Contoso" />
        </Flex.Item>
      </Flex>
    </Provider>
  );
};
