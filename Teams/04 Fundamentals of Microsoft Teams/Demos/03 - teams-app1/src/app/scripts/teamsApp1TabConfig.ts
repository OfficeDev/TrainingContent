import {TeamsTheme} from './theme';

/**
 * Implementation of teams app1 Tab configuration page
 */
export class teamsApp1TabConfigure {
	tenantId?: string;

	constructor() {
		microsoftTeams.initialize();

		microsoftTeams.getContext((context: microsoftTeams.Context) => {
			TeamsTheme.fix(context);
			let val = <HTMLInputElement>document.getElementById("graph");
			if (context.entityId) {
				val.value = context.entityId;
			}
			this.setValidityState(val.value !== "");

			this.tenantId = context.tid;
		});

		microsoftTeams.settings.registerOnSaveHandler((saveEvent: microsoftTeams.settings.SaveEvent) => {

			let val = <HTMLInputElement>document.getElementById("graph");

			// Calculate host dynamically to enable local debugging
			let host = "https://" + window.location.host;
			microsoftTeams.settings.setSettings({
				contentUrl: host + "/teamsApp1TabTab.html",
				suggestedDisplayName: 'teamsApp1 Tab',
				removeUrl: host + "/teamsApp1TabRemove.html",
				entityId: val.value
			});

			saveEvent.notifySuccess();

		});
	}
	public setValidityState(val: boolean) {
		microsoftTeams.settings.setValidityState(val);
	}

	public getAdminConsent() {
		microsoftTeams.authentication.authenticate({
			url: "/adminconsent.html?tenantId=" + this.tenantId,
			width: 800,
			height: 600,
			successCallback: () => { },
			failureCallback: (err) => { }
		});
	}
}