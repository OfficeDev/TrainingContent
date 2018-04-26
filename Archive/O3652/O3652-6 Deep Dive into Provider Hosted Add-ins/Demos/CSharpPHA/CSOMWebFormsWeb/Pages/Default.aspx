<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="CSOMWebFormsWeb.Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
	<title></title>
	<style type="text/css">
		.stripe
	{
		font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;
		font-size: 12px;
		margin: 45px;
		width: 480px;
		text-align: left;
		border-collapse: collapse;
	}
	.stripe th
	{
		font-size: 14px;
		font-weight: normal;
		padding: 10px 8px;
		color: #039;
	}
	.stripe td
	{
		padding: 8px;
		color: #669;
	}
	.stripe .odd
	{
		background: #e8edff; 
	}
	</style>
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
			<tr><td>Host Web</td><td><asp:Label runat="server" ID="hostWebTitle" /></td></tr>
			<tr><td>App Web</td><td><asp:Label runat="server" ID="appWebTitle" /></td></tr>
		</tbody>
	</table>
	</div>
	</form>
</body>
</html>
