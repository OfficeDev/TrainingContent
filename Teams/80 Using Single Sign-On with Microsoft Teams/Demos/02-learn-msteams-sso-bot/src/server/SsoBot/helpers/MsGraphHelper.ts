import { Client } from "@microsoft/microsoft-graph-client";
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

export class MsGraphHelper {
  private msGraphClient: Client;

  constructor(private token: string) {
    this.msGraphClient = Client.init({
      authProvider: (cb) => {
        cb(null, this.token);
      }
    });
  }

  public async getCurrentUser(): Promise<MicrosoftGraph.User> {
    return await this.msGraphClient.api("me").get() as MicrosoftGraph.User;
  }

  public async getMostRecentEmail(): Promise<MicrosoftGraph.Message> {
    const response = await this.msGraphClient.api("me/messages")
      .select("receivedDateTime,subject")
      .orderby("receivedDateTime desc")
      .top(1)
      .get()

    return response.value[0] as MicrosoftGraph.Message;
  }
}