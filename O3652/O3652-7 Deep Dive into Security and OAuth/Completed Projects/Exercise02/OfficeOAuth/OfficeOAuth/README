Office 365 Client Libraries for Web Projects

To use the sample code from an ASP.NET page, the following is required.

1) Add Async="true" to the Page directive.

    <%@ Page Title="Home Page" Async="true" ... %>

2) Add a method to call the async method and use the result.

    private async System.Threading.Tasks.Task GetMyMessages()
    {
        var messages = await MailApiSample.GetMessages();
        // ...
    }

3) Register the method (e.g. GetMyMessages) containing the code that will run asynchronously.
    RegisterAsyncTask(new PageAsyncTask(GetMyMessages));
