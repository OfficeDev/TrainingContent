import * as React from "react";
import { Provider, Flex, Text, Button, Header, Input } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import { app, dialog, tasks } from "@microsoft/teams-js";

/**
 * Implementation of the YouTube Player content page
 */
export const YouTubePlayerTab = () => {

  const [{ inTeams, theme, context }] = useTeams();
  const [entityId, setEntityId] = useState<string | undefined>();
  const [youTubeVideoId, setYouTubeVideoId] = useState<string | undefined>("jugBQqE_2sM");

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

  const appRoot = (): string => {
    if (typeof window === "undefined") {
      return "https://{{HOSTNAME}}";
    } else {
      return window.location.protocol + "//" + window.location.host;
    }
  };

  const onChangeVideo = (): void => {
    // load adaptive card
    const adaptiveCard: any = require("./YouTubeSelectorCard.json");
    // update card with current video ID
    adaptiveCard.body.forEach((container: any) => {
      if (container.type === "Container") {
        container.items.forEach((item: any) => {
          if (item.id && item.id === "youTubeVideoId") {
            item.value = youTubeVideoId;
          }
        });
      }
    });

    const taskModuleInfo = {
      title: "YouTube Video Selector",
      card: adaptiveCard,
      width: 350,
      height: 250
    };

    const submitHandler = (err: string, result: any): void => {
      if (err) {
        console.log(err);
      }
      setYouTubeVideoId(result.youTubeVideoId);
    };

    tasks.startTask(taskModuleInfo, submitHandler);
  };

  const onShowVideo = (): void => {
    const dialogInfo = {
      title: "YouTube Player",
      url: appRoot() + `/youTubePlayerTab/player.html?vid=${youTubeVideoId}`,
      size: {
        width: 1000,
        height: 700
      }
    };
    dialog.open(dialogInfo);
  };

  /**
   * The render() method to create the UI of the tab
   */
  return (
    <Provider theme={theme}>
      <Flex fill={true} column styles={{
        padding: ".8rem 0 .8rem .5rem"
      }}>
        <Flex.Item>
          <Header>Task Module Demo</Header>
        </Flex.Item>
        <Flex.Item>
          <div>
            <div>
              <Text>YouTube Video ID:</Text>
              <Input value={youTubeVideoId} disabled></Input>
            </div>
            <div>
              <Button content="Change Video ID" onClick={onChangeVideo}></Button>
              <Button content="Show Video" primary onClick={onShowVideo}></Button>
            </div>
          </div>
        </Flex.Item>
        <Flex.Item styles={{
          padding: ".8rem 0 .8rem .5rem"
        }}>
          <Text content="(C) Copyright Contoso" size="smaller"></Text>
        </Flex.Item>
      </Flex>
    </Provider>
  );

};
