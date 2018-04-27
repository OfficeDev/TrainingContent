
using System.Threading.Tasks;

namespace InboxSync.Helpers
{
    public interface IAuthProvider
    {
        Task<string> GetUserAccessTokenAsync();
    }
}