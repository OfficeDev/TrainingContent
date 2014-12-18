#Demo 1 - Using the REST API for Queries

## Demo REST Using Fiddler
Open a browser, navigate to a SharePoint site and create a new list. Then add a few items to the list.

Next, open Fiddler and use the existing authenticated session to demonstrate how to do simple HTTP GET's, both getting all, filtering and getting one item. Also highlight the following OData operators:

- $select
- $filter
- $orderby

Demonstrate the differences in the payloads (XML vs. JSON).

Demonstrate the `$metadata` endpoint.

Demonstrate how responses show relationships between other entities.

## Demo Completed Lab Solutions

Use the **Completed Solution** from the lab exercise 1 & 2 in this demo: **RestClientSide** & **RestServerSide**.

Show the client-side & server-side code required for querying data from SharePoint lists using the REST API.