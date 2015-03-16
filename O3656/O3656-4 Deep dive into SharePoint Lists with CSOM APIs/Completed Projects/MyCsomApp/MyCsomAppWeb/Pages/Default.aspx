<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="MyCsomAppWeb.Default" %>

<!DOCTYPE html>

<html>

<head runat="server">
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=10" />
  <title>My CSOM App</title>
  <link href="../Content/App.css" rel="stylesheet" />
</head>

<body>
  <form id="form1" runat="server">

    <div id="page_width">

      <div id="nav_bar">
        <asp:HyperLink ID="HostWebLink" runat="server" />
      </div>

      <header id="page_header">
        <div id="site_logo">&nbsp</div>
        <h1 id="site_title">My CSOM App</h1>
      </header>

      <nav id="toolbar">
        <asp:Button ID="cmdGetSiteProperties" runat="server" Text="Get Site Properties" />
        <asp:Button ID="cmdGetLists" runat="server" Text="Get Lists" />
        <asp:Button ID="cmdCreateCustomersList" runat="server" Text="Create Customers List" />
      </nav>

      <div id="content_box">
        <asp:Literal ID="placeholderMainContent" runat="server" ></asp:Literal>
      </div>

    </div>
  </form>
</body>
</html>
