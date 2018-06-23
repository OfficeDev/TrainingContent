import * as React from 'react';
import { render } from 'react-dom';
import { ThemeStyle, ITeamsComponentProps, ITeamsComponentState } from 'msteams-ui-components-react';

/** 
 * State interface for the Teams Base user interface React component
*/
export interface ITeamsBaseComponentState extends ITeamsComponentState {
    fontSize: number;
    theme: ThemeStyle;
}

/** 
 * Properties interface for the Teams Base user interface React component
*/
export interface ITeamsBaseComponentProps extends ITeamsComponentProps {

}


/** 
 * Base implementation of the React based interface for the Microsoft Teams app
*/
export class TeamsBaseComponent<P extends ITeamsBaseComponentProps, S extends ITeamsBaseComponentState>
    extends React.Component<P, S> {

    constructor(props: P, state: S) {
        super(props, state);
    }

    public static render<P extends ITeamsBaseComponentProps>(element: HTMLElement, props: P) {
        render(React.createElement(this, props), element);
    }

    public setValidityState(val: boolean) {
        microsoftTeams.settings.setValidityState(val);
    }


    protected pageFontSize = () => {
        let sizeStr = window.getComputedStyle(document.getElementsByTagName('html')[0]).getPropertyValue('font-size');
        sizeStr = sizeStr.replace('px', '');
        let fontSize = parseInt(sizeStr, 10);
        if (!fontSize) {
            fontSize = 16;
        }
        return fontSize;
    }
    protected inTeams = () => {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    protected updateTheme = (themeStr) => {
        let theme;
        switch (themeStr) {
            case 'dark':
                theme = ThemeStyle.Dark;
                break;
            case 'contrast':
                theme = ThemeStyle.HighContrast;
                break;
            case 'default':
            default:
                theme = ThemeStyle.Light;
        }
        this.setState({ theme });
    }

    protected getQueryVariable = (variable) => {
        const query = window.location.search.substring(1);
        const vars = query.split('&');
        for (const varPairs of vars) {
            const pair = varPairs.split('=');
            if (decodeURIComponent(pair[0]) === variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        return null;
    }
}
