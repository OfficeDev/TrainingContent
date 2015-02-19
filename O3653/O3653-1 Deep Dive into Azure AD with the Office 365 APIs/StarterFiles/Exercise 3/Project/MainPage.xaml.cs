using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Windows.Data.Json;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Security.Authentication.Web;
using Windows.UI;
using Windows.UI.Popups;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;


namespace Win8ServiceDiscovery
{
	/// <summary>
	/// Discovery Service Page
	/// </summary>
	/// 
	public sealed partial class MainPage : Page
	{
		#region Private Fields and Constants
		private const string AccountTypeUnknown = "0";
		private const string AccountTypeMicrosoft = "1";
		private const string AccountTypeOrganizational = "2";

		private const string MyFiles = "MyFiles";
		private const string Read = "Read";
		private const string Scope = MyFiles + "." + Read;

		private readonly Brush SuccessBrush = new SolidColorBrush(Colors.Green);
		private readonly Brush ErrorBrush = new SolidColorBrush(Colors.Red);

		private Dictionary<string, string> m_settings;
		#endregion

		#region Constructors
		public MainPage()
		{
			this.InitializeComponent();

		}
		#endregion

		#region First Sign-In
		/// <summary>
		/// Gets the user realm through navigation.
		/// </summary>
		private async void SigninButton_Click(object sender, RoutedEventArgs e)
		{
			////////////////////////////
			//
			//  First Sign-in code here
			//
			///////////////////////////
		}

		private string TerminalUriText
		{
			get
			{
				var host = this.DiscoveryServiceHost.Text;
				var builder = new StringBuilder(host.Length + 100);
				builder.Append(host);
				if (!host.EndsWith("/")) builder.Append("/");
				builder.Append("discovery/me/this-path-is-only-used-for-termination");

				return builder.ToString();
			}
		}

		private void ParseNavigationResult(string queryString)
		{
			// Re-create the dictionary
			m_settings = new Dictionary<string, string>();

			// Parse the query string
			var queryParams = SplitQueryString(queryString);
			foreach (var param in queryParams)
			{
				var parts = param.Split('=');
				var paramName = parts[0].Trim();
				var paramValue = WebUtility.UrlDecode(parts[1]).Trim();

				// Add the parsed name-value pair to the dictionary
				m_settings[paramName] = paramValue;
			}
		}

		private string[] SplitQueryString(string queryString)
		{
			// Do some hygiene on the query string upfront to ease the parsing
			queryString.Trim();
			var queryStringBegin = queryString.IndexOf('?');

			if (queryStringBegin >= 0)
			{
				queryString = queryString.Substring(queryStringBegin + 1);
			}

			// Now split the query string
			return queryString.Split('&');
		}

		private void RenderUserRealmData()
		{
			// Clear the UI box
			this.Status.Text = string.Empty;

			// Dump the dictionary
			if (m_settings != null)
			{
				foreach (var kvp in m_settings)
				{
					this.Status.Text += string.Format("{0} = '{1}'\n", kvp.Key, kvp.Value);
				}
			}
		}
		#endregion

		#region Get Authorized for Discovery
		/// <summary>
		/// Gets the app authorized to use the desired services on behalf of the current user.
		/// </summary>
		private async void AuthButton_Click(object sender, RoutedEventArgs e)
		{
			this.Status.Text += "------------------------------\n";

			try
			{

				PrepareUserRealmDataForAuthorization();

				// Get authorization code
				if (!await GetAuthorizationCodeAsync()
												.ConfigureAwait(continueOnCapturedContext: true))
				{
					return;
				}

				// Get access token for Discovery
				if (!await GetAccessTokenForDiscoveryAsync()
												.ConfigureAwait(continueOnCapturedContext: true))
				{
					return;
				}
			}
			catch (Exception ex)
			{
				this.Status.Text += "Exception caught: '" + ex.Message + "'.";
				this.Status.Foreground = ErrorBrush;
			}
		}

		//////////////////////////////////////////
		//
		//  Get Authorized For Discovery code here
		//
		//////////////////////////////////////////

		private void PrepareUserRealmDataForAuthorization()
		{
			Config GetId = new Config();
			var accountType = m_settings["account_type"];

			// App registration for Microsoft Account (Live Id)
			if (accountType.Equals(AccountTypeMicrosoft))
			{
				m_settings["client_id"] = GetId.MicrosoftAccountClientId;
				m_settings["client_secret"] = GetId.MicrosoftAccountClientSecret;
				m_settings["authz_redirect_uri"] = GetId.MicrosoftAccountRedirectUri;
			}

			// App registration for Organizational account (Office 365 account)
			else if (accountType.Equals(AccountTypeOrganizational))
			{
				m_settings["client_id"] = GetId.OrganizationalAccountClientId;
				m_settings["client_secret"] = string.Empty;
				m_settings["authz_redirect_uri"] = GetId.OrganizationalAccountRedirectUri;
			}

		}

		private Task<bool> GetAccessTokenForDiscoveryAsync()
		{
			var resource = m_settings["discovery_resource"];
			var grantType = "authorization_code";
			var grantName = "code";
			var grant = m_settings["authz_code"];

			return GetAccessTokenAsync(grantType, grantName, grant, resource);
		}

		private Task<bool> GetAccessTokenForServiceAsync()
		{
			var resource = m_settings[DiscoveryXElements.ServiceResourceId.LocalName];
			var grantType = "refresh_token";
			var grantName = "refresh_token";
			var grant = m_settings["refresh_token"];

			return GetAccessTokenAsync(grantType, grantName, grant, resource);
		}

		#endregion

		#region Discover
		private async void DiscoverButton_Click(object sender, RoutedEventArgs e)
		{
			//////////////////////
			//
			//  Discover code here
			//
			//////////////////////
		}
		#endregion

		#region Get Token for Target Service
		private async void TokenButton_Click(object sender, RoutedEventArgs e)
		{
			//////////////////////////////////////////
			//
			//  Get Token For Target Service code here
			//
			//////////////////////////////////////////
		}
		#endregion

		#region Get Files
		private async void FilesButton_Click(object sender, RoutedEventArgs e)
		{
			this.Status.Text += "==============================\n";

			try
			{
				var json = await GetFilesAsJsonAsync();
				ParseJson(json);
			}
			catch (Exception ex)
			{
				this.Status.Text += "Exception caught: '" + ex.Message + "'.";
				this.Status.Foreground = ErrorBrush;
			}
		}

		///////////////////////
		//
		//  Get Files code here
		//
		///////////////////////

		private void ParseJson(JsonObject json)
		{
			// The JSON responses from SkyDrive and SkyDrive Pro are slightly different
			JsonArray files = null;
			string name = null;
			var accountType = m_settings["account_type"];
			if (accountType.Equals(AccountTypeMicrosoft))
			{
				files = json["data"].GetArray();
				name = "name";
			}
			else if (accountType.Equals(AccountTypeOrganizational))
			{
				files = json["d"].GetObject()["results"].GetArray();
				name = "Name";
			}
			else
			{
				throw new InvalidOperationException(string.Format("Can't get files for account type '{0}'.", accountType));
			}

			// Traverse the files JsonArray and show the item names 
			foreach (var file in files)
			{
				var nameValue = file.GetObject()[name].GetString();
				this.Status.Text += string.Format("'{0}'\n", nameValue);
			}
		}
		#endregion

	}
}
