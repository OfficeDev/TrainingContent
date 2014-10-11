<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Embed._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

<div id="embedded-feed" style="height:800px;width:400px;"></div>
<script src="https://assets.yammer.com/assets/platform_embed.js"></script>
<script> yam.connect.embedFeed({
     container: "#embedded-feed",
     network: "",
     feedType: "group",
     feedId: "all"
 });
</script>


</asp:Content>
