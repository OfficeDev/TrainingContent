using Microsoft.O365.ActionableMessages.Authentication;
using System.Net.Http;

namespace ExpenseApproval.Models
{
    public class ValidationModel
    {
        public bool IsError { get; set; }
        public ActionableMessageTokenValidationResult ValidationResult { get; set; }
        public HttpResponseMessage Response { get; set; }

        public string Message { get; set; }
    }
}