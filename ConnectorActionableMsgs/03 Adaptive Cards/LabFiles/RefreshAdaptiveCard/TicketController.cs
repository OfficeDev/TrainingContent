  public class TicketController : ApiController
  {

    // Replace https://api.ngrok.io with your service domain URL.
    // For example, if the service URL is https://api.xyz.com/finance/expense?id=1234,
    // then replace https://api.ngrok.io with https://api.xyz.com
    private const string WebServiceHost = "https://api.ngrok.io";

    // Replace yourdomain.onmicrosoft.com with your email domain.
    private const string SenderEmailDomain = "yourdomain.onmicrosoft.com";

    /// <summary>
    /// The 'Bearer' token type.
    /// </summary>
    private const string BearerTokenType = "bearer";

    /// <summary>
    /// The POST method for the ticket controller.
    /// </summary>
    /// <param name="cardResponse">Value from the POST request body.</param>
    /// <returns>The asynchronous task.</returns>
    // POST api/ticket
    public async Task<HttpResponseMessage> Post(CardResponse cardResponse)
    {
      HttpRequestMessage request = this.ActionContext.Request;

      // Validate that we have a bearer token.
      if (request.Headers.Authorization == null ||
        !string.Equals(request.Headers.Authorization.Scheme, BearerTokenType, StringComparison.OrdinalIgnoreCase) ||
        string.IsNullOrEmpty(request.Headers.Authorization.Parameter))
      {
        return request.CreateErrorResponse(HttpStatusCode.Unauthorized, new HttpError());
      }

      string bearerToken = request.Headers.Authorization.Parameter;
      ActionableMessageTokenValidator validator = new ActionableMessageTokenValidator();

      // ValidateTokenAsync will verify the following
      // 1. The token is issued by Microsoft and its digital signature is valid.
      // 2. The token has not expired.
      // 3. The audience claim matches the service domain URL.
      ActionableMessageTokenValidationResult result = await validator.ValidateTokenAsync(bearerToken, WebServiceHost);

      if (!result.ValidationSucceeded)
      {
        if (result.Exception != null)
        {
          Trace.TraceError(result.Exception.ToString());
        }

        return request.CreateErrorResponse(HttpStatusCode.Unauthorized, new HttpError());
      }

      // We have a valid token. Your application should verify the sender and/or the ActionPerformer
      //
      // You should also return the CARD-ACTION-STATUS header in the response.
      // The value of the header will be displayed to the user.
      if (!result.Sender.ToLower().EndsWith(SenderEmailDomain))
      {
        HttpResponseMessage errorResponse = request.CreateErrorResponse(HttpStatusCode.Forbidden, new HttpError());
        errorResponse.Headers.Add("CARD-ACTION-STATUS", "Invalid sender or the action performer is not allowed.");
        return errorResponse;
      }

      // prepare the response
      HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
      response.Headers.Add("CARD-ACTION-STATUS", "Comment recorded...");

      #region Business logic code here to process the support ticket.
      #endregion

      return response;
    }
  }
