import * as React from "react";
import { Provider, Flex, Header, Dropdown, ShorthandCollection, DropdownItemProps } from "@fluentui/react-northstar";
import { useState, useEffect, useRef } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

interface IColor {
  title: string;
  code: string;
}

const availableColors: IColor[] = [
  {
    title: "Blue",
    code: "#dce6ee"
  },
  {
    title: "Orange",
    code: "#ffc300"
  }
];

/**
 * Implementation of the myFirstTeamsConnector Connector connect page
 */
export const MyFirstTeamsConnectorConfig = () => {

  const [{ theme, context }] = useTeams();
  const [color, setColor] = useState<IColor>();
  const colorRef = useRef(color);
  colorRef.current = color;

  useEffect(() => {
    if (context) {
      microsoftTeams.settings.registerOnSaveHandler((saveEvent: microsoftTeams.settings.SaveEvent) => {
        // INFO: Should really be of type microsoftTeams.settings.Settings, but configName does not exist in the Teams JS SDK
        const settings: any = {
          entityId: colorRef.current ? colorRef.current.code : availableColors[0].code,
          contentUrl: `https://${process.env.PUBLIC_HOSTNAME}/myFirstTeamsConnector/config.html?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}`,
          configName: colorRef.current ? colorRef.current.title : availableColors[0].title
        };
        microsoftTeams.settings.setSettings(settings);

        microsoftTeams.settings.getSettings((setting: any) => {
          fetch("/api/connector/connect", {
            method: "POST",
            headers: [
              ["Content-Type", "application/json"]
            ],
            body: JSON.stringify({
              webhookUrl: setting.webhookUrl,
              user: setting.userObjectId,
              appType: setting.appType,
              groupName: context.groupId,
              color: colorRef.current ? colorRef.current.code : availableColors[0].code,
              state: "myAppsState"
            })
          }).then(response => {
            if (response.status === 200 || response.status === 302) {
              saveEvent.notifySuccess();
            } else {
              saveEvent.notifyFailure(response.statusText);
            }
          }).catch(e => {
            saveEvent.notifyFailure(e);
          });
        });
      });

      microsoftTeams.settings.getSettings((settings: any) => {
        setColor(availableColors.filter(c => c.code === settings.entityId)[0]);
      });
    }
  }, [context]);

  useEffect(() => {
    if (context) {
      microsoftTeams.settings.setValidityState(color !== undefined);
    }
  }, [color, context]);

  const colors: ShorthandCollection<DropdownItemProps> = availableColors.map(clr => {
    return {
      header: clr.title,
      selected: color && clr.code === color.code,
      onClick: () => {
        setColor(clr);
        microsoftTeams.settings.setValidityState(clr !== undefined);
      }
    };
  });

  return (
    <Provider theme={theme}>
      <Flex fill={true}>
        <Flex.Item>
          <div>
            <Header content="Configure your Connector" />
            <Dropdown
              items={colors}
              placeholder="Select card color"
              checkable
            />
          </div>
        </Flex.Item>
      </Flex>
    </Provider>
  );
};
