using System;
using System.Security;
using System.Net;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.UserProfiles;

namespace UserProfilePropertySync
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                //Get the tenant admin information needed to read and update user profile data
                string tenantAdminUrl = GetString("Enter your tenant admin url (https://tenantname-admin.sharepoint.com): ");

                string tenantAdminUser = GetString("Enter your tenant admin user (user@tenantname.onmicrosoft.com): ");
                SecureString tenantAdminPassword = GetPassword();

                //Provide the user profile Account name property value of the user profile to read/update
                string userToUpdate = "i:0#.f|membership|" + tenantAdminUser;


                using (ClientContext clientContext = new ClientContext(tenantAdminUrl))
                {
                    clientContext.Credentials = new SharePointOnlineCredentials(tenantAdminUser, tenantAdminPassword);

                    // Get the people manager instance for tenant context
                    PeopleManager peopleManager = new PeopleManager(clientContext);

                    //Read a user profile property 
                    Console.ForegroundColor = ConsoleColor.Green;
                    string userProfileProperty = "AboutMe";
                    Console.WriteLine("Current value of the {0} property for user {1}:", userProfileProperty, userToUpdate);

                    //Update a user profile property
                    string newAboutMeValue = GetString(String.Format("Enter a new value to be set for property {0}:", userProfileProperty));

                    Console.WriteLine("Setting new value...");

                    // Update the AboutMe property for the user using account name.
                    peopleManager.SetSingleValueProfileProperty(userToUpdate, userProfileProperty, newAboutMeValue);

                    clientContext.ExecuteQuery();
                }
                Console.WriteLine("Press any key to continue.");
                Console.Read();

            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(string.Format("Exception!"), ex.ToString());
                Console.WriteLine("Press any key to continue.");
                Console.Read();
                throw;
            }

        }

        public static string GetString(string question)
        {
            string userInput = string.Empty;
            try
            {
                Console.Write(question);
                userInput = Console.ReadLine();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                userInput = string.Empty;
            }
            return userInput;
        }

        public static SecureString GetPassword()
        {
            SecureString sStrPwd = new SecureString();

            try
            {
                Console.Write("Enter the SharePoint Tenant Admin password: ");

                for (ConsoleKeyInfo keyInfo = Console.ReadKey(true); keyInfo.Key != ConsoleKey.Enter; keyInfo = Console.ReadKey(true))
                {
                    if (keyInfo.Key == ConsoleKey.Backspace)
                    {
                        if (sStrPwd.Length > 0)
                        {
                            sStrPwd.RemoveAt(sStrPwd.Length - 1);
                            Console.SetCursorPosition(Console.CursorLeft - 1, Console.CursorTop);
                            Console.Write(" ");
                            Console.SetCursorPosition(Console.CursorLeft - 1, Console.CursorTop);
                        }
                    }
                    else if (keyInfo.Key != ConsoleKey.Enter)
                    {
                        Console.Write("*");
                        sStrPwd.AppendChar(keyInfo.KeyChar);
                    }

                }
                Console.WriteLine("");
            }
            catch (Exception e)
            {
                sStrPwd = null;
                Console.WriteLine(e.Message);
            }

            return sStrPwd;
        }

    }
}
