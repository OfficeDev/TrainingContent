// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System.Threading;
using System.Threading.Tasks;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Schema;
using Microsoft.Extensions.Logging;
using AdaptiveCards;
using System.IO;
using System.Linq;

namespace TeamsBot
{
    /// <summary>
    /// Represents a bot that processes incoming activities.
    /// For each user interaction, an instance of this class is created and the OnTurnAsync method is called.
    /// This is a Transient lifetime service.  Transient lifetime services are created
    /// each time they're requested. For each Activity received, a new instance of this
    /// class is created. Objects that are expensive to construct, or have a lifetime
    /// beyond the single turn, should be carefully managed.
    /// For example, the <see cref="MemoryStorage"/> object and associated
    /// <see cref="IStatePropertyAccessor{T}"/> object are created with a singleton lifetime.
    /// </summary>
    /// <seealso cref="https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-2.1"/>
    public class Bot : IBot
    {
        private readonly ConversationState _conversationState;
        private readonly IStatePropertyAccessor<CounterState> _counterStateAccessor;
        private readonly ILogger _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="Bot"/> class.
        /// </summary>
        /// <param name="accessors">A class containing <see cref="IStatePropertyAccessor{T}"/> used to manage state.</param>
        /// <param name="loggerFactory">A <see cref="ILoggerFactory"/> that is hooked to the Azure App Service provider.</param>
        /// <seealso cref="https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/?view=aspnetcore-2.1#windows-eventlog-provider"/>
        public Bot(ConversationState conversationState, ILoggerFactory loggerFactory)
        {
            if (loggerFactory == null)
            {
                throw new System.ArgumentNullException(nameof(loggerFactory));
            }

            _logger = loggerFactory.CreateLogger<Bot>();
            _logger.LogTrace("EchoBot turn start.");
            _conversationState = conversationState;
            _counterStateAccessor = _conversationState.CreateProperty<CounterState>(nameof(CounterState));
        }

        /// <summary>
        /// Every conversation turn for our Echo Bot will call this method.
        /// There are no dialogs used, since it's "single turn" processing, meaning a single
        /// request and response.
        /// </summary>
        /// <param name="turnContext">A <see cref="ITurnContext"/> containing all the data needed
        /// for processing this conversation turn. </param>
        /// <param name="cancellationToken">(Optional) A <see cref="CancellationToken"/> that can be used by other objects
        /// or threads to receive notice of cancellation.</param>
        /// <returns>A <see cref="Task"/> that represents the work queued to execute.</returns>
        /// <seealso cref="BotStateSet"/>
        /// <seealso cref="ConversationState"/>
        /// <seealso cref="IMiddleware"/>
        public async Task OnTurnAsync(ITurnContext turnContext, CancellationToken cancellationToken = default(CancellationToken))
        {
            // Handle Message activity type, which is the main activity type for shown within a conversational interface
            // Message activities may contain text, speech, interactive cards, and binary or unknown attachments.
            // see https://aka.ms/about-bot-activity-message to learn more about the message and other activity types
            if (turnContext.Activity.Type == ActivityTypes.Message)
            {
                // Get the conversation state from the turn context.
                var state = await _counterStateAccessor.GetAsync(turnContext, () => new CounterState());

                // Bump the turn count for this conversation.
                state.TurnCount++;

                // Set the property using the accessor.
                await _counterStateAccessor.SetAsync(turnContext, state);

                // Save the new turn count into the conversation state.
                await _conversationState.SaveChangesAsync(turnContext);

                // Echo back to the user whatever they typed.
                var responseMessage = $"Turn {state.TurnCount}: You sent '{turnContext.Activity.Text}'\n";
                await turnContext.SendActivityAsync(responseMessage);
            }
            else
            {
                if (turnContext.Activity.Type == ActivityTypes.ConversationUpdate)
                {
                    if (turnContext.Activity.MembersAdded.Any(m => m.Name != "Bot"))
                    {
                        await SendWelcomeCard(turnContext);
                    }
                }
            }
        }
        public async Task SendWelcomeCard(ITurnContext turnContext)
        {
            var card = File.ReadAllText(@".\welcomeCard.json");
            var parsedResult = AdaptiveCard.FromJson(card);
            var attachment = new Attachment
            {
                ContentType = AdaptiveCard.ContentType,
                Content = parsedResult.Card
            };

            var activity = turnContext.Activity.CreateReply();
            activity.Attachments.Add(attachment);

            await turnContext.SendActivityAsync(activity);
        }
    }
}
