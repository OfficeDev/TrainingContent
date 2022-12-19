import * as React from "react";
import { Provider, Flex, Text, Button, Header, List } from "@fluentui/react-northstar";
import { EmailIcon } from "@fluentui/react-icons-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import { app, authentication } from "@microsoft/teams-js";
import * as MicrosoftGraphClient from "@microsoft/microsoft-graph-client";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";

/**
 * Implementation of the LearnAuthTab content page
 */
export const LearnAuthTab = () => {

    const [{ inTeams, theme, context }] = useTeams();
    const [entityId, setEntityId] = useState<string | undefined>();
    const [messages, setMessages] = useState<MicrosoftGraph.Message[]>([]);

    useEffect(() => {
        if (inTeams === true) {
            app.notifySuccess();
        } else {
            setEntityId("Not in Microsoft Teams");
        }
    }, [inTeams]);

    useEffect(() => {
        if (context) {
            setEntityId(context.page.id);
        }
    }, [context]);

    const handleGetMyMessagesOnClick = async (event): Promise<void> => {
      await getMessages();
    };

    const getMessages = async (promptConsent: boolean = false): Promise<void> => {
      const token = await getAccessToken();

      const msGraphClient: MicrosoftGraphClient.Client = MicrosoftGraphClient.Client.init({
        authProvider: async (done) => {
          done(null, token);
        }
      });

      msGraphClient
        .api("me/messages")
        .select(["receivedDateTime", "subject"])
        .top(15)
        .get(async (error: any, rawMessages: any, rawResponse?: any) => {
          if (!error) {
            setMessages(rawMessages.value);
            Promise.resolve();
          } else {
            console.error("graph error", error);
          }
        });
    };

    const getAccessToken = async (promptConsent: boolean = false): Promise<string> => {
      try {
        const accessToken = await authentication.authenticate({
          url: window.location.origin + "/auth-start.html",
          width: 600,
          height: 535
        });
        return Promise.resolve(accessToken);
      } catch (error) {
        return Promise.reject(error);
      }
    };

    /**
     * The render() method to create the UI of the tab
     */
    return (
      <Provider theme={theme}>
        <Flex column gap="gap.small">
          <Header>Recent messages in current user&apos;s mailbox</Header>
          <Button primary
                  content="Get My Messages"
                  onClick={handleGetMyMessagesOnClick}></Button>
          <List selectable>
            {
              messages.map((message, i) => (
                <List.Item key={i} media={<EmailIcon></EmailIcon>}
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
