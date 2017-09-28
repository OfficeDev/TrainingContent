using ExpenseApproval.Helpers;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace ExpenseApproval.Controllers
{
    public class ExpenseController : ApiController
    {
        // POST api/values
        public async Task<HttpResponseMessage> Post([FromUri]string id, [FromUri]string action, [FromBody]string value)
        {
            //Validate the token before continuing. 
            var ret = await ActionableMessageHelper.ValidateTokenAsync(Request);
            if(ret.IsError)
            {                                
                Trace.TraceError(ret.Message);                                
                return ret.Response;
            }

            // TODO: Add business logic code here to process the expense report     
            HttpResponseMessage response;
            var approvalResult = default(string);

            if(action == "approve")
            {
                approvalResult = "Approved";
                response = ActionableMessageHelper.CreateCardResponse(Request, HttpStatusCode.OK, "The expense was approved.");
                Trace.TraceInformation("Expense report approved: " + value);
            }
            else
            {
                approvalResult = "Declined";
                response = ActionableMessageHelper.CreateCardResponse(Request, HttpStatusCode.OK, "The expense was declined.");
                Trace.TraceInformation("Expense report declined: " + value);
            }

            //Refresh the card
            response.Headers.Add("CARD-UPDATE-IN-BODY", "true");
            string refreshCard = ActionableMessageHelper.GetCardBody(value, approvalResult, ret.ValidationResult.ActionPerformer);            
            response.Content = new StringContent(refreshCard);

            return response;
        }
    }
}
