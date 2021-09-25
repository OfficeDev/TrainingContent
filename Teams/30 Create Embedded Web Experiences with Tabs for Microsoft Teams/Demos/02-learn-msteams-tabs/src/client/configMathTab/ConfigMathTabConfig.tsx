import * as React from "react";
import { Provider, Flex, Header, Input, DropdownProps, Dropdown } from "@fluentui/react-northstar";
import { useState, useEffect, useRef } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

/**
 * Implementation of ConfigMathTab configuration page
 */
export const ConfigMathTabConfig = () => {

  const [{ inTeams, theme, context }] = useTeams({});
  const [mathOperator, setMathOperator] = useState<string>();
  const entityId = useRef("");

  const onSaveHandler = (saveEvent: microsoftTeams.settings.SaveEvent) => {
    const host = "https://" + window.location.host;
    microsoftTeams.settings.setSettings({
      contentUrl: host + "/configMathTab/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}",
      websiteUrl: host + "/configMathTab/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}",
      suggestedDisplayName: "Config Math Tab",
      removeUrl: host + "/configMathTab/remove.html?theme={theme}",
      entityId: entityId.current
    });
    saveEvent.notifySuccess();
  };

  useEffect(() => {
    if (context) {
      setMathOperator(context.entityId.replace("MathPage", ""));
      entityId.current = context.entityId;
      microsoftTeams.settings.registerOnSaveHandler(onSaveHandler);
      microsoftTeams.settings.setValidityState(true);
      microsoftTeams.appInitialization.notifySuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  return (
    <Provider theme={theme}>
      <Flex gap="gap.smaller" style={{ height: "300px" }}>
        <Dropdown placeholder="Select the math operator"
          items={[
            "add",
            "subtract",
            "multiply",
            "divide"
          ]}
          onChange={(e, data) => {
            if (data) {
              let op = (data.value) ? data.value.toString() : "add";
              setMathOperator(op);
              entityId.current = `${op}MathPage`;
            }
          }}
          value={mathOperator}></Dropdown>
      </Flex>
    </Provider>
  );
};
