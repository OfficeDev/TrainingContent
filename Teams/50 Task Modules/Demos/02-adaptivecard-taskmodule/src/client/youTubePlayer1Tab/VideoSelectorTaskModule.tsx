import * as React from "react";
import { Provider, Flex, Text, Button, Header, Input } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import { app, dialog } from "@microsoft/teams-js";

export const VideoSelectorTaskModule = () => {

  const [{ inTeams, theme, context }] = useTeams();
  const [entityId, setEntityId] = useState<string | undefined>();
  const [youTubeVideoId, setYouTubeVideoId] = useState<string | undefined>("VlEH4vtaxp4");

  const getQueryVariable = (variable: string): string | undefined => {
      const query = window.location.search.substring(1);
      const vars = query.split("&");
      for (const varPairs of vars) {
          const pair = varPairs.split("=");
          if (decodeURIComponent(pair[0]) === variable) {
              return decodeURIComponent(pair[1]);
          }
      }
      return undefined;
  };

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
      setYouTubeVideoId(getQueryVariable("vid"));
    }
  }, [context]);

  const handleOnChanged = (event): void => {
    setYouTubeVideoId(event.target.value);
  };

  const handleOnClick = (): void => {
    dialog.submit(youTubeVideoId, undefined);
  };

  return (
    <Provider theme={theme}>
      <Flex column gap="gap.smaller">
        <Text size="medium">
          Enter the ID of a YouTube video to show in the task module player.
        </Text>
        <Input value={youTubeVideoId} onChange={(e) => handleOnChanged(e)}></Input>
        <Button content="Update" primary onClick={() => handleOnClick()}></Button>
      </Flex>
    </Provider>
  );
};
