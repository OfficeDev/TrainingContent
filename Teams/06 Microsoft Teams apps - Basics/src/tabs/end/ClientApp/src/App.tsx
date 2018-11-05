
import * as React from 'react';
import './App.css';
import { TeamsComponentContext, ThemeStyle } from 'msteams-ui-components-react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { TabExample } from './TabExample';
import { ConfigTab } from './ConfigTab';
import { ProjectTab } from './ProjectTab';
import * as microsoftTeamsModule from "@microsoft/teams-js";
//needed for source mapping
const microsoftTeams = microsoftTeamsModule;

class App extends React.Component<{},{
    theme: ThemeStyle
    fontSize: number,
}> {

  constructor(props:any){
    super(props);

    this.state = {
      theme: ThemeStyle.Light,
      fontSize: 16
    }
  }

  public componentWillMount() {
    // If you are deploying your site as a MS Teams static or configurable tab, you should add ?theme={theme} to
    // your tabs URL in the manifest. That way you will get the current theme on start up (calling getContext on
    // the MS Teams SDK has a delay and may cause the default theme to flash before the real one is returned).
    this.updateTheme(this.getQueryVariable('theme'));
    this.setState({
      fontSize: this.pageFontSize(),
    });
 
    // If you are not using the MS Teams web SDK, you can remove this entire if block, otherwise if you want theme
    // changes in the MS Teams client to propogate to the page, you should leave this here.
    if (App.inTeams()) {
      microsoftTeams.initialize();
      microsoftTeams.registerOnThemeChangeHandler(this.updateTheme);
    }
  }

  public render() {
    return (
      <TeamsComponentContext
        fontSize={this.state.fontSize}
        theme={this.state.theme}>
        <Router>
          <div>
            <Route path="/" exact render={() => <TabExample />} />
            <Route path="/config" render={() => <ConfigTab/>} />
            <Route path="/project/:id" render={(props) => <ProjectTab projectId={props.match.params.id} />}/>
          </div>
        </Router>
      </TeamsComponentContext>
    );
  }

  // This is a simple method to check if your webpage is running inside of MS Teams.
  // This just checks to make sure that you are or are not iframed.
  public static inTeams = () => {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  // Sets the correct theme type from the query string parameter.
  private updateTheme = (themeStr: string | null) => {
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

   // Returns the value of a query variable.
   private getQueryVariable = (variable:string): string | null => {
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

  // Grabs the font size in pixels from the HTML element on your page.
  private pageFontSize = () => {
    let sizeStr = window.getComputedStyle(document.getElementsByTagName('html')[0]).getPropertyValue('font-size');
    sizeStr = sizeStr.replace('px', '');
    let fontSize = parseInt(sizeStr, 10);
    if (!fontSize) {
      fontSize = 16;
    }
    return fontSize;
  }
}

export default App;