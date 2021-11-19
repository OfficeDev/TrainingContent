import * as React from "react";
import { Provider, Flex, Text, Header } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

/**
 * Implementation of ConfigMathTab remove page
 */
export const ConfigMathTabRemove = () => {

    const [{ inTeams, theme }] = useTeams();

    useEffect(() => {
        if (inTeams === true) {
            microsoftTeams.appInitialization.notifySuccess();
        }
    }, [inTeams]);

    return (
        <Provider theme={theme}>
            <Flex fill={true}>
                <Flex.Item>
                    <div>
                        <Header content="You're about to remove your tab..." />
                        <Text content="You can just add stuff here if you want to clean up when removing the tab. For instance, if you have stored data in an external repository, you can delete or archive it here. If you don't need this remove page you can remove it." />
                    </div>
                </Flex.Item>
            </Flex>
        </Provider>
    );
};
