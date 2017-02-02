<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <meta name="WebPartPageExpansion" content="full" />
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />

    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="../Scripts/knockout-3.1.0.js"></script>

    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.requestexecutor.js"></script>

    <script type="text/javascript" src="../Scripts/csom.lists.js"></script>
    <script type="text/javascript" src="../Scripts/csom.listitems.js"></script>
    <script type="text/javascript" src="../Scripts/csom.viewmodel.js"></script>
    <script type="text/javascript" src="../Scripts/App.js"></script>
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Host Web CRUD Operations
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div id="loadingDiv">Building lists. This shouldn't take long...</div>
    <div id="mainDiv" style="width:100%">
        <div style="width:100%">
            <input id="inputText" type="text" autofocus placeholder="Text" />
            <input type="button" id="newItemButton" value="Add Item" class="app-button"/>
            <p id="message"></p>
        </div>
        <div style="width:100%">
                <table id="announcementsTable" >
                    <caption>Announcements</caption>
                    <thead>
                        <tr>
                            <th>Title</th>
                        </tr>
                    </thead>
                    <tbody data-bind="foreach: get_items()">
                        <tr>
                            <td data-bind="text: get_title()"></td>
                        </tr>
                    </tbody>
                </table>
        </div>
    </div>

</asp:Content>
