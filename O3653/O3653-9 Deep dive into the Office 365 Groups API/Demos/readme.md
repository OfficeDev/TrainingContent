# Demo 1 - Create Azure AD Application
Take note of the following values when you create the application:

- Client ID
- Client Key
- Azure AD Tenant ID 

## Azure AD Authorization Code Endpoint:
````
https://login.microsoftonline.com/{tenant-id}/oauth2/authorize
?client_id={client-id}
&resource=https://graph.microsoft.com/
&redirect_uri={redirect-uri}
&response_type=code
````

Replace the `{tenant-id}`, `{client-id}` & `{redirect-uri}` with values obtained / set on the Azure AD application.

## Azure AD Token Endpoint
````
https://login.microsoftonline.com/{tenant-id}/oauth2/token
````

HTTP Headers:
````
Accept: application/json
Content-Type: application/x-www-form-urlencoded
````

HTTP Request Body:
````
grant_type=authorization_code
&redirect_uri=https://dev.office.com
&client_id={client-id}
&client_secret={url-encoded-client-secret}
&resource=https://graph.microsoft.com
&code={authorization-code}
````

## Endpoints

- HTTP GET: