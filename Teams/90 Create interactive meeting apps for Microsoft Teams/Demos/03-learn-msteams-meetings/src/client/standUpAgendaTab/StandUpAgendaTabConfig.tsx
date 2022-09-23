import * as React from "react";
import { Provider, Flex, Header, Input } from "@fluentui/react-northstar";
import { useState, useEffect, useRef } from "react";
import { useTeams } from "msteams-react-base-component";
import { app, pages } from "@microsoft/teams-js";

/**
 * Implementation of Stand-up Agenda configuration page
 */
export const StandUpAgendaTabConfig = () => {

    const [{ inTeams, theme, context }] = useTeams({});
    const [text, setText] = useState<string>();
    const entityId = useRef("");

    const onSaveHandler = (saveEvent: pages.config.SaveEvent) => {
        const host = "https://" + window.location.host;
        pages.config.setConfig({
            contentUrl: host + "/standUpAgendaTab/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}",
            websiteUrl: host + "/standUpAgendaTab/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}",
            suggestedDisplayName: "Stand-up Agenda",
            removeUrl: host + "/standUpAgendaTab/remove.html?theme={theme}",
            entityId: entityId.current
        }).then(() => {
            saveEvent.notifySuccess();
        });
    };

    useEffect(() => {
        if (context) {
            setText(context.page.id);
            entityId.current = context.page.id;
            pages.config.registerOnSaveHandler(onSaveHandler);
            pages.config.setValidityState(true);
            app.notifySuccess();
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
