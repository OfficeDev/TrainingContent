import { TeamsTheme } from './theme';

/**
 * Implementation of the teams app1 Tab content page
 */
export class teamsApp1TabTab {
  configuration?: string;
  groupId?: string;
  token?: string;

  /**
   * Constructor for teamsApp1Tab that initializes the Microsoft Teams script
   */
  constructor() {
    microsoftTeams.initialize();
  }
  /**
   * Method to invoke on page to start processing
   * Add your custom implementation here
   */
  public doStuff() {
    let button = document.getElementById('getDataButton');
    button!.addEventListener('click', e => { this.refresh(); });

    microsoftTeams.getContext((context: microsoftTeams.Context) => {
      TeamsTheme.fix(context);
      this.groupId = context.groupId;
      if (context.entityId) {
        this.configuration = context.entityId;
        let element = document.getElementById('app');
        if (element) {
          element.innerHTML = `The value is: ${this.configuration}`;
        }
      }
    });

  }

  public refresh() {
    let token = "";
    let graphElement = document.getElementById("graph");
    graphElement!.innerText = "Loading...";
    if (this.token === "") {
      microsoftTeams.authentication.authenticate({
        url: "/auth.html",
        width: 400,
        height: 400,
        successCallback: (data) => {
          // Note: token is only good for one hour
          this.token = data!;
          this.getData(this.token);
        },
        failureCallback: function (err) {
          document.getElementById("graph")!.innerHTML = "Failed to authenticate and get token.<br/>" + err;
        }
      });
    }
    else {
      this.getData(this.token);
    }
  }

  public getData(token: string) {
    let graphEndpoint = "https://graph.microsoft.com/v1.0/me";
    if (this.configuration === "group") {
      graphEndpoint = "https://graph.microsoft.com/v1.0/groups/" + this.groupId;
    }

    var req = new XMLHttpRequest();
    req.open("GET", graphEndpoint, false);
    req.setRequestHeader("Authorization", "Bearer " + token);
    req.setRequestHeader("Accept", "application/json;odata.metadata=minimal;");
    req.send();
    var result = JSON.parse(req.responseText);
    document.getElementById("graph")!.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
  }

}