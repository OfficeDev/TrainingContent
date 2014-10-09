<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="YammerSDKApp._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div style="margin: 50px">
        <div class="row">
            <div class="col-md-12">
                <span id="yammer-login"></span>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4"></div>
            <div class="col-md-2">
                <input type="text" id="searchText" />
            </div>
            <div class="col-md-2">
                <input type="button" id="searchButton" value="Search Yammer" />
            </div>
            <div class="col-md-4"></div>
        </div>
        <div class="row" id="searchResults">
        </div>
    </div>
</asp:Content>
