import {TeamsTheme} from './theme';

/**
 * Implementation of teams app1 Tab configuration page
 */
export class teamsApp1TabConfigure {
    constructor() {
        microsoftTeams.initialize();

        microsoftTeams.getContext((context:microsoftTeams.Context) => {
            TeamsTheme.fix(context);
            let val = <HTMLInputElement>document.getElementById("data");
            if (context.entityId) {
                val.value = context.entityId;
            }
            this.setValidityState(true);
        });
		
        microsoftTeams.settings.registerOnSaveHandler((saveEvent: microsoftTeams.settings.SaveEvent) => {

            let val = <HTMLInputElement>document.getElementById("data");
			// Calculate host dynamically to enable local debugging
			let host = "https://" + window.location.host;
            microsoftTeams.settings.setSettings({
                contentUrl: host + "/teamsApp1TabTab.html?data=",
                suggestedDisplayName: 'teams app1 Tab',
                removeUrl: host + "/teamsApp1TabRemove.html",
				entityId: val.value
            });

            saveEvent.notifySuccess();
        });
    }
    public setValidityState(val: boolean) {
        microsoftTeams.settings.setValidityState(val);
    }
}