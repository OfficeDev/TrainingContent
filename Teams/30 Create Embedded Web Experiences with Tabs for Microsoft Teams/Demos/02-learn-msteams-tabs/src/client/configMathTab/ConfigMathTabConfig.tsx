import * as React from "react";
import { Provider, Flex, Header, Input, Dropdown } from "@fluentui/react-northstar";
import { useState, useEffect, useRef } from "react";
import { useTeams } from "msteams-react-base-component";
import { app, pages } from "@microsoft/teams-js";

/**
 * Implementation of ConfigMathTab configuration page
 */
export const ConfigMathTabConfig = () => {

  const [{ inTeams, theme, context }] = useTeams({});
  const [mathOperator, setMathOperator] = useState<string>();
  const entityId = useRef("");

  const onSaveHandler = (saveEvent: pages.config.SaveEvent) => {
    const host = "https://" + window.location.host;
    pages.config.setConfig({
      contentUrl: host + "/configMathTab/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}",
      websiteUrl: host + "/configMathTab/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}",
      suggestedDisplayName: "ConfigMathTab",
      removeUrl: host + "/configMathTab/remove.html?theme={theme}",
      entityId: entityId.current
    }).then(() => {
      saveEvent.notifySuccess();
    });
  };

  useEffect(() => {
    if (context) {
      setMathOperator(context.page.id?.replace("MathPage", "") ?? "");
      entityId.current = context.page.id;
      pages.config.registerOnSaveHandler(onSaveHandler);
      pages.config.setValidityState(true);
      app.notifySuccess();
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
              const op = (data.value) ? data.value.toString() : "add";
              setMathOperator(op);
              entityId.current = `${op}MathPage`;
            }
          }}
          value={mathOperator}></Dropdown>
      </Flex>
    </Provider>
  );
};
