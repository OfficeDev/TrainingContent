import * as React from "react";
import { Provider, Flex, Header, Input } from "@fluentui/react-northstar";
import { useState, useEffect, useRef } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

/**
 * Implementation of MSGraph Teamwork configuration page
 */
export const MsGraphTeamworkTabConfig = () => {

    const [{ inTeams, theme, context }] = useTeams({});
    const [text, setText] = useState<string>();
    const entityId = useRef("");

    const onSaveHandler = (saveEvent: microsoftTeams.settings.SaveEvent) => {
        const host = "https://" + window.location.host;
        microsoftTeams.settings.setSettings({
            contentUrl: host + "/msGraphTeamworkTab/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}",
            websiteUrl: host + "/msGraphTeamworkTab/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}",
            suggestedDisplayName: "MSGraph Teamwork",
            removeUrl: host + "/msGraphTeamworkTab/remove.html?theme={theme}",
            entityId: entityId.current
        });
        saveEvent.notifySuccess();
    };

    useEffect(() => {
        if (context) {
            setText(context.entityId);
            entityId.current = context.entityId;
            microsoftTeams.settings.registerOnSaveHandler(onSaveHandler);
            microsoftTeams.settings.setValidityState(true);
            microsoftTeams.appInitialization.notifySuccess();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context]);

    return (
        <Provider theme={theme}>
            <Flex fill={true}>
                <Flex.Item>
                    <div>
                        <Header content="Configure your tab" />
                        <Input
                            placeholder="Enter a value here"
                            fluid
                            clearable
                            value={text}
                            onChange={(e, data) => {
                                if (data) {
                                    setText(data.value);
                                    entityId.current = data.value;
                                }
                            }}
                            required />
                    </div>
                </Flex.Item>
            </Flex>
        </Provider>
    );
};
