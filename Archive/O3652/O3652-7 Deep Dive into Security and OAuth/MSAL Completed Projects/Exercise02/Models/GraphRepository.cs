using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClientCredsAddin.Utils;

namespace ClientCredsAddin.Models
{
    public class GraphRepository
    {
        public async Task<Dictionary<string, string>> GetUsers(string graphToken)
        {
            var users = await AuthHelper.GetGraphServiceClient(graphToken).Users.Request().GetAsync();
            return users.Where(u => !string.IsNullOrEmpty(u.Mail) && u.Mail.EndsWith(SettingsHelper.AzureAdDomain)).ToDictionary(user => user.Id, user => user.Mail);
        }
    }
}