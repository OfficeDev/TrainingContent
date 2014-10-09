<%@ Page Async="true" Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="YammerOGApp._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div style="margin: 50px">
        <div class="form-horizontal">
            <div class="form-group">
                <div class="col-md-2">Actor Name</div>
                <div class="col-md-10">
                    <asp:TextBox ID="actorName" runat="server" Width="250" Text="Your name" />
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-2">Actor E-mail</div>
                <div class="col-md-10">
                    <asp:TextBox ID="actorEmail" runat="server" Width="250" Text="Your e-mail" />
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-2">Message</div>
                <div class="col-md-10">
                    <asp:TextBox ID="activityMessage" runat="server" Width="250" Text="Check out this great video on Microsoft Virtual Academy" />
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-2">Object URL</div>
                <div class="col-md-10">
                    <asp:TextBox ID="objectUrl" runat="server" Width="250" Text="http://www.microsoftvirtualacademy.com/training-courses/introduction-to-office-365-development" />
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-2">Object Title</div>
                <div class="col-md-10">
                    <asp:TextBox ID="objectTitle" runat="server" Width="250" Text="Introduction to Office 365 Development" />
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-offset-2 col-md-10">
                    <asp:Button ID="createActivity" runat="server" CssClass="btn btn-default" Text="Create Activity" OnClick="createActivity_Click" />
                </div>
            </div>
        </div>
    </div>
</asp:Content>
