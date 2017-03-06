<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <meta name="WebPartPageExpansion" content="full" />
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />

    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>

    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.requestexecutor.js"></script>


    <script type="text/javascript" src="../Scripts/App.js"></script>

</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Contact Profile
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">

    <div id="mainDiv">
        <article>
            <div id="portrait">
                <figure>
                    <img id="photo" src="#" alt="photo" />
                </figure>
                <figcaption>
                    <span id="displayName"></span>
                </figcaption>
            </div>
            <div>
                <table id="profileTable">
                    <tr><td>Account Name</td><td><span id="accountName"></span></td></tr>
                    <tr><td>Email Address</td><td><span id="emailAddress"></span></td></tr>
                    <tr><td>Job Title</td><td><span id="title"></span></td></tr>
                    <tr><td>More info</td><td><a id="userUrl" href="#">...</a></td></tr>
                </table>
            </div>
        </article>
    </div>

</asp:Content>
