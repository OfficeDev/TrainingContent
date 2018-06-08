using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClientCredsAddin.Utils;

namespace ClientCredsAddin.Models
{
    public class MessageRepository
    {
        private string _accessToken = null;

        public MessageRepository(string accessToken)
        {
            _accessToken = accessToken;
        }

        public async Task<List<string>> GetMessages(string userId)
        {
            var graphClient = AuthHelper.GetGraphServiceClient(_accessToken);
            var messages = await graphClient.Users[userId].Messages.Request().Top(10).Select("Subject").GetAsync();
            return messages.Select(m => m.Subject).ToList();
        }
    }
}