import * as React from "react";
import { Provider, Flex, Text, Button, Header, Input } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams, getQueryVariable } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

export const VideoSelectorTaskModule = () => {

  const [{ inTeams, theme, context }] = useTeams();
  const [entityId, setEntityId] = useState<string | undefined>();
  const [youTubeVideoId, setYouTubeVideoId] = useState<string | undefined>("VlEH4vtaxp4");

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
      setYouTubeVideoId(getQueryVariable("vid"));
    }
  }, [context]);

  const handleOnChanged = (event): void => {
    setYouTubeVideoId(event.target.value);
  };

  const handleOnClick = (): void => {
    microsoftTeams.tasks.submitTask(youTubeVideoId, undefined);
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
