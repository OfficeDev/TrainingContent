<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="TaxonomyMenuInjectWeb.Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Contoso Taxonomy Menu</title>
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="../Scripts/app.js"></script>
</head>
<body style="display: none">
    <form id="form1" runat="server">
        <asp:ScriptManager ID="ScriptManager1" runat="server" EnableCdn="True" />
        <div id="divSPChrome"></div>
        <div style="padding-left: 15px; padding-right: 15px; overflow-y: scroll; position: absolute; top: 132px; bottom: 0px; right: 0px; left: 0px;">
            <div style="padding: 10px;">
                Your current display language settings: <asp:Label ID="currentLanguages" Font-Bold="true" runat="server" /> 
            </div>
            <div>
                <h1 style="padding-left: 10px;">Step 1: Setup term store</h1>
                <div style="padding: 10px;">
                    Click on the button below to create the required term group, term set and terms in term store. Note. You'll have to have right permissions to MMS store
                </div>
                <div style="padding: 10px;">
                    <asp:Button ID="btnAddTaxonomy" Text="Setup term store" OnClick="AddTaxonomy_Click" runat="server" />             
                </div>                              
            </div>        
            <div>
                <h1 style="padding-left: 10px;">Step 2: Add Scripts</h1>
                <div style="padding: 10px;">
                    Click on the button below to upload JQuery and taxonomy JavaScript to the Site Assets library in the host web. This step also registers script links on the web.                     
                </div>
                <div style="padding: 10px;">
                    <asp:Button ID="btnAddScripts" Text="Add scripts and links" OnClick="AddScripts_Click" runat="server" />            
                </div>                                
            </div>               
            <div style="padding: 10px;">
                <h1 style="padding-left: 10px;">Removal</h1>
                <div>
                    Click on the button to remove the script links from the host web.
                </div>
                <div style="margin-top: 10px;">
                    <asp:Button ID="btnRemoveScripts" Text="Remove script links" OnClick="RemoveScripts_Click" runat="server" />
                </div>                                
            </div>
        </div>
    </form>
</body>
</html>
