import * as React from "react";
import { Provider, Flex, Text, Button, Header, List } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import { EmailIcon } from "@fluentui/react-icons-northstar";
import * as MicrosoftGraphClient from "@microsoft/microsoft-graph-client";
import * as MicrosoftGraph from "microsoft-graph";

/**
 * Implementation of the LearnAuthTab content page
 */
export const LearnAuthTab = () => {

  const msGraphClient: MicrosoftGraphClient.Client = MicrosoftGraphClient.Client.init({
    authProvider: async (done) => {
      if (!accessToken) {
        const token = await getAccessToken();
        setAccessToken(token);
      }
      done(null, accessToken);
    }
  });

  const [{ inTeams, theme, context }] = useTeams();
  const [entityId, setEntityId] = useState<string | undefined>();
  const [accessToken, setAccessToken] = useState<string>("");
  const [messages, setMessages] = useState<MicrosoftGraph.Message[]>([]);



  useEffect(() => {
    if (inTeams === true) {
      microsoftTeams.appInitialization.notifySuccess();
    } else {
      setEntityId("Not in Microsoft Teams");
    }
  }, [inTeams]);

  useEffect(() => {
    if (context) {
      setEntityId(context.entityId);
    }
  }, [context]);

  const getMessages = async (promptConsent: boolean = false): Promise<void> => {
    if (promptConsent || accessToken === "") {
      await signin(promptConsent);
    }

    msGraphClient
      .api("me/messages")
      .select(["receivedDateTime", "subject"])
      .top(15)
      .get(async (error: any, rawMessages: any, rawResponse?: any) => {
        if (!error) {
          setMessages(rawMessages.value);
          Promise.resolve();
        } else {
          //console.error("graph error", error);
          // re-sign in but this time force consent
          //await getMessages(true);
          Promise.reject(error);
        }
      });
  }

  const signin = async (promptConsent: boolean = false): Promise<void> => {
    const token = await getAccessToken(promptConsent);
    setAccessToken(token);
    Promise.resolve();
  }

  const getAccessToken = async (promptConsent: boolean = false): Promise < string > => {
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

  const handleGetMyMessagesOnClick = async (event): Promise<void> => {
    await getMessages();
  };

  /**
   * The render() method to create the UI of the tab
   */
  return (
    <Provider theme={theme}>
      <Flex column gap="gap.small">
        <Header>Recent messages in current user's mailbox</Header>
        <Button primary
          content="Get My Messages"
          onClick={handleGetMyMessagesOnClick}></Button>
        <List selectable>
          {
            messages.map((message, i) => (
              <List.Item media={<EmailIcon></EmailIcon>}
                header={message.receivedDateTime}
                content={message.subject} index={i}>
              </List.Item>
            ))
          }
        </List>
      </Flex>
    </Provider>
  );
};
