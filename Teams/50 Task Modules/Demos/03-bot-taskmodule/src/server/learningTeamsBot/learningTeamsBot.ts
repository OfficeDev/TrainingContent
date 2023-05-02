import { BotDeclaration, } from "express-msteams-host";
import {
  ActionTypes,
  CardFactory,
  MemoryStorage,
  MessageFactory,
  TeamsActivityHandler,
  TaskModuleTaskInfo,
  TurnContext,
  TaskModuleRequest,
  TaskModuleResponse
} from "botbuilder";
import * as Util from "util";

const TextEncoder = Util.TextEncoder;

@BotDeclaration(
  "/api/messages",
  new MemoryStorage(),
  // eslint-disable-next-line no-undef
  process.env.MICROSOFT_APP_ID,
  // eslint-disable-next-line no-undef
  process.env.MICROSOFT_APP_PASSWORD)
export class LearningTeamsBot extends TeamsActivityHandler {
  constructor() {
    super();

    // create handlers
    this.onMessage(async (context: TurnContext): Promise<void> => {
      switch (context.activity.text.trim().toLowerCase()) {
        case "mentionme": {
          await this.mentionActivity(context);
          return;
        }
        default: {
          const card = CardFactory.heroCard("Learn Microsoft Teams", undefined, [
            {
              type: "invoke",
              title: "Watch 'Task-oriented interactions in Microsoft Teams with messaging extensions'",
              value: { type: "task/fetch", taskModule: "player", videoId: "aHoRK8cr6Og" }
            },
            {
              type: "invoke",
              title: "Watch 'Microsoft Teams embedded web experiences'",
              value: { type: "task/fetch", taskModule: "player", videoId: "AQcdZYkFPCY" }
            },
            {
              type: "invoke",
              title: "Watch a invalid action...",
              value: { type: "task/fetch", taskModule: "something", videoId: "hello-world" }
            },
            {
              type: "invoke",
              title: "Watch Specific Video",
              value: { type: "task/fetch", taskModule: "selector", videoId: "QHPBw7F4OL4" }
            }
          ]);
          await context.sendActivity({ attachments: [card] });
        }
      }
    });
  }

  private async mentionActivity(context: TurnContext) {
    const mention = {
      mentioned: context.activity.from,
      text: `<at>${new TextEncoder().encode(context.activity.from.name)}</at>`,
      type: "mention"
    };

    const replyActivity = MessageFactory.text(`Hi ${mention.text}`);
    replyActivity.entities = [mention];
    await context.sendActivity(replyActivity);
  }

  protected handleTeamsTaskModuleFetch(context: TurnContext, request: TaskModuleRequest): Promise<TaskModuleResponse> {
    let response: TaskModuleResponse;

    switch (request.data.taskModule) {
      case "player":
        response = ({
          task: {
            type: "continue",
            value: {
              title: "YouTube Player",
              url: `https://${process.env.PUBLIC_HOSTNAME}/youTubePlayer1Tab/player.html?vid=${request.data.videoId}`,
              width: 1000,
              height: 700
            } as TaskModuleTaskInfo
          }
        } as TaskModuleResponse);
        break;
      case "selector":
        response = ({
          task: {
            type: "continue",
            value: {
              title: "YouTube Video Selector",
              card: this.getSelectorAdaptiveCard(request.data.videoId),
              width: 350,
              height: 250
            } as TaskModuleTaskInfo
          }
        } as TaskModuleResponse);
        break;
      default:
        response = ({
          task: {
            type: "continue",
            value: {
              title: "YouTube Player",
              url: `https://${process.env.PUBLIC_HOSTNAME}/youTubePlayer1Tab/player.html?vid=X8krAMdGvCQ&default=1`,
              width: 1000,
              height: 700
            } as TaskModuleTaskInfo
          }
        } as TaskModuleResponse);
        break;
    };

    console.log("handleTeamsTaskModuleFetch() response", response);
    return Promise.resolve(response);
  }

  private getSelectorAdaptiveCard(defaultVideoId: string = "") {
    return CardFactory.adaptiveCard({
      type: "AdaptiveCard",
      version: "1.0",
      body: [
        {
          type: "Container",
          items: [
            {
              type: "TextBlock",
              text: "YouTube Video Selector",
              weight: "bolder",
              size: "extraLarge"
            }
          ]
        },
        {
          type: "Container",
          items: [
            {
              type: "TextBlock",
              text: "Enter the ID of a YouTube video to show in the task module player.",
              wrap: true
            },
            {
              type: "Input.Text",
              id: "youTubeVideoId",
              value: defaultVideoId
            }
          ]
        }
      ],
      actions: [
        {
          type: "Action.Submit",
          title: "Update"
        }
      ]
    });
  }

  protected handleTeamsTaskModuleSubmit(context: TurnContext, request: TaskModuleRequest): Promise<TaskModuleResponse> {
    const response: TaskModuleResponse = {
      task: {
        type: "continue",
        value: {
          title: "YouTube Player",
          url: `https://${process.env.PUBLIC_HOSTNAME}/youTubePlayer1Tab/player.html?vid=${request.data.youTubeVideoId}`,
          width: 1000,
          height: 700
        } as TaskModuleTaskInfo
      }
    } as TaskModuleResponse;
    return Promise.resolve(response);
  }

}
