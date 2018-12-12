using System.Threading.Tasks;
using System.Web.Http;
using ToDoConnector.Models;

namespace ToDoConnector.Controllers
{
	public class ConnectorController : ApiController
	{
		[HttpPost]
		public async Task<IHttpActionResult> Register(Subscription subscription)
		{
			await TaskHelper.PostWelcomeMessage(subscription.WebHookUri, subscription.GroupName);
			return Ok();
		}
	}
}
