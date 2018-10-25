using ExpenseApproval.Models;
using Microsoft.O365.ActionableMessages.Utilities;
using System;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace ExpenseApproval.Helpers
{
    public class ActionableMessageHelper
    {
        public static async Task<ValidationModel> ValidateTokenAsync(HttpRequestMessage request)
        {
            var sender = ConfigurationManager.AppSettings["sender"].ToLower();
            var emailDomain = ConfigurationManager.AppSettings["emailDomain"].ToLower();
            var registeredActionURL = ConfigurationManager.AppSettings["registeredActionURL"].ToLower();

            var message = string.Empty;
            // Validate that we have a bearer token.
            if (request.Headers.Authorization == null ||
                !string.Equals(request.Headers.Authorization.Scheme, "bearer", StringComparison.OrdinalIgnoreCase) ||
                string.IsNullOrEmpty(request.Headers.Authorization.Parameter))
            {
                message = "Missing authentication token.";
                return new ValidationModel {
                    IsError = true,
                    Message = message,
                    Response = CreateCardResponse(request, HttpStatusCode.Unauthorized, message)
                };
            }

            //Validate the token
            var validator = new ActionableMessageTokenValidator();
            var result = await validator.ValidateTokenAsync(request.Headers.Authorization.Parameter, registeredActionURL);
            if (!result.ValidationSucceeded)
            {
                message = "Invalid token.";
                return new ValidationModel
                {
                    IsError = true,
                    Message = message,
                    Response = CreateCardResponse(request, HttpStatusCode.Unauthorized, message),
                    ValidationResult = result
                };
            }

            
            
            //The sender is registered in the portal and should be a static email address.         
            if (result.Sender.ToLower().CompareTo(sender) != 0)
            {
                message = "Invalid sender.";
                return new ValidationModel
                {
                    IsError = true,
                    Message = message,
                    Response = CreateCardResponse(request, HttpStatusCode.Forbidden, message),
                    ValidationResult = result
                };
            }

            //TODO: Add additional logic to validate the performer. Here we just compare against
            //the domain.
            if (!result.ActionPerformer.ToLower().EndsWith(emailDomain)) {
                message = "The performer is not allowed.";
                return new ValidationModel
                {
                    IsError = true,
                    Message = message,
                    Response = CreateCardResponse(request, HttpStatusCode.Forbidden, message),
                    ValidationResult = result
                };
            }

            //Return a validation model without creating a response, caller must create their own
            //response.
            return new ValidationModel
            {
                IsError = false,
                ValidationResult = result
            };
        }

        internal static HttpResponseMessage CreateCardResponse(HttpRequestMessage request, HttpStatusCode code, string cardStatus)
        {
            if (code == HttpStatusCode.OK)
            {
                HttpResponseMessage response = request.CreateResponse(code);
                response.Headers.Add("CARD-ACTION-STATUS", cardStatus);
                return response;
            }
            else
            {
                var errorResponse = request.CreateErrorResponse(code, new HttpError());
                errorResponse.Headers.Add("CARD-ACTION-STATUS", cardStatus);
                return errorResponse;
            }
        }


        public static string GetCardBody(string value, string result, string performer)
        {
            string template = ExpenseApproval.Properties.Resources.refreshCard;

            return template
                .Replace("{{approvalResult}}", result)
                .Replace("{{performer}}", performer)
                .Replace("{{processDate}}", System.DateTime.Now.ToLongTimeString());           
        }
    }
}
