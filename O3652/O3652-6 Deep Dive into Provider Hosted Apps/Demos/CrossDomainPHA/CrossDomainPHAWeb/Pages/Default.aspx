<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="CrossDomainPHAWeb.Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <link href="../Content/app.css" rel="stylesheet" />
    <title>Cross-Domain Provider-Hosted App</title>
    <script src="../Scripts/jquery-1.9.1.js"></script>
    <script src="../Scripts/app.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
	<table class="stripe">
		<thead>
			<th>Site</th>
			<th>Title</th>
		</thead>
		<tbody>
			<tr><td>Host Web</td><td><span id="hostTitle"></span></td></tr>
			<tr><td>App Web</td><td><span id="appTitle"></span></td></tr>
		</tbody>
	</table>
    </div>
    </form>
</body>
</html>
