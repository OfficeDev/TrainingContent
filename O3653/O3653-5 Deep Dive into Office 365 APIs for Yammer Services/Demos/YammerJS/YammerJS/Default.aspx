<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="YammerJS._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">


    <div style="margin: 50px;">
        <div class="row">
            <div class="col-md-12">
                <figure>
                    <img src="Images/People_48_x_48.png" id="portrait" />
                </figure>
                <figcaption id="portraitCaption">Unknown User</figcaption>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <span id="yammer-login"></span>
            </div>
        </div>
        <div class="row" style="margin-top:50px;">
            <div class="col-md-12">
                <div id="feedDisplay">
                    <!-- ko foreach: get_messages() -->
                    <div><span data-bind="html: get_senderName()"></span> <span data-bind="html: get_body()"></span></div>
                    <!-- /ko -->
                </div>
            </div>
        </div>
    </div>


</asp:Content>
